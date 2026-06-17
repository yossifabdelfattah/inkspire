# Inkspire

A full-stack online bookstore with real-time inventory reservations, Firebase
authentication, a multi-step checkout, an admin dashboard, and analytics.

## Features

- Browse, search, and filter a catalog of books by category, author, and title
- Book detail pages with related-book suggestions and personalized
  recommendations (works for both logged-in and anonymous visitors)
- Per-book customer reviews and ratings (one review per user per book)
- Cart with stock-aware quantities backed by atomic inventory reservations
- Five-step checkout: Cart Review, Shipping, Delivery, Payment (mock),
  Confirmation
- Inventory reservations that hold stock for 10 minutes and are released
  automatically on expiry, preventing overselling during checkout
- Delivery options (standard, express, in-store pickup) with rule-based
  shipping costs and free standard shipping over $50
- Order history per user
- "Request a book" flow with Google Books metadata lookup and an
  AI-assisted candidate picker for admins approving requests
- In-store availability map showing which stores stock a given book (Leaflet)
- Admin dashboard: manage books, review/approve book requests, and view
  analytics (sales over time, top searches, most-requested and
  top-purchased books)
- Firebase Authentication with Email/Password and Google sign-in; roles
  (`user` / `admin`) stored in MongoDB
- Real-time updates over Socket.IO

## Tech Stack

| Layer     | Technology                                                        |
| --------- | ----------------------------------------------------------------- |
| Frontend  | React 19, Vite, TypeScript, React Router, styled-components, Mantine, Recharts, Leaflet |
| Backend   | Node.js, Express, TypeScript, Mongoose                            |
| Auth      | Firebase Authentication (client) + Firebase Admin SDK (server)   |
| Database  | MongoDB (via Mongoose)                                            |
| Realtime  | Socket.IO (server + client)                                      |

## Architecture

Inkspire is an npm-workspaces monorepo with two applications:

```
Inkspire/
├── apps/
│   ├── client/   # React 19 + Vite + TypeScript single-page app
│   └── server/   # Express + TypeScript + Mongoose REST API + Socket.IO
└── docs/         # Architecture and flow documentation
```

The server is organized into self-contained feature modules under
`apps/server/src/modules`. Each module typically contains a Mongoose `model`,
`types`, a thin `controller`, `routes`, and a `service` that holds the business
logic. See [`docs/architecture.md`](docs/architecture.md) for details.

## Prerequisites

- Node.js 18 or newer
- A running MongoDB instance (local `mongod` or MongoDB Atlas)
- A Firebase project with Authentication enabled (Email/Password and Google)

## Installation

```bash
git clone <your-repo-url> Inkspire
cd Inkspire
npm install
```

The root `npm install` installs dependencies for both workspaces. If you need
to (re)install everything explicitly:

```bash
npm run install:all
```

## Environment Setup

Each workspace has its own environment file. Copy the examples and fill in your
values:

```bash
cp apps/client/.env.example apps/client/.env
cp apps/server/.env.example apps/server/.env
```

- Client variables are documented in
  [`apps/client/.env.example`](apps/client/.env.example) (Firebase Web App
  config + the API base URL).
- Server variables are documented in
  [`apps/server/.env.example`](apps/server/.env.example) (port, MongoDB URI,
  client origin, and Firebase Admin service-account credentials).

See [`apps/client/README.md`](apps/client/README.md) and
[`apps/server/README.md`](apps/server/README.md) for step-by-step Firebase and
MongoDB setup.

## Running Locally

From the repository root, start both apps together:

```bash
npm run dev
```

This runs the Vite dev server for the client and a seed-then-watch process for
the server concurrently.

To run them separately:

```bash
npm run client   # Vite dev server (client)
npm run server   # seed books, then start the server with hot reload
```

By default the client runs on `http://localhost:5173` and the server on
`http://localhost:5000`.

## Seeding the Database

The server ships with seed data for books and stores:

```bash
npm run seed -w apps/server         # seed books only if the collection is empty
npm run seed:fresh -w apps/server   # drop existing books and reseed
npm run seed:stores -w apps/server  # seed store locations
```

The root `npm run dev` (and `npm run server`) automatically run the
non-destructive `seed` step before starting the server.

## Scripts Reference

### Root (`package.json`)

| Script        | Command                  | Description                                                   |
| ------------- | ------------------------ | ------------------------------------------------------------ |
| `dev`         | `npm run dev`            | Run client and server concurrently (server seeds first)      |
| `client`      | `npm run client`         | Run the client Vite dev server                               |
| `server`      | `npm run server`         | Seed books, then start the server with hot reload            |
| `install:all` | `npm run install:all`    | Install root + both workspace dependencies                   |

### Client (`apps/client`)

| Script    | Command                          | Description                            |
| --------- | -------------------------------- | -------------------------------------- |
| `dev`     | `npm run dev -w apps/client`     | Start the Vite dev server              |
| `build`   | `npm run build -w apps/client`   | Type-check and build for production     |
| `lint`    | `npm run lint -w apps/client`    | Run ESLint                             |
| `preview` | `npm run preview -w apps/client` | Preview the production build locally    |

### Server (`apps/server`)

| Script        | Command                              | Description                              |
| ------------- | ------------------------------------ | ---------------------------------------- |
| `dev`         | `npm run dev -w apps/server`         | `tsx watch` with hot reload              |
| `build`       | `npm run build -w apps/server`       | Compile TypeScript to `dist/`            |
| `start`       | `npm run start -w apps/server`       | Run the compiled `dist/server.js`        |
| `seed`        | `npm run seed -w apps/server`        | Seed books (skips if the collection has data) |
| `seed:fresh`  | `npm run seed:fresh -w apps/server`  | Drop and reseed books                    |
| `seed:stores` | `npm run seed:stores -w apps/server` | Seed store locations                     |
| `dev:seed`    | `npm run dev:seed -w apps/server`    | Run `seed` then `dev` in sequence        |

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — monorepo and module structure, API route table
- [`docs/authentication-flow.md`](docs/authentication-flow.md) — Firebase auth and role handling
- [`docs/checkout-flow.md`](docs/checkout-flow.md) — the five-step checkout
- [`docs/reservation-flow.md`](docs/reservation-flow.md) — inventory reservations and cleanup
