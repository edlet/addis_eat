# Addis Eats Next.js Capstone

This project keeps its original React Router customer/admin app and adds the Day 40 App Router customer experience. Day 40 menu routes, cart, favorites, checkout, guest sign-in and order history are integrated while the target admin screens remain available.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Day 40 home page |
| `/menu`, `/menu/[id]` | Filterable menu and generated dish detail pages |
| `/cart`, `/favorites` | Day 40 client-persisted collections |
| `/checkout`, `/orders`, `/sign-in` | Validated order flow and guest session |
| `/api/dishes`, `/api/dishes/[id]`, `/api/orders` | Dish lookup and order API |
| `/login`, `/receipt`, `/admin/*` | Preserved target account, receipt and admin experience |

The Day 40 provider seeds its cart and favorites from the existing Zustand storage once, then persists separately to avoid corrupting the target's state format. Both experiences use the same `public/dishes.json` seed.

See [STRATEGY.md](./STRATEGY.md) for rendering choices, [BOUNDARY.md](./BOUNDARY.md) for server/client boundaries, and [DATA.md](./DATA.md) for live query keys and refresh rules.

## Live data mini-project

`/order-status/[id]` renders the signed-in customer’s order on the server, then checks its status every five seconds. The menu search waits 300 ms after typing stops before changing the request key, so typing five characters quickly should show one search request in the Network tab (plus any unrelated page requests); previous matches stay visible while it loads. Menu pages use `?page=` links, and category/search values remain in the URL so the current view can be shared.

## Run

```bash
npm install
npm run dev
```
