import { NextRequest, NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";
import { PowerUpType, Attempt } from "@/types/game";
import { createSessionToken, verifySessionToken } from "@/lib/session-token";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { attempt_id, power_up, current_question_id, session_token } = body;
    const token = req.headers.get("x-session-token") || session_token;

    if (!attempt_id || !power_up) {
      return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    let attempt = await GameStore.getAttemptById(attempt_id);
    let participant = attempt ? await GameStore.getParticipantById(attempt.participant_id) : null;

    if ((!attempt || !participant) && token) {
      const verified = verifySessionToken(token);
      if (verified) {
        participant = verified.participant;
        attempt = verified.attempt;
        GameStore.hydrateFromSession(participant, attempt);
      }
    }

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found." }, { status: 404 });
    }

    if (attempt.status !== "in_progress") {
      return NextResponse.json({ error: "Quiz is not active." }, { status: 400 });
    }

    const inventory = { ...attempt.power_ups };
    if (!inventory[power_up as PowerUpType] || inventory[power_up as PowerUpType] <= 0) {
      return NextResponse.json({ error: "Power-up unavailable or already depleted." }, { status: 400 });
    }

    // Decrement inventory
    inventory[power_up as PowerUpType] -= 1;
    let eliminatedOptions: number[] | undefined = undefined;
    let message = "";
    let activeShield = attempt.active_shield;
    let activeDoubleXP = attempt.active_double_xp;

    if (power_up === "fiftyFifty") {
      const question = GameStore.getQuestionById(current_question_id);
      if (!question) {
        return NextResponse.json({ error: "Invalid question ID." }, { status: 400 });
      }

      const wrongIndices = [0, 1, 2, 3].filter((idx) => idx !== question.correct_answer);
      const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
      eliminatedOptions = shuffled.slice(0, 2);
      message = "50/50 Deployed: Two incorrect options eliminated!";
    } else if (power_up === "timeFreeze") {
      message = "Chronos Surge: Timer frozen for 10 seconds!";
    } else if (power_up === "doubleXP") {
      activeDoubleXP = true;
      message = "Overdrive Engaged: 2X XP active on your next correct answer!";
    } else if (power_up === "shield") {
      activeShield = true;
      message = "Thermal Barrier Active: Next incorrect answer absorbed!";
    }

    // Update attempt
    const mergedAttempt: Attempt = {
      ...attempt,
      power_ups: inventory,
      active_shield: activeShield,
      active_double_xp: activeDoubleXP,
    };
    const updatedAttempt = await GameStore.updateAttempt(attempt.id, mergedAttempt);

    // Record audit log
    await GameStore.recordPowerUpUsage(attempt.id, power_up);

    let updatedToken = token;
    if (participant) {
      updatedToken = createSessionToken(participant, updatedAttempt || mergedAttempt);
    }

    return NextResponse.json({
      success: true,
      power_up,
      remaining_power_ups: inventory,
      eliminated_options: eliminatedOptions,
      message,
      session_token: updatedToken,
    });
  } catch (error) {
    console.error("Power-up error:", error);
    return NextResponse.json({ error: "Failed to activate power-up." }, { status: 500 });
  }
}
