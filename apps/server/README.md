# Inkspire Server

The Inkspire backend: an Express REST API written in TypeScript, backed by
MongoDB via Mongoose, with Firebase Admin SDK token verification and Socket.IO
for real-time updates. Business logic lives in per-module service files; routes
and controllers stay thin.

## MongoDB Setup

You can use either a local MongoDB or MongoDB Atlas.

**Local:**

1. Install MongoDB Community Edition.
2. Start the database: `mongod`.
3. Use the default connection string in `.env`:
   `mongodb://127.0.0.1:27017/fullstack-ecommerce`.

**MongoDB Atlas (free tier):**

1. Create a free cluster at <https://www.mongodb.com/atlas>.
2. Add a database user and allow your IP under Network Access.
3. Copy the SRV connection string into `MONGO_URI` in `.env`.

## Firebase Admin SDK Setup

The server verifies the Firebase ID tokens sent by the client.

1. Go to **Firebase Console → Project Settings → Service Accounts**.
2. Click **Generate new private key** to download a JSON file.
3. Copy these values from the JSON into your `.env`:
   - `FIREBASE_PROJECT_ID` ← `project_id`
   - `FIREBASE_CLIENT_EMAIL` ← `client_email`
   - `FIREBASE_PRIVATE_KEY` ← `private_key` (keep the literal `\n` sequences;
     wrap the whole value in double quotes)

If these are left blank the server still boots, but authenticated endpoints
return `503` until they are configured.

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable                | Required | Description                                       |
| ----------------------- | -------- | ------------------------------------------------- |
| `PORT`                  | No       | Server port (default `5000`)                      |
| `MONGO_URI`             | Yes      | MongoDB connection string                         |
| `NODE_ENV`              | No       | `development` or `production`                     |
| `CLIENT_URL`            | Yes      | Allowed CORS / Socket.IO origin (the client URL)  |
| `FIREBASE_PROJECT_ID`   | Yes      | Service-account project ID                         |
| `FIREBASE_CLIENT_EMAIL` | Yes      | Service-account client email                       |
| `FIREBASE_PRIVATE_KEY`  | Yes      | Service-account private key (single line, `\n` escaped) |
| `GOOGLE_BOOKS_API_KEY`  | No       | Raises the Google Books API rate limit             |

## Scripts

| Script       | Command                              | Description                              |
| ------------ | ------------------------------------ | ---------------------------------------- |
| `dev`        | `npm run dev -w apps/server`         | `tsx watch` — hot reload                 |
| `build`      | `npm run build -w apps/server`       | `tsc` compile to `dist/`                 |
| `start`      | `npm run start -w apps/server`       | Run compiled `dist/server.js`            |
| `seed`       | `npm run seed -w apps/server`        | Seed books (skip if DB already has data) |
| `seed:fresh` | `npm run seed:fresh -w apps/server`  | Drop and re-seed books                   |
| `seed:stores`| `npm run seed:stores -w apps/server` | Seed store locations                     |
| `dev:seed`   | `npm run dev:seed -w apps/server`    | `seed` + `dev` in sequence               |

## Module Structure

All feature modules live under `src/modules`. Each module groups its model,
types, controller, routes, and service:

```
apps/server/src/modules/
├── admin/         # Admin router; mounts analytics, guards with requireAdmin
├── analytics/     # Sales/search/request/purchase metrics + search log model
├── auth/          # User model, Firebase token middleware, user service, /users/me
├── bookRequests/  # "Request a book" flow + Google Books candidate lookup
├── books/         # Book catalog: CRUD, recommendations, related, store availability
├── checkout/      # Checkout service: claims a reservation, decrements stock, creates order
├── orders/        # Order model + per-user order history
├── reservations/  # Inventory reservations + expiry cleanup service
├── reviews/       # Per-book reviews (nested under /books/:bookId/reviews)
└── stores/        # Store + inventory models (reserved router for future endpoints)
```

Supporting code lives alongside the modules:

```
apps/server/src/
├── config/        # env, db connection, Firebase Admin init, Socket.IO, shipping rules
├── middleware/    # notFound, error handler, ObjectId validation
├── seed/          # Book and store seed scripts + data
└── utils/         # asyncHandler, ApiError, withOptionalTransaction
```
