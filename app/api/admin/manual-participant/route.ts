import { NextRequest, NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";
import { Participant, Attempt } from "@/types/game";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      register_number,
      department,
      year,
      email,
      score,
      accuracy,
      total_time,
      status,
      current_level,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    const cleanReg = (register_number || `REG-${Date.now().toString().slice(-6)}`).trim().toUpperCase();
    const cleanEmail = (email || `${cleanReg.toLowerCase()}@college.edu`).trim().toLowerCase();

    // Check if participant already exists
    let participant =
      (await GameStore.findParticipantByRegisterNumber(cleanReg)) ||
      (await GameStore.findParticipantByEmail(cleanEmail));

    if (!participant) {
      participant = await GameStore.createParticipant({
        name: name.trim(),
        register_number: cleanReg,
        department: department?.trim() || "Mechanical",
        year: year?.trim() || "3rd",
        email: cleanEmail,
      });
    }

    // Build or update attempt
    let attempt = await GameStore.getAttemptByParticipantId(participant.id);
    const numScore = Number(score) || 0;
    const numAccuracy = Number(accuracy) || 100;
    const numTime = Number(total_time) || 180;
    const finalStatus = (status || "completed") as any;
    const finalLevel = Number(current_level) || 6;

    if (attempt) {
      attempt = (await GameStore.updateAttempt(attempt.id, {
        score: numScore,
        accuracy: numAccuracy,
        total_time: numTime,
        status: finalStatus,
        current_level: finalLevel,
        completed_at: new Date().toISOString(),
      })) || attempt;
    } else {
      const newAttempt: Attempt = {
        id: randomUUID(),
        participant_id: participant.id,
        status: finalStatus,
        score: numScore,
        accuracy: numAccuracy,
        total_time: numTime,
        best_streak: 3,
        current_streak: 1,
        current_level: finalLevel,
        current_question_index: 30,
        question_ids: [],
        remaining_lives: 3,
        power_ups: { fiftyFifty: 1, timeFreeze: 1, doubleXP: 1, shield: 1 },
        active_shield: false,
        active_double_xp: false,
        started_at: new Date(Date.now() - numTime * 1000).toISOString(),
        completed_at: new Date().toISOString(),
      };
      await GameStore.hydrateFromSession(participant, newAttempt);
      attempt = newAttempt;
    }

    return NextResponse.json({
      success: true,
      message: `Participant ${participant.name} (${participant.participant_id}) successfully saved to database with ${numScore} XP!`,
      participant,
      attempt,
    });
  } catch (err: any) {
    console.error("Manual participant insert error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to save participant." },
      { status: 500 }
    );
  }
}
