import { NextResponse } from "next/server";
import { loadDataset } from "@/lib/data-source";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await loadDataset();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
