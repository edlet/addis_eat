"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

export default function MenuFilterControls({ categories, selectedCategory, initialSearch }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const searchInput = useRef(null);
  const [term, setTerm] = useState(initialSearch);
  useEffect(() => {
    const timer = setTimeout(() => navigate(selectedCategory, term), 300);
    return () => clearTimeout(timer);
  }, [term, selectedCategory]);
  function navigate(category, search) { const query = new URLSearchParams(); if (category !== "All") query.set("category", category); if (search.trim()) query.set("search", search.trim()); startTransition(() => router.replace(`/menu${query.size ? `?${query}` : ""}`)); }
  return <><label className="search-label" htmlFor="dish-search">Search the menu</label><input key={initialSearch} ref={searchInput} id="dish-search" type="search" placeholder="Try Doro Wat..." value={term} onChange={(event) => setTerm(event.target.value)} /><div className="category-list" aria-label="Menu categories">{categories.map((category) => <button key={category} type="button" className={selectedCategory === category ? "active" : ""} onClick={() => navigate(category, searchInput.current?.value || "")}>{category}</button>)}</div></>;
}
