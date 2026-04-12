# Inkspire

Inkspire is a full-stack e-commerce monorepo with a React client and an Express/MongoDB API. This README is intended to help new contributors get the app running quickly and understand where the main pieces live.

## Tech Stack

- Frontend: React, Vite, React Router, styled-components, axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Tooling: npm workspaces, concurrently, nodemon

## Repository Layout

```txt
apps/
  client/   # React app
  server/   # Express API
```

### Client

- `src/routes/AppRouter.jsx` defines the app routes
- `src/context/` holds auth and cart state
- `src/api/axios.js` configures the API client
- `src/components/` contains shared UI and layout pieces

### Server

- `src/server.js` boots the API, middleware, and routes
- `src/config/db.js` connects to MongoDB
- `src/controllers/` contains request handlers
- `src/routes/` exposes the API surface
- `src/models/` contains the Mongoose schemas

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- MongoDB running locally or a reachable MongoDB Atlas connection

## Setup

Install dependencies from the repository root:

```bash
npm install
```

Create the server environment file by copying the example:

```bash
# macOS/Linux
cp apps/server/.env.example apps/server/.env

# Windows PowerShell
Copy-Item apps\server\.env.example apps\server\.env
```

Update `apps/server/.env` with your own values if needed.

## Environment Variables

The server reads these values from `apps/server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fullstack-ecommerce
JWT_SECRET=replace_this_with_a_secure_secret
NODE_ENV=development
```

## Running the App

Start both client and server together from the root:

```bash
npm run dev
```

Useful workspace scripts:

- `npm run client` starts only the Vite app
- `npm run server` starts only the API
- `npm run install:all` installs root, client, and server dependencies

Default local ports:

- Client: `http://localhost:5173`
- Server: `http://localhost:5000`

## Main API Routes

The client talks to the API at `http://localhost:5000/api`.

- `POST /api/auth/register` creates a user
- `POST /api/auth/login` authenticates a user
- `GET /api/products` lists products
- `GET /api/products/:id` fetches a single product
- `GET /api/cart` returns the cart view data
- `GET /api/orders` returns the authenticated user's orders
- `POST /api/orders` creates an order for the authenticated user

## App Flow

The current client routes are:

- `/` home page
- `/login` sign in
- `/register` sign up
- `/products` product listing
- `/products/:id` product details
- `/cart` shopping cart
- `/checkout` checkout flow

Auth and cart state are managed with React context, and the app shell is composed in `src/App.jsx` with shared navigation and footer components.

## Development Notes

- The client API base URL is hardcoded in `apps/client/src/api/axios.js` for local development.
- The server uses JWT-based authentication and MongoDB for persistence.
- Validation is handled on selected routes with `express-validator` and custom middleware.
- There are currently no automated tests configured in the workspace scripts.

## Branching Policy

- The main branch is protected.
- No one may commit or push directly to main.
- All work must be done on a separate feature branch.
- Every change must be submitted through a pull request.
- Each pull request must be approved by at least 2 reviewers before merging.
- If new commits are pushed to the pull request, previous approvals may be dismissed and fresh approval is required.

## Next Steps For Contributors

When you first pull the repo, the fastest sanity check is to confirm the server connects to MongoDB and that `npm run dev` brings up both apps without errors. After that, the best entry points are the route files in `apps/server/src/routes/` and the page components in `apps/client/src/pages/`
