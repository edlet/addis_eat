"use client";

import Link from "next/link";
import { useQuery } from "../lib/query-client";

export default function LiveDishList({ page, searchTerm, category, initialData }) {
  const pageKey = `/api/dishes?category=${encodeURIComponent(category)}&page=${page}`;
  const pageQuery = useQuery(pageKey, { fallbackData: initialData, staleTime: 60_000 });
  const searchKey = searchTerm ? `/api/dishes?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}&page=1` : null;
  const searchQuery = useQuery(searchKey, { keepPreviousData: true, staleTime: 15_000 });
  const result = searchTerm ? (searchQuery.data || pageQuery.data) : pageQuery.data;
  const isValidating = searchTerm ? searchQuery.isValidating : pageQuery.isValidating;
  const error = searchTerm ? searchQuery.error : pageQuery.error;
  const dishes = result?.dishes || [];
  const pageCount = result?.pageCount || 1;
  return <section aria-busy={isValidating}>
    {error && <p role="status">The menu could not be refreshed. Showing available results.</p>}
    {isValidating && <p className="section-kicker" role="status">Updating dishes…</p>}
    <div className="dish-list">{dishes.map((dish) => <article className="dish-card" key={dish.id}><Link href={`/menu/${dish.id}`}><div className="dish-visual" style={{ backgroundImage: `url(${dish.image})` }} /><h2>{dish.name}</h2></Link><p>{dish.description}</p><strong>{dish.price} ETB</strong></article>)}</div>
    {!dishes.length && <p>No dishes match that search.</p>}
    {!searchTerm && <nav aria-label="Menu pages" className="category-list">{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <Link aria-current={number === page ? "page" : undefined} className={number === page ? "active" : ""} href={`/menu?page=${number}`} key={number}>Page {number}</Link>)}</nav>}
  </section>;
}
