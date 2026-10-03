import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOrdersFor } from "../../lib/orders";
import { getSession } from "../../lib/session";
import OrderStatusLive from "./OrderStatusLive";

export const dynamic = "force-dynamic";
export const metadata = { title: "Order status | Addis Eats" };

export default async function OrderStatusPage({ params }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/sign-in");
  const order = getOrdersFor(session.userId).find((item) => item.id === id);
  if (!order) notFound();
  return <main className="state-screen"><p className="section-kicker">Order tracking</p><h1>Order #{order.id.slice(0, 8)}</h1><OrderStatusLive orderId={order.id} initialOrder={order} /><Link href="/orders" className="primary-button">All orders</Link></main>;
}
