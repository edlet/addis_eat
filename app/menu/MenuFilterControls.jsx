"use client";

import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";

export default function MenuFilterControls({ categories, selectedCategory, initialSearch }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const searchInput = useRef(null);
  function navigate(category, search) { const query = new URLSearchParams(); if (category !== "All") query.set("category", category); if (search) query.set("search", search); startTransition(() => router.replace(`/menu${query.size ? `?${query}` : ""}`)); }
  return <><label className="search-label" htmlFor="dish-search">Search the menu</label><input key={initialSearch} ref={searchInput} id="dish-search" type="search" placeholder="Try Doro Wat..." defaultValue={initialSearch} onChange={(event) => navigate(selectedCategory, event.target.value)} /><div className="category-list" aria-label="Menu categories">{categories.map((category) => <button key={category} type="button" className={selectedCategory === category ? "active" : ""} onClick={() => navigate(category, searchInput.current?.value || "")}>{category}</button>)}</div></>;
}
