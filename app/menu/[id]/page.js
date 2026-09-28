import { notFound } from "next/navigation";
import Link from "next/link";
import AddDishButton from "../AddDishButton";
import { dishes, getDish } from "../dishes";

export function generateStaticParams() {
  return dishes.map((dish) => ({ id: dish.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }));
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) notFound();

  return (
    <main className="page-section detail-page">
      <Link href="/menu" className="back-link">← Back to menu</Link>
      <div className="detail-grid">
        <div className="detail-image" style={{ backgroundImage: `url(${dish.image})` }} role="img" aria-label={dish.name} />
        <div>
          <p className="section-kicker">{dish.category}</p>
          <h1>{dish.name}</h1>
          {dish.spicy && <span className="spicy-badge">Spicy</span>}
          <p className="lead">{dish.description}</p>
          <div className="detail-actions"><strong>{dish.price} ETB</strong><AddDishButton dish={dish} /></div>
        </div>
      </div>
    </main>
  );
}
