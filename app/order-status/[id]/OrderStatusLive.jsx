"use client";

import { useQuery } from "../../lib/query-client";

export default function OrderStatusLive({ orderId, initialOrder }) {
  const key = `/api/orders/${encodeURIComponent(orderId)}`;
  const { data, error } = useQuery(key, { fallbackData: { order: initialOrder }, refreshInterval: 5000, staleTime: 5000 });
  const order = data?.order || initialOrder;
  return <section aria-live="polite"><h2>{order.status}</h2><p>We check for an updated status every five seconds.</p>{error && <p role="status">Could not refresh just now. Showing the last known status.</p>}</section>;
}
