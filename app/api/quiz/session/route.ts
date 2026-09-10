import { NextRequest, NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";
import { getSafeQuestion, generateAttemptQuestions } from "@/data/questions";
import { EVENT_CONFIG } from "@/config/event";
import { verifySessionToken } from "@/lib/session-token";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const attemptId = searchParams.get("attempt_id");
    const token = req.headers.get("x-session-token") || searchParams.get("token");

    let attempt = attemptId ? await GameStore.getAttemptById(attemptId) : null;
    let participant = attempt ? await GameStore.getParticipantById(attempt.participant_id) : null;

    // If serverless lambda cold-started or memory cache was purged, recover from verified session token
    if ((!attempt || !participant) && token) {
      const verified = verifySessionToken(token);
      if (verified) {
        participant = verified.participant;
        attempt = verified.attempt;
        GameStore.hydrateFromSession(participant, attempt);
      }
    }

    if (!attempt || !participant) {
      return NextResponse.json({ error: "Session not found. Please register." }, { status: 404 });
    }

    // Check if already completed
    if (attempt.status === "completed") {
      return NextResponse.json({
        status: "completed",
        participant,
        attempt,
      });
    }

    // Check Global 20-Minute Timer
    const startedAt = new Date(attempt.started_at).getTime();
    const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
    const totalAllowed = EVENT_CONFIG.TOTAL_QUIZ_DURATION_SECONDS;
    const remainingSeconds = Math.max(0, totalAllowed - elapsedSeconds);

    if (remainingSeconds <= 0) {
      // Auto-complete attempt due to timeout
      await GameStore.updateAttempt(attempt.id, {
        status: "completed",
        total_time: totalAllowed,
        completed_at: new Date().toISOString(),
      });
      return NextResponse.json({
        status: "completed",
        timed_out: true,
        participant,
        attempt: { ...attempt, status: "completed", total_time: totalAllowed },
      });
    }

    // Ensure question_ids exists
    if (!attempt.question_ids || !Array.isArray(attempt.question_ids) || attempt.question_ids.length === 0) {
      console.warn("Attempt question_ids missing in session route, regenerating array...");
      attempt.question_ids = generateAttemptQuestions();
    }

    // Get current question
    const qIndex = attempt.current_question_index;
    if (qIndex >= attempt.question_ids.length) {
      // All questions completed
      await GameStore.updateAttempt(attempt.id, {
        status: "completed",
        completed_at: new Date().toISOString(),
      });
      return NextResponse.json({
        status: "completed",
        participant,
        attempt: { ...attempt, status: "completed" },
      });
    }

    const questionId = attempt.question_ids[qIndex];
    const rawQuestion = GameStore.getQuestionById(questionId);

    if (!rawQuestion) {
      return NextResponse.json({ error: "Question not found in database." }, { status: 500 });
    }

    const currentLevelConfig = EVENT_CONFIG.LEVELS.find((l) => l.level === attempt.current_level);

    return NextResponse.json({
      status: "in_progress",
      participant,
      attempt,
      current_question: getSafeQuestion(rawQuestion),
      current_question_number: qIndex + 1,
      total_questions: attempt.question_ids.length,
      current_level: attempt.current_level,
      level_name: currentLevelConfig ? currentLevelConfig.name : `LEVEL ${attempt.current_level}`,
      is_boss_level: attempt.current_level === 6,
      remaining_global_seconds: remainingSeconds,
      level_time_limit: EVENT_CONFIG.LEVEL_TIME_LIMITS[attempt.current_level] || 25,
    });
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json({ error: "Failed to retrieve game session." }, { status: 500 });
  }
}
