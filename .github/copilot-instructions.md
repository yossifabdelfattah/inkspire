# GitHub Copilot Agent Instructions — Inkspire

## Project Overview

Inkspire is a modern full-stack bookstore e-commerce application.

This project is built as a monorepo containing:

- React + Vite frontend
- Express + MongoDB backend
- Firebase Authentication
- Socket.IO for real-time features
- styled-components for styling
- Mantine UI for reusable UI components

The project goal is NOT only CRUD operations.

The application should demonstrate:

- real-time communication
- analytics and aggregation logic
- recommendation systems
- ranking systems
- geolocation features
- event-driven updates
- clean architecture
- scalable frontend patterns

---

# Monorepo Structure

```txt
apps/
  client/
  server/
```

Frontend:

```txt
apps/client/src/
```

Backend:

```txt
apps/server/src/
```

---

# Frontend Tech Stack

## Core

- React
- Vite
- React Router
- Context API
- Axios

## Styling

- styled-components
- Mantine UI
- Framer Motion

## Charts

- Recharts

## Maps

- Leaflet

---

# Backend Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- Socket.IO
- Firebase Admin SDK

---

# Authentication Rules

IMPORTANT:

DO NOT implement custom JWT authentication.

DO NOT implement:

- bcrypt login systems
- custom JWT generation
- password hashing logic
- custom auth middleware based on local JWTs

Authentication MUST use:

- Firebase Authentication

Frontend handles:

- signup
- login
- logout
- user session

Backend verifies Firebase tokens using Firebase Admin SDK.

Roles such as:

- user
- admin

should be stored in MongoDB.

---

# Styling Rules

IMPORTANT:

The project MUST use:

- styled-components for custom styling
- Mantine for reusable UI components

Use styled-components for:

- layouts
- page sections
- wrappers
- responsiveness
- custom visuals
- page composition

Use Mantine for:

- modals
- drawers
- tables
- tabs
- pagination
- inputs
- forms
- notifications
- skeleton loading
- selects
- dropdowns

DO NOT replace the entire UI with Mantine defaults.

Maintain a custom branded look.

---

# UI Design Philosophy

The UI should be:

- modern
- minimal
- responsive
- clean
- visually polished
- animation-enhanced but not excessive

Preferred design characteristics:

- rounded corners
- soft shadows
- spacious layouts
- modern typography
- subtle hover effects
- smooth transitions
- consistent spacing

Avoid:

- cluttered layouts
- excessive gradients
- excessive animations
- dark unreadable interfaces
- inconsistent spacing
- oversized UI elements

---

# Responsive Design Rules

The application MUST be mobile responsive.

Breakpoints:

```js
mobile: 480px
tablet: 768px
desktop: 1024px
largeDesktop: 1440px
```

Requirements:

- mobile-first layouts
- responsive grids
- collapsible navigation
- responsive typography
- no horizontal overflow

---

# Animation Rules

Use:

- Framer Motion

Animations should be:

- subtle
- smooth
- purposeful

Good animations:

- fade-ins
- hover animations
- card transitions
- modal transitions
- loading transitions

Avoid:

- excessive bouncing
- distracting animations
- long animations
- overuse of motion

---

# Frontend Architecture Rules

## Folder Structure

```txt
src/
  api/
  assets/
  components/
    common/
    layout/
    books/
    cart/
    dashboard/
  context/
  hooks/
  pages/
  routes/
  services/
  styles/
  ui/
  utils/
```

---

# Component Rules

Components should:

- be reusable
- remain small and focused
- avoid excessive logic
- avoid duplicated code

Separate:

- UI logic
- business logic
- API logic

Prefer composition over huge components.

---

# State Management Rules

Use Context API only for:

- authentication
- cart state
- potentially global UI state

DO NOT place all application state inside Context.

Use local component state whenever possible.

---

# API Rules

API logic should live inside:

```txt
src/services/
```

Avoid placing API calls directly inside deeply nested UI components.

Use centralized Axios configuration.

---

# Backend Architecture Rules

Structure backend using:

```txt
config/
controllers/
middleware/
models/
routes/
services/
utils/
```

Controllers should:

- remain thin
- validate request flow
- delegate business logic

Complex logic should live in:

```txt
services/
```

---

# Database Rules

Use MongoDB with Mongoose.

Collections may include:

- users
- books
- orders
- comments
- ratings
- bookRequests
- searchLogs
- stores
- inventory
- userActivity

Avoid duplicated data unless justified for performance.

---

# Real-Time Features

Use Socket.IO for:

- live comments
- live ratings updates
- real-time synchronization

Pattern:

1. Save data to MongoDB.
2. Emit Socket.IO event.
3. Update connected clients.

DO NOT rely on sockets without persistence.

---

# Analytics Features

Analytics should involve real aggregation logic.

Examples:

- sales per day/week/month
- top purchased books
- most searched books
- request trends
- conversion rates

Aggregation logic should happen primarily on the backend.

Frontend should mainly visualize the processed data.

---

# Recommendation System Rules

Recommendations should remain:

- rule-based
- deterministic
- understandable

DO NOT implement fake AI systems.

Recommendations may use:

- viewed categories
- purchases
- ratings
- related books

---

# Search Tracking Rules

Searches should:

- be normalized
- be tracked in database
- support analytics later

Track:

- query
- timestamp
- result count
- user id optional

---

# Admin Dashboard Rules

The admin dashboard should focus on:

- analytics
- moderation
- management

Dashboard sections:

- Overview
- Books
- Requests
- Orders
- Analytics

Use charts for:

- revenue trends
- top books
- request trends
- search trends

---

# Map Feature Rules

Use Leaflet for map rendering.

Maps should:

- display store locations
- display inventory availability
- optionally support directions links

Do not implement advanced logistics systems.

---

# Code Quality Rules

Code should:

- be readable
- use meaningful naming
- avoid deeply nested logic
- avoid massive files
- avoid duplication
- remain modular

Prefer:

- early returns
- reusable utilities
- clean separation of concerns

---

# Error Handling Rules

Frontend should:

- display loading states
- display error states
- avoid silent failures

Backend should:

- use centralized error handling
- return meaningful HTTP status codes
- validate incoming data

---

# Validation Rules

Use validation for:

- forms
- API requests
- important business rules

Validation should exist:

- frontend for UX
- backend for security and correctness

---

# Git Workflow Rules

DO NOT commit directly to main.

Use feature branches.

Branch examples:

```txt
feature/books-page
feature/firebase-auth
feature/dashboard-ui
feature/recommendation-system
```

Pull requests should:

- remain focused
- avoid unrelated changes
- maintain clean commit history

---

# UI Priorities

Priority order:

1. Clean architecture
2. Responsive layout
3. Usability
4. Performance
5. Visual polish
6. Animations

Functionality is more important than flashy visuals.

---

# Performance Rules

Avoid:

- unnecessary re-renders
- excessive Context usage
- deeply nested state
- unnecessary API calls
- loading huge datasets at once

Use:

- pagination
- memoization when necessary
- lazy loading where appropriate

---

# Important Project Philosophy

This project should feel like:

- a modern scalable web application
- a logic-driven system
- a professional full-stack architecture

NOT:

- a simple CRUD demo
- a collection of random features
- an overengineered enterprise system

Maintain balance between:

- complexity
- scalability
- maintainability
- realistic scope

