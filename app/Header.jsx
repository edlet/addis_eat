import Link from "next/link";
import CartBadge from "./CartBadge";

export default function Header() {
  return (
    <header className="topbar">
      <div className="brand-wrap">
        <Link href="/" className="brand-link" aria-label="Addis Eats home">
          <span className="brand-mark">AE</span>
          <span className="brand-stack"><span className="brand-name">Addis Eats</span><span className="brand-tag">Ethiopian food delivery</span></span>
        </Link>
      </div>
      <div className="delivery-pill"><span className="delivery-icon">AD</span><span><small>Delivering to</small>Bole, Addis Ababa</span></div>
      <nav className="topbar-actions" aria-label="Primary navigation">
        <Link href="/menu" className="search-button">Browse menu</Link>
        <Link href="/favorites" className="search-button">Favorites</Link>
        <Link href="/orders" className="search-button">Orders</Link>
        <CartBadge />
      </nav>
    </header>
  );
}
