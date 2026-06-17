# Inkspire Client

The Inkspire frontend: a React 19 single-page application built with Vite and
TypeScript. It uses React Router for routing, styled-components and Mantine for
UI, Firebase for authentication, Axios for API calls, Recharts for admin
charts, Leaflet for the in-store availability map, and Socket.IO for real-time
updates.

## Firebase Authentication Setup

The client authenticates users directly with Firebase, then sends the resulting
ID token to the backend as a Bearer token.

1. Create a Firebase project at <https://console.firebase.google.com>.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Enable **Authentication → Sign-in method → Google**.
4. Under **Authentication → Settings → Authorized domains**, add `localhost`
   (it is usually present by default).
5. Register a **Web App** under **Project Settings → General → Your apps**, then
   copy the `firebaseConfig` values into your `.env` file (see below).

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable                            | Required | Description                                      |
| ----------------------------------- | -------- | ------------------------------------------------ |
| `VITE_API_URL`                      | Yes      | Backend base URL including `/api` (e.g. `http://localhost:5000/api`) |
| `VITE_FIREBASE_API_KEY`             | Yes      | Firebase Web App API key                         |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Yes      | Firebase auth domain                             |
| `VITE_FIREBASE_PROJECT_ID`          | Yes      | Firebase project ID                              |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Yes      | Firebase storage bucket                          |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes      | Firebase messaging sender ID                     |
| `VITE_FIREBASE_APP_ID`              | Yes      | Firebase Web App ID                              |
| `VITE_FIREBASE_MEASUREMENT_ID`      | No       | Google Analytics measurement ID (if enabled)     |

All variables are exposed to the browser at build time and contain no secrets.

## Local Development

```bash
npm run dev -w apps/client
```

The Vite dev server runs on `http://localhost:5173` by default. Make sure the
backend is running and `VITE_API_URL` points to it.

## Build

```bash
npm run build -w apps/client
```

This type-checks the project (`tsc -b`) and produces a production build in
`dist/`. Preview the build locally with:

```bash
npm run preview -w apps/client
```

## Lint

```bash
npm run lint -w apps/client
```

## Project Layout

```
apps/client/src/
├── api/           # Axios instance with auth-token interceptor
├── components/    # Reusable UI (layout, books, checkout, auth, home)
├── constants/     # Shared constants (e.g. shipping rules)
├── context/       # React context providers (Auth, Cart)
├── firebase/      # Firebase SDK initialization
├── hooks/         # Custom hooks (e.g. useFetch)
├── pages/         # Route-level pages (incl. admin/)
├── routes/        # AppRouter route table
├── services/      # API service layer per domain
├── styles/        # styled-components theme and global styles
└── types/         # Shared TypeScript types
```
