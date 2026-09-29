import { getDishes } from "@/app/lib/dishes";

export async function GET() {
  const dishes = await getDishes();
  return Response.json({ dishes });
}
