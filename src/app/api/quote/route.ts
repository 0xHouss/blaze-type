import { getRandomQuote } from "@/lib/data";
import { MAX_SIZES, MaxSize } from "@/lib/definitions";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const size = new URL(request.url).searchParams.get("size") ?? "all";

  if (!MAX_SIZES.includes(size as MaxSize)) {
    return Response.json({ error: "Invalid size" }, { status: 400 });
  }

  try {
    const quote = await getRandomQuote(size as MaxSize);

    return Response.json(quote, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to load quotes:", error);

    return Response.json({ error: "Quotes are unavailable" }, { status: 502 });
  }
}
