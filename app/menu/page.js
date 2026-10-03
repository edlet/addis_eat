import { Suspense } from "react";
import MenuContents from "./MenuContents";
import LiveDishList from "./LiveDishList";
import MenuFilterControls from "./MenuFilterControls";
import { getMenuCategories } from "./dishes";

export const metadata = { title: "Menu | Addis Eats" };
export const revalidate = 60;

function DishListFallback() {
  return <div className="menu-loading" aria-live="polite"><p className="section-kicker">Today&apos;s menu</p><h1>Loading fresh dishes...</h1><p>The menu guide is ready while we fetch the dishes.</p></div>;
}

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;
  const categories = await getMenuCategories();
  const selectedCategory = categories.includes(params.category) ? params.category : "All";
  const search = typeof params.search === "string" ? params.search : "";
  const page = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const allDishes = await (await import("../lib/dishes")).getDishes();
  const filtered = allDishes.filter((dish) =>
    (selectedCategory === "All" || dish.category === selectedCategory) &&
    (!search || dish.name.toLowerCase().includes(search.toLowerCase()))
  );
  const pageSize = 6;
  const initialData = { dishes: filtered.slice(search ? 0 : (page - 1) * pageSize, search ? pageSize : page * pageSize), page, pageCount: Math.max(1, Math.ceil(filtered.length / pageSize)), total: filtered.length };
  return <MenuContents><MenuFilterControls categories={categories} selectedCategory={selectedCategory} initialSearch={search} /><Suspense fallback={<DishListFallback />}><LiveDishList page={page} searchTerm={search} category={selectedCategory} initialData={initialData} /></Suspense></MenuContents>;
}
