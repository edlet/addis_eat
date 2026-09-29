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

See [STRATEGY.md](./STRATEGY.md) for rendering choices and [BOUNDARY.md](./BOUNDARY.md) for server/client boundaries.

## Run

```bash
npm install
npm run dev
```
