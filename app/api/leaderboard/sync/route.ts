import { NextRequest, NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";
import { verifySessionToken, decodeSessionToken } from "@/lib/session-token";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body.token || req.headers.get("x-session-token");
    let participant = body.participant;
    let attempt = body.attempt;

    // Recover from session token if provided
    if (token) {
      const verified = verifySessionToken(token) || decodeSessionToken(token);
      if (verified && verified.participant && verified.attempt) {
        participant = verified.participant;
        attempt = verified.attempt;
      }
    }

    if (!participant || !attempt) {
      return NextResponse.json(
        { error: "No valid session data found to sync.", synced: false },
        { status: 400 }
      );
    }

    // Persist to store and Supabase
    await GameStore.hydrateFromSession(participant, attempt);

    return NextResponse.json({
      success: true,
      synced: true,
      participant: {
        id: participant.id,
        participant_id: participant.participant_id,
        name: participant.name,
        department: participant.department,
        year: participant.year,
      },
      attempt: {
        id: attempt.id,
        score: attempt.score,
        accuracy: attempt.accuracy,
        total_time: attempt.total_time,
        status: attempt.status,
      },
      message: `Operational records for ${participant.name} synced to database successfully!`,
    });
  } catch (error) {
    console.error("Leaderboard self-healing sync error:", error);
    return NextResponse.json(
      { error: "Failed to synchronize session.", synced: false },
      { status: 500 }
    );
  }
}
