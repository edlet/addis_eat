# Addis Eats — Day 40: Server and Client Boundaries

Day 40 continues Day 39 and verifies the production rendering strategies, component boundaries, and API behavior for the complete Addis Eats App Router project.

This Next.js App Router mini-project keeps data and static UI on the server while shipping only the interactive leaves to the browser.

## Boundary checks

- `/menu` and `/menu/[id]` are async Server Components. They fetch through `getMenuDishes` and `getDish`; neither uses a client fetching hook.
- `app/layout.js` stays on the server. Its `Providers` child is the client shell and receives the server-rendered header, route content, and footer as `children`.
- Cart state is isolated in `app/providers.jsx`; client context consumers are limited to components that need it.
- `HomePage` and `DishList` remain server-rendered. Interactive areas such as saved favorites, coupon controls, save buttons, and add-to-order buttons are small client leaves.
- No server component passes a callback prop to a client component. Client modules create their own event handlers.
- `app/menu/error.js` needs `"use client"` because its Retry button calls Next's browser-side `reset` function.

## Mobile access

On screens up to 760px wide, a persistent bottom navigation provides one-tap access to Home, Menu, Favorites, Orders, and Cart; checkout is one tap away from the cart. Menu categories and sidebar links scroll horizontally instead of shrinking, and form controls use at least 44px touch targets.

See [BOUNDARY.md](./BOUNDARY.md) for every component's boundary and justification. See [STRATEGY.md](./STRATEGY.md) for the route rendering strategies.

## `/menu` First Load JS

Measured from production builds before and after sorting the component boundaries:

| Version | First Load JS |
| --- | ---: |
| Before: client-side dish list and card markup | 116 kB |
| After: `DishList` server-rendered with client interaction leaves | 112 kB |

The refactor reduced `/menu` First Load JS by **4 kB**. Browser work stays in the cart provider/badge, favorites controls, coupon dialog, filter controls, sidebar counter, and add-to-order buttons.

## API and order actions

| Endpoint | Method | Status codes |
| --- | --- | --- |
| `/api/dishes` | `GET` | `200` |
| `/api/dishes/[id]` | `GET` | `200`, `404` |
| `/api/orders` | `POST` | `201`, `401`, `422` |

API errors use `{ "error": { "code": "...", "message": "...", "fieldErrors": { "phone": "..." } } }`. `fieldErrors` is present for validation failures; other errors use the same outer shape.

`app/lib/order-schema.js` validates the same checkout fields for both `POST /api/orders` and the `placeOrder` server action. The checkout uses React's `useActionState` for pending UI and named field errors. Successful writes call `revalidatePath("/orders")`, refreshing the cached order history. Order writes reject unknown dish IDs with a named `items` error.

`cancelOrder` checks for a session and verifies that the order belongs to that session before changing its status. Local development has a demo session. Production requires an `addis-eats-session` HttpOnly cookie signed by the identity provider with the server-only `SESSION_SECRET`; forged or missing sessions fail authorization. The demo order store uses a JSON file under ignored `.next/cache` so API, action, and page bundles share records. A clean build clears this demo data; production should use a database. `.env.local` is ignored, and no secret is imported into a client component.

The cart mirrors dish IDs and quantities to a same-site cookie. The checkout Server Component reads that cookie and renders the summary and server-action form before JavaScript runs. Placing an order expires the cart cookie in the action. The action invalidates the cached order tag with `updateTag` and calls `revalidatePath("/orders")` so the current customer sees the write immediately.

Example invalid request:

```bash
curl -X POST http://localhost:3000/api/orders -H "Content-Type: application/json" -d "{\"customerName\":\"Ada\",\"phone\":\"bad\",\"deliveryArea\":\"Bole\",\"paymentMethod\":\"Cash on Delivery\",\"items\":[{\"id\":1,\"quantity\":1}]}"
```

It returns `422` and a named `fieldErrors.phone` message.

## Run

```bash
npm install
npm run dev
```

## Production build output

Verified using `npm run build` on Next.js 16.3.5:

```text
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/dishes
├ ƒ /api/dishes/[id]
├ ƒ /api/orders
├ ○ /cart
├ ƒ /checkout
├ ƒ /menu
├   /menu/[id]
│ ├ ● /menu/doro-wat
│ ├ ● /menu/tibs
│ ├ ● /menu/shiro
│ └ ● [+9 more paths]
└ ƒ /orders

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

`/menu` is dynamic because it reads `searchParams`; its `revalidate = 60` export does not change the build marker. `GET /api/dishes` is not called by the UI: server components read the shared dish module directly. The endpoint is available to external clients and curl.

The earlier boundary refactor measured `/menu` First Load JS at 116 kB before and 112 kB after moving dish-list rendering to the server, a 4 kB reduction. This Next.js 16 build output reports route markers without per-route First Load JS sizes.

Production curl checks passed: dishes list `200`, unknown dish `404`, invalid phone `422` with `error.fieldErrors.phone`, and a valid signed-session order `201`. The newly created order appeared on `/orders` immediately. With a cart cookie already set, `/checkout` returns a server-rendered order summary and form that remain submit-capable without JavaScript. The production client asset scan found no `SESSION_SECRET` or test signing key.

## Routes

| URL | Rendering strategy |
| --- | --- |
| `/` | Static |
| `/menu` | Dynamic (`ƒ`, reads `searchParams`) |
| `/menu/[id]` | SSG (`●`) for known dishes |
| `/cart` | Static shell with client cart state |
| `/favorites` | Static shell with client-persisted favorites |
| `/checkout` | Dynamic (`ƒ`) |
| `/orders` | Dynamic (`ƒ`) |
