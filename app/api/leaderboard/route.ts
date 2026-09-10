import { NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leaderboard = await GameStore.getLeaderboard();
    return NextResponse.json({
      leaderboard,
      total_completed: leaderboard.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json({ error: "Failed to load leaderboard." }, { status: 500 });
  }
}
