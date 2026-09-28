import { getDish } from "../../../menu/dishes";

function error(message, status) { return Response.json({ error: { code: status === 404 ? "NOT_FOUND" : "BAD_REQUEST", message } }, { status }); }

export async function GET(_request, { params }) {
  const { id } = await params;
  const dish = await getDish(id);
  return dish ? Response.json({ dish }) : error("Dish not found.", 404);
}
