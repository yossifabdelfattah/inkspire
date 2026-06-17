# Architecture

Inkspire is an npm-workspaces monorepo with a React client and an
Express/MongoDB server, plus this `docs/` directory.

## Monorepo Structure

```
Inkspire/
├── apps/
│   ├── client/                 # React 19 + Vite + TypeScript SPA
│   │   └── src/
│   │       ├── api/            # Axios instance + auth interceptor
│   │       ├── components/     # Reusable UI components
│   │       ├── constants/      # Shared constants (shipping rules, etc.)
│   │       ├── context/        # Auth + Cart context providers
│   │       ├── firebase/       # Firebase SDK init
│   │       ├── hooks/          # useFetch and other custom hooks
│   │       ├── pages/          # Route-level pages (+ admin/)
│   │       ├── routes/         # AppRouter route table
│   │       ├── services/       # Per-domain API service layer
│   │       ├── styles/         # Theme + global styled-components
│   │       └── types/          # Shared TypeScript types
│   └── server/                 # Express + TypeScript + Mongoose API
│       └── src/
│           ├── config/         # env, db, Firebase Admin, socket, shipping
│           ├── middleware/     # notFound, error handler, ObjectId validation
│           ├── modules/        # Feature modules (see below)
│           ├── seed/           # Seed scripts + data
│           └── utils/          # asyncHandler, ApiError, transaction helper
└── docs/                       # This documentation
```

## Client Architecture

- **Entry & providers** — `main.tsx` mounts the app inside `MantineProvider`,
  `ThemeProvider` (styled-components), `BrowserRouter`, `AuthProvider`, and
  `CartProvider`. `App.tsx` renders the navbar, footer, and `AppRouter`.
- **Routing** — `routes/AppRouter.tsx` declares all routes. Authenticated
  routes are wrapped in `ProtectedRoute`; admin routes in `AdminRoute`.
  Legacy `/products` paths redirect to `/books`.
- **Context providers** — `AuthProvider` subscribes to Firebase auth state,
  then fetches the MongoDB profile to learn the user's `role`. `CartProvider`
  holds the shopping cart.
- **Service layer** — `services/*.ts` wrap all API calls (books, reviews,
  orders, reservations, checkout, book requests, stores, admin, user, auth).
  They use a shared Axios instance (`api/axios.ts`) that attaches the Firebase
  ID token as a `Bearer` header on every request.
- **`useFetch` hook** — `hooks/useFetch.ts` runs a fetcher whenever its deps
  change, tracking `loading`/`error` state and aborting the previous request
  (via `AbortController`) on dependency change or unmount.

## Server Architecture

Each feature module under `src/modules` is self-contained and typically
contains:

| File          | Responsibility                                               |
| ------------- | ------------------------------------------------------------ |
| `*.model.ts`  | Mongoose schema and model                                    |
| `*.types.ts`  | Shared TypeScript types/interfaces for the module            |
| `*.controller.ts` | Thin HTTP layer: parse the request, call a service, send the response |
| `*.routes.ts` | Express router wiring paths → middleware → controller        |
| `*.service.ts`| Business logic, data access, and validation                  |

Routers are mounted in `app.ts`. `server.ts` connects to MongoDB, starts the
reservation cleanup job, creates the HTTP server, initializes Socket.IO, and
listens on `PORT`.

### Key Design Decisions

- **Thin controllers, logic in services** — controllers do minimal work;
  validation, data access, and rules live in service files. This keeps the HTTP
  layer testable and the logic reusable.
- **`asyncHandler` wrapping** — async route handlers and middleware are wrapped
  in `asyncHandler` so thrown errors propagate to the central error handler
  instead of crashing the process.
- **`ApiError`** — services throw `ApiError(status, message)` to signal HTTP
  errors with a status code; the error middleware turns them into JSON
  responses.
- **`withOptionalTransaction`** — wraps multi-step writes (e.g. checkout) in a
  MongoDB transaction when the deployment supports them (replica set), and runs
  the same logic without a session otherwise, so atomicity is used when
  available without breaking single-node setups.

## API Route Table

All routes are mounted under `/api`. "Auth" indicates the required middleware:
**None** (public), **Optional** (`attachUserIfPresent` — personalizes if a valid
token is present but never blocks), **User** (`verifyFirebaseToken`), or
**Admin** (`verifyFirebaseToken` + `requireAdmin`).

| Method | Path                                  | Auth     | Description                                            |
| ------ | ------------------------------------- | -------- | ----------------------------------------------------- |
| GET    | `/`                                   | None     | Health check (`API is running`)                       |
| GET    | `/api/books`                          | Optional | List books; logs the search with the user if present  |
| GET    | `/api/books/recommendations`          | Optional | Personalized recommendations (works for anonymous too)|
| GET    | `/api/books/:id/related`              | None     | Books in the same category as the given book          |
| GET    | `/api/books/:id/stores`               | None     | Stores currently stocking the given book              |
| GET    | `/api/books/:id`                      | None     | Single book by id                                     |
| POST   | `/api/books`                          | Admin    | Create a book                                         |
| PUT    | `/api/books/:id`                      | Admin    | Update a book                                         |
| DELETE | `/api/books/:id`                      | Admin    | Delete a book                                         |
| GET    | `/api/books/:bookId/reviews`          | None     | List reviews for a book                               |
| POST   | `/api/books/:bookId/reviews`          | User     | Create or update the caller's review for a book       |
| POST   | `/api/reservations`                   | Optional | Reserve stock for cart items (anonymous or logged-in) |
| GET    | `/api/reservations/:id`               | Optional | Get a reservation's status (re-checks expiry)         |
| POST   | `/api/checkout`                       | User     | Complete checkout: claim reservation, create order    |
| POST   | `/api/orders`                         | User     | Create an order                                       |
| GET    | `/api/orders`                         | User     | List the caller's orders                              |
| POST   | `/api/book-requests`                  | Optional | Submit a book request (requester tracked if present)  |
| GET    | `/api/book-requests`                  | Admin    | List all book requests                                |
| GET    | `/api/book-requests/:id/candidates`   | Admin    | Metadata candidate suggestions for a request          |
| PATCH  | `/api/book-requests/:id`              | Admin    | Approve or reject a book request                      |
| GET    | `/api/users/me`                       | User     | Get the caller's MongoDB profile (incl. role)         |
| PATCH  | `/api/users/me`                       | User     | Update the caller's display name                      |
| GET    | `/api/admin/analytics/overview`       | Admin    | High-level metrics overview                           |
| GET    | `/api/admin/analytics/searches`       | Admin    | Top search terms                                      |
| GET    | `/api/admin/analytics/sales`          | Admin    | Sales over time                                       |
| GET    | `/api/admin/analytics/requests`       | Admin    | Most-requested books                                  |
| GET    | `/api/admin/analytics/purchases`      | Admin    | Top-purchased books                                   |

> Note: the `stores` module router is currently empty; store data is surfaced
> via `GET /api/books/:id/stores`.
