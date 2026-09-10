import { NextRequest, NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";
import { PowerUpType, UsePowerUpPayload, UsePowerUpResponse } from "@/types/game";

export async function POST(req: NextRequest) {
  try {
    const body: UsePowerUpPayload = await req.json();
    const { attempt_id, power_up, current_question_id } = body;

    if (!attempt_id || !power_up) {
      return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    const attempt = await GameStore.getAttemptById(attempt_id);
    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found." }, { status: 404 });
    }

    if (attempt.status !== "in_progress") {
      return NextResponse.json({ error: "Quiz is not active." }, { status: 400 });
    }

    const inventory = { ...attempt.power_ups };
    if (!inventory[power_up] || inventory[power_up] <= 0) {
      return NextResponse.json({ error: "Power-up unavailable or already depleted." }, { status: 400 });
    }

    // Decrement inventory
    inventory[power_up] -= 1;
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
      // Randomly pick 2 wrong indices to eliminate
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
    await GameStore.updateAttempt(attempt.id, {
      power_ups: inventory,
      active_shield: activeShield,
      active_double_xp: activeDoubleXP,
    });

    // Record audit log
    await GameStore.recordPowerUpUsage(attempt.id, power_up);

    const response: UsePowerUpResponse = {
      success: true,
      power_up,
      remaining_power_ups: inventory,
      eliminated_options: eliminatedOptions,
      message,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Power-up error:", error);
    return NextResponse.json({ error: "Failed to activate power-up." }, { status: 500 });
  }
}
