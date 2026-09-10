import { NextRequest, NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";
import { EVENT_CONFIG } from "@/config/event";
import { getSafeQuestion, generateAttemptQuestions } from "@/data/questions";
import { SubmitAnswerResponse, Attempt } from "@/types/game";
import { createSessionToken, verifySessionToken } from "@/lib/session-token";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { attempt_id, question_id, selected_option, time_spent, session_token } = body;
    const token = req.headers.get("x-session-token") || session_token;

    if (!attempt_id || !question_id || selected_option === undefined) {
      return NextResponse.json({ error: "Missing required submission parameters." }, { status: 400 });
    }

    let attempt = await GameStore.getAttemptById(attempt_id);
    let participant = attempt ? await GameStore.getParticipantById(attempt.participant_id) : null;

    // Serverless fallback hydration
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

    if (attempt.status === "completed") {
      return NextResponse.json({ error: "Attempt has already been completed." }, { status: 400 });
    }

    // Ensure question_ids array exists
    if (!attempt.question_ids || !Array.isArray(attempt.question_ids) || attempt.question_ids.length === 0) {
      console.warn("Attempt question_ids missing, regenerating array...");
      attempt.question_ids = generateAttemptQuestions();
    }

    // Resolve target question
    let question = GameStore.getQuestionById(question_id);
    const currentIndex = attempt.current_question_index;
    const expectedQuestionId = attempt.question_ids[currentIndex];

    if (!question && expectedQuestionId) {
      question = GameStore.getQuestionById(expectedQuestionId);
    }

    if (!question) {
      return NextResponse.json({ error: "Question not found." }, { status: 500 });
    }

    // 1. Evaluate correctness
    const isCorrect = selected_option !== -1 && selected_option === question.correct_answer;
    const isBossLevel = attempt.current_level === 6;

    let pointsEarned = 0;
    let newStreak = attempt.current_streak;
    let bestStreak = attempt.best_streak;
    let remainingLives = attempt.remaining_lives;
    let shieldAbsorbed = false;
    let activeShield = attempt.active_shield;
    let activeDoubleXP = attempt.active_double_xp;

    const isCriticalMode = remainingLives <= 0;
    const multiplier = isCriticalMode ? EVENT_CONFIG.SCORING.CRITICAL_MODE_MULTIPLIER : 1.0;

    if (isCorrect) {
      // Base XP
      let basePoints = isBossLevel 
        ? EVENT_CONFIG.SCORING.CORRECT_BOSS_XP 
        : EVENT_CONFIG.SCORING.CORRECT_STANDARD_XP;

      // Double XP Power-Up check
      if (activeDoubleXP) {
        basePoints *= 2;
        activeDoubleXP = false;
      }

      // Fast Answer Speed Bonus (if answered in < 50% of time limit)
      let speedBonus = 0;
      if (time_spent < question.time_limit * 0.5) {
        const ratio = (question.time_limit - time_spent) / question.time_limit;
        speedBonus = Math.floor(ratio * EVENT_CONFIG.SCORING.FAST_ANSWER_BONUS_MAX_XP);
      }

      // Streak logic & bonuses
      newStreak += 1;
      let streakBonus = 0;
      if (newStreak === 3) streakBonus = EVENT_CONFIG.SCORING.STREAK_3_BONUS_XP;
      else if (newStreak === 5) streakBonus = EVENT_CONFIG.SCORING.STREAK_5_BONUS_XP;
      else if (newStreak >= 7) streakBonus = EVENT_CONFIG.SCORING.STREAK_7_BONUS_XP;

      bestStreak = Math.max(bestStreak, newStreak);
      pointsEarned = Math.floor((basePoints + speedBonus + streakBonus) * multiplier);
    } else {
      // Wrong or Timeout
      newStreak = 0;
      pointsEarned = -EVENT_CONFIG.SCORING.WRONG_PENALTY_XP;

      // Shield protection
      if (activeShield) {
        shieldAbsorbed = true;
        activeShield = false; // Shield consumed
      } else {
        if (remainingLives > 0) {
          remainingLives -= 1;
        }
      }
    }

    const newScore = Math.max(0, attempt.score + pointsEarned);
    const nextIndex = currentIndex + 1;
    const isQuizFinished = nextIndex >= attempt.question_ids.length;

    // Determine next level
    let nextLevel = attempt.current_level;
    let levelCompletedData = undefined;

    // Every 5 questions completes a level
    if (nextIndex % EVENT_CONFIG.QUESTIONS_PER_LEVEL === 0 && !isQuizFinished) {
      const completedLvlNumber = attempt.current_level;
      const completedLvlConfig = EVENT_CONFIG.LEVELS.find((l) => l.level === completedLvlNumber);
      nextLevel = completedLvlNumber + 1;

      levelCompletedData = {
        level: completedLvlNumber,
        level_name: completedLvlConfig ? completedLvlConfig.name : `LEVEL ${completedLvlNumber}`,
        xp_earned: newScore - attempt.score,
        accuracy: 100, // Client displays contextual stats
        streak: newStreak,
      };
    }

    // Save answer record to log
    await GameStore.recordAnswer({
      attempt_id: attempt.id,
      question_id,
      selected_answer: selected_option,
      is_correct: isCorrect,
      points_earned: pointsEarned,
      response_time: time_spent,
      answered_at: new Date().toISOString(),
    });

    // Calculate final metrics if finished
    let finalSummary = undefined;
    let finalAccuracy = attempt.accuracy;
    let totalTime = attempt.total_time;

    if (isQuizFinished) {
      const startedAt = new Date(attempt.started_at).getTime();
      totalTime = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));
      
      const correctAnswersCount = isCorrect ? Math.round((attempt.accuracy / 100) * currentIndex) + 1 : Math.round((attempt.accuracy / 100) * currentIndex);
      finalAccuracy = Number(((correctAnswersCount / attempt.question_ids.length) * 100).toFixed(1));

      finalSummary = {
        score: newScore,
        accuracy: finalAccuracy,
        total_time: totalTime,
        correct_count: correctAnswersCount,
        wrong_count: attempt.question_ids.length - correctAnswersCount,
        best_streak: bestStreak,
      };
    } else {
      const correctAnswersCount = isCorrect ? Math.round((attempt.accuracy / 100) * currentIndex) + 1 : Math.round((attempt.accuracy / 100) * currentIndex);
      finalAccuracy = Number(((correctAnswersCount / nextIndex) * 100).toFixed(1));
    }

    // Update attempt in store with complete merged state
    const mergedAttempt: Attempt = {
      ...attempt,
      score: newScore,
      accuracy: finalAccuracy,
      total_time: totalTime,
      current_streak: newStreak,
      best_streak: bestStreak,
      remaining_lives: remainingLives,
      active_shield: activeShield,
      active_double_xp: activeDoubleXP,
      current_question_index: nextIndex,
      current_level: nextLevel,
      status: isQuizFinished ? "completed" : "in_progress",
      completed_at: isQuizFinished ? new Date().toISOString() : undefined,
    };

    const updatedAttempt = await GameStore.updateAttempt(attempt.id, mergedAttempt);

    // Fetch next safe question if available
    let nextSafeQuestion = undefined;
    if (!isQuizFinished) {
      const nextQId = mergedAttempt.question_ids[nextIndex];
      const rawNext = GameStore.getQuestionById(nextQId);
      if (rawNext) {
        nextSafeQuestion = getSafeQuestion(rawNext);
      }
    }

    // Generate updated session token
    let updatedToken = token;
    if (participant) {
      updatedToken = createSessionToken(participant, updatedAttempt || mergedAttempt);
    }

    const responsePayload = {
      is_correct: isCorrect,
      correct_option: question.correct_answer,
      points_earned: pointsEarned,
      current_score: newScore,
      current_streak: newStreak,
      best_streak: bestStreak,
      remaining_lives: remainingLives,
      is_critical_mode: remainingLives <= 0,
      shield_absorbed: shieldAbsorbed,
      explanation: question.explanation,
      next_question: nextSafeQuestion,
      next_level: nextLevel,
      level_completed: levelCompletedData,
      quiz_completed: isQuizFinished,
      final_summary: finalSummary,
      session_token: updatedToken,
    };

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Submit answer error:", error);
    return NextResponse.json({ error: "Failed to process answer submission." }, { status: 500 });
  }
}
