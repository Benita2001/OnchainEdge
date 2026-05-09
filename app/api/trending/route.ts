import { NextResponse } from "next/server";

import { getTrending } from "@/lib/birdeye";

export const revalidate = 60;

export async function GET() {
  const tokens = await getTrending();

  if (!tokens) {
    return NextResponse.json(
      { error: "Failed to fetch trending tokens" },
      { status: 500 },
    );
  }

  return NextResponse.json(tokens);
}
