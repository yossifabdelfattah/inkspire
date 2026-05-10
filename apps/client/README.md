# Inkspire Client — Frontend Instructions

## Purpose

This folder contains the React frontend for Inkspire, a full-stack bookstore e-commerce application.

The frontend should provide a polished, responsive, modern user experience while staying consistent with the project architecture.

## Frontend Stack

Use:

- React
- Vite
- React Router
- Context API
- Axios
- styled-components
- Mantine UI
- Framer Motion
- Recharts
- Leaflet

## Styling Strategy

Use both `styled-components` and Mantine.

Use `styled-components` for:

- page layouts
- wrappers
- custom sections
- responsive layouts
- branded visual design
- complex component composition
- hover states and custom animations

Use Mantine for:

- buttons
- inputs
- modals
- drawers
- tables
- tabs
- pagination
- selects
- notifications
- skeleton loading states
- form elements

Do not replace the whole interface with plain Mantine defaults. Mantine should reduce boilerplate, while styled-components should preserve the custom Inkspire design identity.

## UI Design Direction

The UI should feel:

- modern
- clean
- polished
- responsive
- readable
- professional

Prefer:

- soft shadows
- rounded corners
- spacious layouts
- modern typography
- clear visual hierarchy
- subtle hover effects
- subtle motion

Avoid:

- cluttered screens
- excessive colors
- excessive gradients
- excessive animations
- inconsistent spacing
- hardcoded styles scattered across components

## Recommended Frontend Structure

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

## Component Rules

Components should be small, reusable, and focused.

Prefer this:

```txt
BookCard.jsx
BookGrid.jsx
BookFilters.jsx
BookDetailsHero.jsx
```

Avoid large files that combine:

- API logic
- layout
- business rules
- styling
- form logic

Separate concerns clearly.

## API Rules

API calls should not be scattered across deeply nested UI components.

Use service files:

```txt
src/services/bookService.js
src/services/orderService.js
src/services/requestService.js
```

Use centralized Axios configuration:

```txt
src/api/axios.js
```

## State Management Rules

Use Context API only for global state such as:

- authentication
- cart
- global UI state if needed

Do not put every page state into Context.

Use local state for:

- filters
- search input
- form state
- loading state
- modal state

## Authentication Frontend Rules

Authentication should use Firebase Authentication.

Do not implement custom JWT login/signup on the frontend.

Frontend auth responsibilities:

- signup
- login
- logout
- current user state
- protected routes
- sending Firebase ID token to backend when needed

## Routing Rules

Keep routes centralized in:

```txt
src/routes/AppRouter.jsx
```

Recommended public routes:

```txt
/
 /books
 /books/:id
 /login
 /register
 /cart
```

Recommended protected routes:

```txt
/profile
/checkout
```

Recommended admin routes later:

```txt
/admin
/admin/books
/admin/requests
/admin/analytics
```

## Responsive Design Rules

The frontend must be mobile responsive.

Use these breakpoints:

```js
mobile: 480px
tablet: 768px
desktop: 1024px
largeDesktop: 1440px
```

Requirements:

- no horizontal overflow
- responsive navbar
- responsive grids
- readable typography on mobile
- mobile-friendly forms
- collapsible filters where needed

## Animation Rules

Use Framer Motion for subtle, purposeful animations.

Good uses:

- page fade-in
- card hover transitions
- modal transitions
- drawer transitions
- loading transitions

Avoid:

- excessive bouncing
- distracting effects
- long animations
- animation on every small element

## Books UI Requirements

Books page should include:

- search input
- category filter
- sorting
- responsive book grid
- loading skeletons
- error state
- empty state

Book card should show:

- cover image
- title
- author
- price
- rating
- stock status
- add to cart button

Book details page should show:

- large cover image
- title
- author
- description
- price
- stock
- rating
- quantity selector
- add to cart button
- reviews/comments section later
- store availability map later

## Cart UI Requirements

Cart should include:

- cart item list
- quantity controls
- remove button
- subtotal
- total items
- free shipping progress message
- checkout button

Cart state should eventually persist with `localStorage`.

## Admin UI Requirements

Admin dashboard should use Mantine heavily for:

- tables
- tabs
- modals
- forms
- notifications
- pagination

Use Recharts for:

- sales over time
- top books
- search trends
- request trends

The dashboard should be data-driven, not only CRUD screens.

## Code Quality Rules

Frontend code should:

- use meaningful component names
- avoid duplicated styles
- avoid giant components
- keep API logic separate
- handle loading states
- handle error states
- use reusable components
- avoid hardcoded repeated values

## Accessibility Rules

Use:

- semantic HTML where possible
- accessible buttons
- clear focus states
- readable contrast
- labels for inputs
- alt text for images

## Important

When generating new frontend code, follow the existing structure and design system. Do not introduce a second styling system or unrelated UI framework.
