# Rendering strategy

| Route | Strategy | Why |
| --- | --- | --- |
| `/` | Static | The home page uses fixed featured dishes and does not need request data. |
| `/menu` | Dynamic (`ƒ`) | The page reads `searchParams` for shareable menu filters, so Next renders it on demand despite the revalidate hint. |
| `/menu/[id]` and generated dish paths | SSG (`●`) | `generateStaticParams` creates a build-time page for each known dish; the `notFound` path handles unknown IDs. |
| `/cart` | Static shell with client state | Cart contents live in browser local storage, so the server response is reusable. |
| `/favorites` | Static shell with client state | Saved dishes live in browser local storage and render after hydration. |
| `/checkout` | Dynamic | The page reads the `x-addis-delivery-area` request header to set a delivery-area default. |
| `/orders` | Dynamic (`ƒ`) | The page reads the request session to select the customer's order list. |
| `/api/dishes`, `/api/dishes/[id]`, `/api/orders` | Dynamic (`ƒ`) | Route handlers are not cached by default in this Next version; POST also validates and writes orders. |

## Production build markers

Verified with `npm run build` on Next.js 16.3.5:

```text
○ /
○ /_not-found
ƒ /api/dishes
ƒ /api/dishes/[id]
ƒ /api/orders
○ /cart
ƒ /checkout
ƒ /menu
  /menu/[id]
● /menu/doro-wat
● /menu/tibs
● /menu/shiro
● [+9 more paths]
ƒ /orders
```

Markers: `○` static, `●` generated from `generateStaticParams`, `ƒ` dynamic. The build confirmed `/menu` is dynamic because the route reads `searchParams`; the `revalidate = 60` setting does not change that marker.

The menu layout is shared by `/menu` and `/menu/[id]`. Its client-side counter demonstrates that the sidebar stays mounted during navigation. The menu dish list is wrapped in `Suspense`, so the sidebar streams immediately while the simulated dish request resolves.
