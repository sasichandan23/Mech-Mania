import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabaseServer } from "@/lib/db/supabase";
import { GameStore } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    isSupabaseConfigured,
  };

  let supabaseConnected = false;
  let participantsCount = 0;
  let attemptsCount = 0;
  let queryError: string | null = null;

  if (isSupabaseConfigured && supabaseServer) {
    try {
      const { count: pCount, error: pErr } = await supabaseServer
        .from("participants")
        .select("*", { count: "exact", head: true });

      const { count: aCount, error: aErr } = await supabaseServer
        .from("attempts")
        .select("*", { count: "exact", head: true });

      if (!pErr && !aErr) {
        supabaseConnected = true;
        participantsCount = pCount || 0;
        attemptsCount = aCount || 0;
      } else {
        queryError = (pErr?.message || "") + " " + (aErr?.message || "");
      }
    } catch (e: any) {
      queryError = e?.message || "Connection failed";
    }
  }

  const leaderboard = await GameStore.getLeaderboard();

  return NextResponse.json({
    status: supabaseConnected ? "healthy" : "warning",
    supabase_configured: isSupabaseConfigured,
    supabase_connected: supabaseConnected,
    environment_variables: envStatus,
    database_counts: {
      participants: participantsCount,
      attempts: attemptsCount,
      leaderboard_entries: leaderboard.length,
    },
    error_details: queryError,
    sample_leaderboard: leaderboard.slice(0, 5),
    setup_help: !supabaseConnected
      ? "To permanently save scores across all devices and sessions, add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) into your Vercel Project Settings > Environment Variables, and run the SQL migration in your Supabase SQL Editor."
      : "Supabase database is connected and operational!",
  });
}
