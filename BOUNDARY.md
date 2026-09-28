# Component boundaries

| Component / module | Runs on | Why |
| --- | --- | --- |
| `app/layout.js` | Server | Owns document markup and composes the provider without becoming a client module. |
| `app/loading.js`, `app/not-found.js` | Server | Provide route loading and not-found UI without browser state. |
| `app/error.js`, `app/menu/error.js` | Client | Use Next's browser retry callback. |
| `app/providers.jsx` | Client | Stores cart state and synchronizes it with `localStorage`. |
| `app/Header.jsx` | Server | Branding and navigation are static; only its cart badge is interactive. |
| `app/CartBadge.jsx` | Client | Reads cart context to show the live item count. |
| `app/Footer.jsx` | Server | Contains static navigation only. |
| `app/MobileNavigation.jsx` | Server | Renders ordinary quick-access links for small screens without browser state. |
| `app/page.js` | Server | Selects featured dishes and renders server content. |
| `app/HomePage.jsx` | Server | Preserves the React homepage structure while keeping static copy and sections on the server. |
| `app/HomeFavorites.jsx` | Client | Reads persisted favorites from the cart provider for the home-page preview. |
| `app/HomeCouponButton.jsx` | Client | Opens and closes the coupon dialog in response to a click. |
| `app/menu/layout.js` | Server | Builds the persistent menu shell without browser state. |
| `app/menu/MenuSidebar.jsx` | Server | Renders static menu navigation. |
| `app/menu/SidebarVisitCounter.jsx` | Client | Holds visit-counter state and handles its click. |
| `app/menu/page.js` | Server | Async route that reads URL state and starts data work without a fetching hook. |
| `app/menu/MenuContents.jsx` | Server | Supplies the static menu page shell around server-rendered children. |
| `app/menu/MenuDishList.jsx` | Server | Async server component that fetches and filters menu dishes. |
| `app/menu/MenuFilterControls.jsx` | Client | Reacts to typing and category clicks by updating the URL. |
| `app/menu/DishList.jsx` | Server | Renders dish-card markup and never imports cart state. |
| `app/menu/AddDishButton.jsx` | Client | Needs a click handler and cart context for one dish. |
| `app/menu/FavoriteButton.jsx` | Client | Reads favorites and toggles the saved state for one dish. |
| `app/menu/[id]/page.js` | Server | Async route that fetches one dish and renders its details. |
| `app/favorites/page.js` | Client | Renders and updates the persisted saved-dish list. |
| `app/menu/loading.js` | Server | Is static loading UI. |
| `app/menu/error.js` | Client | Next supplies `reset`, and the retry button must invoke it in the browser. |
| `app/menu/dishes.js` | Server | Provides menu data and async data-access helpers. |
| `app/cart/page.js` | Server | Only composes the cart UI. |
| `app/cart/CartContents.jsx` | Client | Reacts to cart state and handles quantity/removal actions. |
| `app/checkout/page.js` | Server | Reads request headers for the delivery-area default. |
| `app/checkout/CheckoutForm.jsx` | Client | Handles form submission and live cart state. |
| `app/actions/orders.js` | Server Action | Validates form data, checks the session and ownership, writes orders, and revalidates cached order data. |
| `app/api/orders/route.js` | Server Route Handler | Validates JSON requests with the same schema and returns named field errors. |
| `app/api/dishes/route.js`, `app/api/dishes/[id]/route.js` | Server Route Handlers | Expose the server-side dish data and a real 404 for unknown IDs. |
| `app/orders/CancelOrderButton.jsx` | Client | Submits the cancel action and displays its pending/result state. |
| `app/orders/page.js` | Server | Reads the session and cached order history. |
| `app/lib/order-schema.js`, `app/lib/orders.js`, `app/lib/session.js` | Server-only modules | Share validation, in-memory data access, and the authentication seam without importing them into client modules. |
| `app/not-found.js` | Server | Is static fallback content. |

`Providers` is the client shell: `app/layout.js` remains a Server Component and passes its server-rendered header, route content, and footer to `Providers` through `children`. No server component passes a callback prop to a client component; event handlers are created inside the client modules that use them.

`HomePage` and `DishList` are server components. Their interactive features are isolated in client leaves: `HomeFavorites`, `HomeCouponButton`, `FavoriteButton`, and `AddDishButton`.

There are fourteen explicit client entry files under `app/`. Each needs browser state, event handlers, a React action state, or Next's client-side `reset` function.
