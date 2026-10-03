import { getDishes } from "@/app/lib/dishes";

export async function GET(request) {
  const dishes = await getDishes();
  const { searchParams } = new URL(request.url);
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const category = searchParams.get("category") || "All";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const pageSize = 6;
  const filtered = dishes.filter((dish) =>
    (category === "All" || dish.category === category) &&
    (!search || dish.name.toLowerCase().includes(search))
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  return Response.json({ dishes: filtered.slice(start, start + pageSize), page, pageCount, total: filtered.length });
}
