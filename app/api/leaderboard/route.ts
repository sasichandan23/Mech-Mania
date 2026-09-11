import { NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";

import { isSupabaseConfigured } from "@/lib/db/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leaderboard = await GameStore.getLeaderboard();
    const total_registered = leaderboard.length;
    const total_completed = leaderboard.filter((e) => e.status === "completed").length;
    const total_playing = leaderboard.filter(
      (e) => e.status === "in_progress" || e.status === "playing" || e.status === "registered"
    ).length;

    return NextResponse.json({
      leaderboard,
      total_registered,
      total_playing,
      total_completed,
      is_permanent: isSupabaseConfigured,
      database_mode: isSupabaseConfigured ? "supabase_permanent" : "local_ephemeral",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json({ error: "Failed to load leaderboard." }, { status: 500 });
  }
}
