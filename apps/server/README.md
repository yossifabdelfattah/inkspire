# Inkspire Server — Backend Instructions

## Purpose

This folder contains the Express + MongoDB backend for Inkspire, a full-stack bookstore e-commerce application.

The backend should provide clean APIs, persistent data storage, business logic, analytics, and real-time functionality.

## Backend Stack

Use:

- Node.js
- Express
- MongoDB
- Mongoose
- Firebase Admin SDK
- Socket.IO
- express-validator or Zod
- dotenv
- cors
- morgan

## Authentication Strategy

Authentication must use Firebase Authentication.

Do not implement custom JWT authentication.

Do not implement:

- custom password hashing
- bcrypt-based auth
- local JWT token generation
- custom login/register controllers

Frontend authenticates users with Firebase.

Backend verifies Firebase ID tokens using Firebase Admin SDK.

## Role Strategy

Application roles should be stored in MongoDB.

Recommended roles:

```txt
user
admin
```

A user document may include:

```js
{
  firebaseUid,
  name,
  email,
  role,
  createdAt
}
```

Backend admin middleware should:

1. Verify Firebase token.
2. Find user in MongoDB by Firebase UID.
3. Check `role === "admin"`.

## Recommended Backend Structure

```txt
src/
  config/
    db.js
    firebaseAdmin.js
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
  data/
  server.js
```

## Architecture Rules

Controllers should stay thin.

Controllers may:

- read request params/body
- call service functions
- return responses
- pass errors to middleware

Business logic should live in:

```txt
src/services/
```

Examples:

```txt
bookService.js
orderService.js
analyticsService.js
requestRankingService.js
recommendationService.js
```

## API Design Rules

Use REST-style routes.

Recommended routes:

```txt
/api/books
/api/orders
/api/book-requests
/api/comments
/api/ratings
/api/admin/analytics
/api/admin/books
/api/admin/requests
```

Use plural resource names.

Prefer:

```txt
/api/books
```

over:

```txt
/api/product
```

## Data Models

Recommended collections:

```txt
users
books
orders
comments
ratings
bookRequests
searchLogs
stores
inventory
userActivity
```

## Book Model

Recommended fields:

```js
{
  title,
  author,
  description,
  price,
  category,
  image,
  stock,
  ratingAverage,
  ratingCount,
  createdAt,
  updatedAt
}
```

## Order Model

Recommended fields:

```js
{
  userId,
  items,
  totalPrice,
  shippingInfo,
  paymentMethod,
  status,
  createdAt
}
```

The backend must calculate final totals. Never trust frontend totals.

## Book Request Model

Recommended fields:

```js
{
  title,
  author,
  normalizedTitle,
  normalizedAuthor,
  note,
  requestedBy,
  requestCount,
  status,
  priorityScore,
  createdAt,
  updatedAt
}
```

Request status values:

```txt
pending
approved
rejected
```

## Search Log Model

Recommended fields:

```js
{
  query,
  normalizedQuery,
  userId,
  resultCount,
  createdAt
}
```

Search logs are used for admin analytics.

## Validation Rules

Validate all important request bodies.

Validate:

- book creation
- book updates
- checkout/order creation
- book requests
- comments
- ratings
- admin actions

Validation should happen on the backend even if the frontend already validates input.

## Error Handling Rules

Use centralized error handling middleware.

Errors should return:

- meaningful status code
- clear message
- no sensitive internal details

Examples:

```txt
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Server Error
```

## Real-Time Rules

Use Socket.IO for real-time features.

Real-time features include:

- live comments
- live rating updates

Important pattern:

1. Validate request.
2. Save data to MongoDB.
3. Emit Socket.IO event.
4. Clients update UI.

Do not emit real-time events without saving persistent data first.

## Analytics Rules

Admin analytics should use backend aggregation logic.

Examples:

- sales per day/week/month
- most purchased books
- most searched books
- request trends
- top requested books

Use MongoDB aggregation pipelines where appropriate.

The frontend should receive processed analytics data, not raw database dumps.

## Recommendation Rules

Recommendations should be rule-based and understandable.

Use data such as:

- viewed books
- purchased books
- rated books
- favorite categories

Do not implement fake AI.

Recommended endpoint:

```txt
GET /api/recommendations
```

## Store Availability Rules

Store availability should use:

- stores collection
- inventory collection

Recommended store fields:

```js
{
  name,
  address,
  latitude,
  longitude
}
```

Recommended inventory fields:

```js
{
  storeId,
  bookId,
  stock
}
```

The backend should return only stores where the selected book is available.

## Search Rules

Search should support:

- query by title/author
- category filter
- price filter
- sorting
- pagination later

When a meaningful search is performed:

1. Normalize the search query.
2. Count result total.
3. Store search log.

## Security Rules

Do not expose secrets.

Use environment variables for:

- MongoDB URI
- Firebase credentials
- port
- client URL

Never commit `.env` files.

Commit `.env.example` only.

## Seed Data Rules

Use seed data for local development.

Seed data may include:

- books
- categories
- stores
- inventory

Seed scripts should be repeatable.

Recommended behavior:

1. Connect to MongoDB.
2. Clear selected collections.
3. Insert sample data.
4. Log success.
5. Exit process.

## Code Quality Rules

Backend code should:

- use meaningful names
- avoid duplicated logic
- avoid huge controllers
- use services for business logic
- handle async errors properly
- avoid deeply nested logic
- keep route files clean

## Development Rules

Do not commit directly to `main`.

Use feature branches.

Example branches:

```txt
feature/firebase-auth
feature/books-api
feature/search-tracking
feature/analytics-dashboard
feature/realtime-comments
```

## Important

The backend should not become a simple CRUD API only. Prioritize logic-heavy features such as analytics, recommendations, request ranking, real-time interaction, and search tracking.
