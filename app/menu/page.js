import { Suspense } from "react";
import MenuContents from "./MenuContents";
import MenuDishList from "./MenuDishList";
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
  return <MenuContents><MenuFilterControls categories={categories} selectedCategory={selectedCategory} initialSearch={search} /><Suspense fallback={<DishListFallback />}><MenuDishList category={selectedCategory} search={search} /></Suspense></MenuContents>;
}
