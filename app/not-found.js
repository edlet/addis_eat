import Link from "next/link";
export default function NotFound() {
  return <main className="page"><p className="eyebrow">404</p><h1>That dish is not on today’s menu.</h1><p className="lead">The address may be incorrect, or the dish is unavailable.</p><Link href="/menu" className="button">See the menu</Link></main>;
}
