import { dishes } from "../../menu/dishes";

export async function GET() { return Response.json({ dishes }); }
