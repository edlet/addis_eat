# Live data query decisions

All browser queries use `fetcher` from `app/lib/query-client.js`. It checks `response.ok` and throws for every non-OK response. The shared cache stores results by URL key and deduplicates concurrent requests for the same key.

| Query | Key | Refresh rule | Reasoning |
| --- | --- | --- | --- |
| Order status | `/api/orders/{encodedOrderId}` | `refreshInterval: 5000`, `staleTime: 5000` | Order progress can change while the customer watches, and five seconds gives timely updates without continuously polling between scheduled checks. |
| Paged menu | `/api/dishes?category={encodedCategory}&page={page}` | No interval; `staleTime: 60000` | The menu is relatively stable, so server rendered fallback data stays fresh for one minute and avoids needless requests during browsing. |
| Menu search | `null` when trimmed search is empty; otherwise `/api/dishes?search={encodedTerm}&category={encodedCategory}&page=1` | No interval; `staleTime: 15000`; `keepPreviousData: true` | Search results only change when the term or category changes, while retaining the previous matches prevents an empty flash during the next lookup. |

The server seeds the order query with `fallbackData`, so the first paint already contains the order status. The menu page also seeds its current page from the server. Typing is debounced by 300 ms before the URL and search key update; the URL carries category, search, and page state for shareable links.
