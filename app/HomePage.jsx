import Link from "next/link";
import AddDishButton from "./menu/AddDishButton";
import FavoriteButton from "./menu/FavoriteButton";
import HomeFavorites from "./HomeFavorites";
import HomeCouponButton from "./HomeCouponButton";

const categories = [
  { label: "All Cuisines", target: "/menu" },
  { label: "Ethiopian Traditional", target: "/menu?category=Main" },
  { label: "Stone Oven Pizza", target: "/menu?category=Modern" },
  { label: "Craft Burgers", target: "/menu?category=Modern" },
  { label: "Habesha Coffee & Tea", target: "/menu?category=Drinks" },
  { label: "Healthy Salads", target: "/menu?category=Healthy" },
];

export default function HomePage({ dishes }) {
  const featuredDishes = dishes.slice(0, 4);
  const heroDish = featuredDishes[0];

  return (
    <main className="home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="section-kicker">Fastest delivery in Addis</p>
          <h1>Good food. Delivered your way.</h1>
          <p className="hero-text">
            From authentic Ethiopian feasts in traditional meshob platters to
            urban wood-fired pizzas and craft burgers, delivered piping hot to
            your doorstep anywhere in Addis Ababa.
          </p>
          <div className="hero-actions">
            <label className="address-box">
              <span className="location-icon" aria-hidden="true">⌖</span>
              <input type="text" value="Enter your neighbourhood (e.g., Bole, Mehran)" readOnly aria-label="Delivery neighbourhood" />
            </label>
            <Link href="/menu" className="primary-button">Find Food</Link>
          </div>
          <div className="hero-stats">
            <span>⚡ Average 32 mins delivery</span>
            <span>✓ 4.9/5 (25,000+ orders)</span>
            <span>💳 TeleBirr &amp; CBE direct</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card" style={heroDish?.image ? { backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.14), rgba(0,0,0,0.08)), url(${heroDish.image})` } : undefined}>
            <div className="visual-badge">★ 4.9</div>
            <div className="visual-caption">
              <strong>{heroDish?.name || "Doro Wat platter"}</strong>
              <span>{heroDish ? `${heroDish.category} · 15 min to your door` : "15 min to your door"}</span>
            </div>
          </div>
        </div>
      </section>

      <nav className="chip-row" aria-label="Categories">
        {categories.map((category) => <Link key={category.label} href={category.target} className="chip">{category.label}</Link>)}
      </nav>

      <section className="specials-section">
        <div className="section-heading-row">
          <div><p className="section-kicker">Daily chef selection</p><h2>Today&apos;s Specials</h2></div>
          <Link href="/menu" className="link-button">Explore Full Menu →</Link>
        </div>
        <div className="specials-grid menu-card-grid">
          {featuredDishes.map((dish) => (
            <article key={dish.id} className="card">
              <div className="dish">
                <div className="dish-visual" style={{ backgroundImage: `url(${dish.image})` }} role="img" aria-label={`${dish.name} dish`} />
                <div className="dish-meta"><span>{String(dish.id).padStart(2, "0")}</span><span>{dish.category}</span></div>
                <h3><Link href={`/menu/${dish.id}`} className="dish-link">{dish.name}</Link>{dish.spicy && <span className="spicy-badge">Spicy</span>}</h3>
                <p className="description">{dish.description}</p>
                <div className="dish-actions">
                  <p className="price"><span>{dish.price}</span> ETB</p>
                  <FavoriteButton dish={dish} />
                  <AddDishButton dish={dish} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <HomeFavorites />

      <section className="story-section">
        <div className="story-copy">
          <p className="section-kicker">A neighborhood hospitality</p>
          <h2>Tradition meets modern city pace.</h2>
          <p>Whether gathering your family around an aromatic Sunday feast or grabbing a rapid working lunch in the business district of Bole, Addis Eats bridges local culinary pride with point-to-point delivery precision.</p>
          <div className="mini-stats"><span>🍽️ 1,000+ chef-prepared orders</span><span>📍 24/7 delivery coverage</span></div>
          <div className="impact-row"><div><strong>Over 25,000+</strong><span>happy customers</span></div><div><strong>100%</strong><span>authentic ingredients</span></div></div>
        </div>
        <div className="story-visual"><div className="story-photo" /><div className="metric-card large">140+ Partner Restaurants</div></div>
      </section>

      <section className="benefits-row">
        <article className="benefit-box"><span className="benefit-icon">⏱️</span><h3>Fast Local Couriers</h3><p>Dedicated riders stationed across Bole, Kazanchis, Piazza, and more.</p></article>
        <article className="benefit-box"><span className="benefit-icon">🥬</span><h3>Highland Freshness</h3><p>Ingredients fresh from highland farms and delivered with care daily.</p></article>
        <article className="benefit-box"><span className="benefit-icon">💳</span><h3>Seamless Mobile Pay</h3><p>Zero-contact delivery with TeleBirr, CBE, and cash on arrival.</p></article>
      </section>

      <section className="cta-banner">
        <div>
          <p className="section-kicker light">Addis Ababa&apos;s top choice</p>
          <h2>Hungry? Your favorite meal is just a few taps away.</h2>
          <p>Order fresh sizzling tibs, layered bayenetu platters, crispy burgers, or steaming wood-fired pizza delivered in under 35 minutes.</p>
        </div>
        <div className="cta-actions">
          <Link href="/menu" className="primary-button alt">Explore Menu Now</Link>
          <HomeCouponButton />
        </div>
      </section>

    </main>
  );
}
