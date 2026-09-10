import { NextRequest, NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";
import { EVENT_CONFIG } from "@/config/event";
import { generateAttemptQuestions } from "@/data/questions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, register_number, department, year, email } = body;

    // 1. Strict Validation
    if (!name || !name.trim() || name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter a valid full name." }, { status: 400 });
    }
    if (!register_number || !register_number.trim() || register_number.trim().length < 3) {
      return NextResponse.json({ error: "Please enter a valid register number." }, { status: 400 });
    }
    if (!department || !department.trim()) {
      return NextResponse.json({ error: "Please select your department." }, { status: 400 });
    }
    if (!year || !year.trim()) {
      return NextResponse.json({ error: "Please select your academic year." }, { status: 400 });
    }
    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json({ error: "Please enter a valid college or personal email address." }, { status: 400 });
    }

    // 2. Check Event Time Window (if enabled in config)
    if (EVENT_CONFIG.EVENT_WINDOW.ENABLED) {
      const now = new Date();
      const start = new Date(EVENT_CONFIG.EVENT_WINDOW.START_TIME);
      const end = new Date(EVENT_CONFIG.EVENT_WINDOW.END_TIME);
      if (now < start) {
        return NextResponse.json({ 
          error: `Event has not started yet. Registration opens at ${start.toLocaleTimeString()}.` 
        }, { status: 403 });
      }
      if (now > end) {
        return NextResponse.json({ 
          error: `Registration is now closed. The event ended at ${end.toLocaleTimeString()}.` 
        }, { status: 403 });
      }
    }

    // 3. Check for existing participant / duplicate attempt prevention
    const existingByReg = await GameStore.findParticipantByRegisterNumber(register_number);
    const existingByEmail = await GameStore.findParticipantByEmail(email);
    const existing = existingByReg || existingByEmail;

    if (existing) {
      // Check attempt status
      const attempt = await GameStore.getAttemptByParticipantId(existing.id);
      if (attempt) {
        if (attempt.status === "completed") {
          return NextResponse.json({
            error: "You have already completed your MECH-MANIA 2026 attempt! Duplicate attempts are prohibited.",
            completed: true,
            participant_id: existing.participant_id,
          }, { status: 409 });
        } else {
          // Recover active attempt
          return NextResponse.json({
            message: "Active session found! Resuming your mission...",
            recovered: true,
            participant: existing,
            attempt,
          });
        }
      }
    }

    // 4. Create new participant
    const participant = await GameStore.createParticipant({
      name,
      register_number,
      department,
      year,
      email,
    });

    // 5. Generate 30 structured, randomized questions
    const question_ids = generateAttemptQuestions();

    // 6. Create attempt
    const attempt = await GameStore.createAttempt({
      participant_id: participant.id,
      question_ids,
      initial_power_ups: { ...EVENT_CONFIG.INITIAL_POWER_UPS },
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful! Prepare for engine start.",
      participant,
      attempt,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error during registration." }, { status: 500 });
  }
}
