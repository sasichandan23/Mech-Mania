"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import MechanicalBackground from "@/components/MechanicalBackground";
import GameHUD from "@/components/GameHUD";
import QuizCard from "@/components/QuizCard";
import PowerUps from "@/components/PowerUps";
import RulesModal from "@/components/RulesModal";
import CountdownOverlay from "@/components/CountdownOverlay";
import LevelTransitionModal from "@/components/LevelTransitionModal";
import BossIntroModal from "@/components/BossIntroModal";
import { 
  ClientQuestion, 
  Participant, 
  Attempt, 
  PowerUpType, 
  SubmitAnswerResponse 
} from "@/types/game";
import { sounds } from "@/lib/sounds";

type GamePhase = 
  | "loading"
  | "rules"
  | "countdown"
  | "playing"
  | "level_transition"
  | "boss_intro"
  | "completed";

export default function PlayPage() {
  const router = useRouter();

  // Core State
  const [phase, setPhase] = useState<GamePhase>("loading");
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ClientQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [totalQuestions, setTotalQuestions] = useState<number>(30);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [levelName, setLevelName] = useState<string>("MECH BASICS");
  const [isBossLevel, setIsBossLevel] = useState<boolean>(false);

  // Timers
  const [globalSecondsLeft, setGlobalSecondsLeft] = useState<number>(1200);
  const [questionSecondsLeft, setQuestionSecondsLeft] = useState<number>(25);
  const [questionTimeLimit, setQuestionTimeLimit] = useState<number>(25);

  // Power-Ups & Status
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [activeShield, setActiveShield] = useState<boolean>(false);
  const [activeDoubleXP, setActiveDoubleXP] = useState<boolean>(false);

  // Answer submission feedback
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(null);
  const [explanationText, setExplanationText] = useState<string | null>(null);

  // Transition data
  const [levelCompleteData, setLevelCompleteData] = useState<{
    completedLevel: number;
    completedLevelName: string;
    nextLevel: number;
    xpEarned: number;
    streak: number;
  } | null>(null);

  // Refs for timers and submission guard
  const questionStartTimeRef = useRef<number>(Date.now());
  const submissionInProgressRef = useRef<boolean>(false);

  // 1. Initial Session Load / Recovery
  useEffect(() => {
    const attemptId = localStorage.getItem("mech_mania_attempt_id");
    const sessionToken = localStorage.getItem("mech_mania_session_token") || "";

    if (!attemptId && !sessionToken) {
      window.location.href = "/register";
      return;
    }

    async function loadSession() {
      try {
        const res = await fetch(`/api/quiz/session?attempt_id=${attemptId || ""}`, {
          headers: {
            "x-session-token": sessionToken,
          },
        });
        const data = await res.json();

        if (!res.ok || !data.attempt) {
          console.error("Session fetch failed:", data);
          // Only redirect if explicitly 404 and no token was present
          if (!sessionToken) {
            window.location.href = "/register";
          }
          return;
        }

        if (data.status === "completed") {
          router.push("/result");
          return;
        }

        setParticipant(data.participant);
        setAttempt(data.attempt);
        setCurrentQuestion(data.current_question);
        setQuestionNumber(data.current_question_number);
        setTotalQuestions(data.total_questions);
        setCurrentLevel(data.current_level);
        setLevelName(data.level_name);
        setIsBossLevel(data.is_boss_level);
        setGlobalSecondsLeft(data.remaining_global_seconds);
        setQuestionSecondsLeft(data.level_time_limit);
        setQuestionTimeLimit(data.level_time_limit);
        setActiveShield(data.attempt.active_shield || false);
        setActiveDoubleXP(data.attempt.active_double_xp || false);

        // If resuming a session that already answered questions, jump straight to playing
        if (data.current_question_number > 1) {
          setPhase("playing");
          questionStartTimeRef.current = Date.now();
        } else {
          setPhase("rules");
        }
      } catch (err) {
        console.error("Error loading session:", err);
      }
    }

    loadSession();
  }, [router]);

  // Submit Answer Handler
  const handleSubmitAnswer = useCallback(async (optionIndex: number) => {
    if (submissionInProgressRef.current || !attempt || !currentQuestion) return;
    submissionInProgressRef.current = true;
    setIsSubmitting(true);
    setSelectedOption(optionIndex);

    const timeSpent = Math.max(1, Math.floor((Date.now() - questionStartTimeRef.current) / 1000));

    const sessionToken = typeof window !== "undefined" ? localStorage.getItem("mech_mania_session_token") || "" : "";

    try {
      const res = await fetch("/api/quiz/submit-answer", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-session-token": sessionToken,
        },
        body: JSON.stringify({
          attempt_id: attempt.id,
          question_id: currentQuestion.id,
          selected_option: optionIndex,
          time_spent: timeSpent,
          session_token: sessionToken,
        }),
      });

      const data: SubmitAnswerResponse & { session_token?: string } = await res.json();

      if (!res.ok) {
        console.error("Submission failed:", data);
        setIsSubmitting(false);
        submissionInProgressRef.current = false;
        return;
      }

      if (data.session_token && typeof window !== "undefined") {
        localStorage.setItem("mech_mania_session_token", data.session_token);
      }

      // Show immediate feedback
      setIsAnswerSubmitted(true);
      setCorrectOptionIndex(data.correct_option);
      setExplanationText(data.explanation);

      // Play audio feedback
      if (data.is_correct) {
        sounds.playCorrect();
        if (data.current_streak >= 3) {
          setTimeout(() => sounds.playStreak(), 200);
        }
      } else {
        sounds.playWrong();
      }

      // Update attempt in state
      setAttempt((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          score: data.current_score,
          current_streak: data.current_streak,
          best_streak: data.best_streak,
          remaining_lives: data.remaining_lives,
          active_shield: false,
          active_double_xp: false,
        };
      });
      setActiveShield(false);
      setActiveDoubleXP(false);

      // Allow 2.2 seconds for the student to read the engineering debrief
      setTimeout(() => {
        setIsAnswerSubmitted(false);
        setSelectedOption(null);
        setCorrectOptionIndex(null);
        setExplanationText(null);
        setEliminatedOptions([]);
        setIsSubmitting(false);
        submissionInProgressRef.current = false;

        // Check if Quiz Complete
        if (data.quiz_completed) {
          if (data.final_summary) {
            localStorage.setItem("mech_mania_final_result", JSON.stringify(data.final_summary));
          }
          router.push("/result");
          return;
        }

        // Check Level Complete Transition
        if (data.level_completed) {
          setLevelCompleteData({
            completedLevel: data.level_completed.level,
            completedLevelName: data.level_completed.level_name,
            nextLevel: data.next_level || data.level_completed.level + 1,
            xpEarned: data.level_completed.xp_earned,
            streak: data.level_completed.streak,
          });

          // If transitioning into Level 6, trigger Boss Intro!
          if (data.next_level === 6) {
            setPhase("boss_intro");
          } else {
            setPhase("level_transition");
          }
          return;
        }

        // Advance to next question in same level
        if (data.next_question) {
          setCurrentQuestion(data.next_question);
          setQuestionNumber((prev) => prev + 1);
          setQuestionSecondsLeft(data.next_question.time_limit);
          setQuestionTimeLimit(data.next_question.time_limit);
          questionStartTimeRef.current = Date.now();
        }
      }, 2200);
    } catch (err) {
      console.error("Submission network error:", err);
      setIsSubmitting(false);
      submissionInProgressRef.current = false;
    }
  }, [attempt, currentQuestion, router]);

  // 2. Global Mission Timer Tick (1-second interval)
  useEffect(() => {
    if (phase !== "playing") return;

    const interval = setInterval(() => {
      setGlobalSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Global mission timer expired - trigger finish
          router.push("/result");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, router]);

  // 3. Per-Question Countdown Timer Tick
  useEffect(() => {
    if (phase !== "playing" || isAnswerSubmitted || isSubmitting) return;

    const interval = setInterval(() => {
      setQuestionSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Question timed out: auto-submit timeout (-1)
          sounds.playWrong();
          handleSubmitAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, isAnswerSubmitted, isSubmitting, handleSubmitAnswer]);

  // Handle Power-Up Usage
  const handleUsePowerUp = async (type: PowerUpType) => {
    if (!attempt || !currentQuestion || isSubmitting || isAnswerSubmitted) return;

    const sessionToken = typeof window !== "undefined" ? localStorage.getItem("mech_mania_session_token") || "" : "";

    try {
      const res = await fetch("/api/quiz/power-up", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-session-token": sessionToken,
        },
        body: JSON.stringify({
          attempt_id: attempt.id,
          power_up: type,
          current_question_id: currentQuestion.id,
          session_token: sessionToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.warn("Power-up failed:", data.error);
        return;
      }

      if (data.session_token && typeof window !== "undefined") {
        localStorage.setItem("mech_mania_session_token", data.session_token);
      }

      // Update remaining inventory
      setAttempt((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          power_ups: data.remaining_power_ups,
        };
      });

      if (type === "fiftyFifty" && data.eliminated_options) {
        setEliminatedOptions(data.eliminated_options);
      } else if (type === "timeFreeze") {
        setQuestionSecondsLeft((prev) => prev + 10);
      } else if (type === "doubleXP") {
        setActiveDoubleXP(true);
      } else if (type === "shield") {
        setActiveShield(true);
      }
    } catch (err) {
      console.error("Error activating power-up:", err);
    }
  };

  // Continue from Level Transition Modal
  const handleContinueNextLevel = () => {
    if (!levelCompleteData || !attempt) return;
    const nextLvl = levelCompleteData.nextLevel;
    setCurrentLevel(nextLvl);
    setIsBossLevel(nextLvl === 6);
    setLevelName(nextLvl === 6 ? "FINAL BOSS: THE MECHANICAL MASTERMIND" : `LEVEL ${nextLvl}`);
    setPhase("playing");
    questionStartTimeRef.current = Date.now();
  };

  // Engage Boss from Boss Intro Modal
  const handleEngageBoss = () => {
    setCurrentLevel(6);
    setIsBossLevel(true);
    setLevelName("FINAL BOSS: THE MECHANICAL MASTERMIND");
    setPhase("playing");
    questionStartTimeRef.current = Date.now();
  };

  if (phase === "loading") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <MechanicalBackground />
        <div className="relative z-10 text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs text-amber-400 uppercase tracking-widest">
            AUTHENTICATING MECHANICAL CORE PROTOCOLS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between p-3 sm:p-6 lg:p-8">
      <MechanicalBackground />

      {/* Rules Modal (Phase: 'rules') */}
      {phase === "rules" && (
        <RulesModal
          onStartEngine={() => {
            setPhase("countdown");
          }}
        />
      )}

      {/* Countdown (Phase: 'countdown') */}
      {phase === "countdown" && (
        <CountdownOverlay
          onComplete={() => {
            setPhase("playing");
            questionStartTimeRef.current = Date.now();
          }}
        />
      )}

      {/* Level Transition Modal */}
      {phase === "level_transition" && levelCompleteData && (
        <LevelTransitionModal
          completedLevel={levelCompleteData.completedLevel}
          completedLevelName={levelCompleteData.completedLevelName}
          nextLevel={levelCompleteData.nextLevel}
          xpEarned={levelCompleteData.xpEarned}
          streak={levelCompleteData.streak}
          onContinue={handleContinueNextLevel}
        />
      )}

      {/* Boss Intro Gauntlet */}
      {phase === "boss_intro" && (
        <BossIntroModal onEngageBoss={handleEngageBoss} />
      )}

      {/* Main Game Interface (When in 'playing') */}
      {participant && attempt && currentQuestion && (
        <div className="relative z-10 max-w-4xl w-full mx-auto space-y-4">
          {/* Top HUD */}
          <GameHUD
            playerName={participant.name}
            participantId={participant.participant_id}
            currentLevel={currentLevel}
            levelName={levelName}
            isBossLevel={isBossLevel}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            score={attempt.score}
            lives={attempt.remaining_lives}
            streak={attempt.current_streak}
            questionSecondsLeft={questionSecondsLeft}
            questionTimeLimit={questionTimeLimit}
            globalSecondsLeft={globalSecondsLeft}
            activeShield={activeShield}
            activeDoubleXP={activeDoubleXP}
          />

          {/* Central Quiz Card */}
          <QuizCard
            question={currentQuestion}
            isBossLevel={isBossLevel}
            eliminatedOptionIndices={eliminatedOptions}
            selectedOption={selectedOption}
            isSubmitting={isSubmitting}
            isAnswerSubmitted={isAnswerSubmitted}
            correctOptionIndex={correctOptionIndex}
            explanationText={explanationText}
            onSelectOption={handleSubmitAnswer}
          />

          {/* Bottom Power-Ups Bar */}
          <PowerUps
            inventory={attempt.power_ups}
            disabled={isSubmitting || isAnswerSubmitted}
            activeShield={activeShield}
            activeDoubleXP={activeDoubleXP}
            onUsePowerUp={handleUsePowerUp}
          />
        </div>
      )}
    </div>
  );
}
