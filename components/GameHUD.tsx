"use client";

import React from "react";
import { Flame, Shield, Zap, Clock, Heart } from "lucide-react";

interface GameHUDProps {
  playerName: string;
  participantId: string;
  currentLevel: number;
  levelName: string;
  isBossLevel: boolean;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  lives: number;
  streak: number;
  questionSecondsLeft: number;
  questionTimeLimit: number;
  globalSecondsLeft: number;
  activeShield: boolean;
  activeDoubleXP: boolean;
}

export default function GameHUD({
  playerName,
  participantId,
  currentLevel,
  levelName,
  isBossLevel,
  questionNumber,
  totalQuestions,
  score,
  lives,
  streak,
  questionSecondsLeft,
  questionTimeLimit,
  globalSecondsLeft,
  activeShield,
  activeDoubleXP,
}: GameHUDProps) {
  // Format Global Timer (MM:SS)
  const globalMins = Math.floor(globalSecondsLeft / 60);
  const globalSecs = globalSecondsLeft % 60;
  const formattedGlobalTime = `${String(globalMins).padStart(2, "0")}:${String(globalSecs).padStart(2, "0")}`;

  // Progress %
  const progressPercent = Math.min(100, Math.round((questionNumber / totalQuestions) * 100));

  // Question Timer Progress (0 to 1)
  const timerRatio = Math.max(0, questionSecondsLeft / questionTimeLimit);
  const isTimeCritical = questionSecondsLeft <= 5;

  return (
    <div className="w-full bg-slate-900/90 border border-mech-border rounded-xl p-3 sm:p-4 backdrop-blur-md shadow-2xl space-y-3">
      {/* Top Row: Participant Info & Global Mission Clock */}
      <div className="flex items-center justify-between border-b border-mech-border/60 pb-2.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-mono text-xs">
            {participantId.split("-")[1] || "PILOT"}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-200 tracking-wide flex items-center gap-1.5">
              <span>{playerName}</span>
              <span className="text-[10px] font-mono text-slate-500">[{participantId}]</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                  isBossLevel
                    ? "bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse"
                    : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                }`}
              >
                {levelName}
              </span>
            </div>
          </div>
        </div>

        {/* Global Mission Timer */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <Clock className={`w-4 h-4 ${globalSecondsLeft < 180 ? "text-red-400 animate-pulse" : "text-amber-400"}`} />
          <div className="text-right">
            <span className="text-[9px] font-mono text-slate-400 block -mb-1">MISSION TIME</span>
            <span className={`font-mono font-bold text-sm tracking-wider ${globalSecondsLeft < 180 ? "text-red-400" : "text-amber-300"}`}>
              {formattedGlobalTime}
            </span>
          </div>
        </div>
      </div>

      {/* Main Metrics Bar: XP, Lives, Streak, Question Timer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
        {/* Metric 1: XP Counter */}
        <div className="bg-slate-950/70 border border-mech-border/60 p-2.5 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">ENGINEER XP</span>
            <span className="text-lg sm:text-xl font-black font-mono text-amber-400 tracking-wider">
              {score}
            </span>
          </div>
          <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center text-amber-400">
            ⚡
          </div>
        </div>

        {/* Metric 2: Lives */}
        <div className="bg-slate-950/70 border border-mech-border/60 p-2.5 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">CORE HEALTH</span>
            <div className="flex items-center gap-1 mt-0.5">
              {[1, 2, 3].map((heartIndex) => (
                <Heart
                  key={heartIndex}
                  className={`w-5 h-5 transition-transform ${
                    heartIndex <= lives
                      ? "text-red-500 fill-red-500 animate-pulse"
                      : "text-slate-700 fill-slate-800"
                  }`}
                />
              ))}
              {lives <= 0 && (
                <span className="text-[9px] font-mono font-bold text-red-400 ml-1 uppercase animate-pulse">
                  OVERHEAT
                </span>
              )}
            </div>
          </div>
          {activeShield && (
            <div className="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-mono text-cyan-400 flex items-center gap-1">
              <Shield className="w-3 h-3 text-cyan-400 animate-pulse" />
              SHIELD
            </div>
          )}
        </div>

        {/* Metric 3: Streaks */}
        <div className="bg-slate-950/70 border border-mech-border/60 p-2.5 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">COMBO STREAK</span>
            <div className="flex items-center gap-1">
              <span className={`text-lg font-black font-mono tracking-wider ${streak >= 3 ? "text-orange-400" : "text-slate-300"}`}>
                x{streak}
              </span>
              {streak >= 3 && (
                <span className="text-[10px] font-mono font-semibold text-orange-400 animate-bounce">
                  BONUS!
                </span>
              )}
            </div>
          </div>
          <div className={`w-8 h-8 rounded flex items-center justify-center ${streak >= 3 ? "bg-orange-500/20 text-orange-400" : "bg-slate-800 text-slate-500"}`}>
            <Flame className={`w-5 h-5 ${streak >= 3 ? "animate-pulse" : ""}`} />
          </div>
        </div>

        {/* Metric 4: Question Timer */}
        <div className={`bg-slate-950/70 border p-2.5 rounded-lg flex items-center justify-between transition-colors ${
          isTimeCritical ? "border-red-500/80 bg-red-950/30" : "border-mech-border/60"
        }`}>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">TIME REMAINING</span>
            <span className={`text-lg sm:text-xl font-black font-mono tracking-wider ${
              isTimeCritical ? "text-red-400 animate-pulse" : "text-cyan-300"
            }`}>
              {questionSecondsLeft}s
            </span>
          </div>
          {/* Circular SVG Progress Ring */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="w-8 h-8 -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="13"
                stroke="currentColor"
                strokeWidth="3"
                className="text-slate-800"
                fill="none"
              />
              <circle
                cx="16"
                cy="16"
                r="13"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={81.68}
                strokeDashoffset={81.68 * (1 - timerRatio)}
                strokeLinecap="round"
                className={`${isTimeCritical ? "text-red-500" : "text-cyan-400"} transition-all duration-300`}
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Active Buff Indicators (2X XP, Shield) */}
      {(activeDoubleXP || activeShield) && (
        <div className="flex items-center gap-2 pt-1">
          {activeDoubleXP && (
            <div className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/40 rounded text-xs font-mono text-yellow-300 flex items-center gap-1 animate-pulse">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              2X XP OVERDRIVE ACTIVE (NEXT CORRECT ANSWER)
            </div>
          )}
          {activeShield && (
            <div className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/40 rounded text-xs font-mono text-cyan-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              HEAT SHIELD CHARGED
            </div>
          )}
        </div>
      )}

      {/* Question Progress Bar */}
      <div>
        <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
          <span>
            QUESTION {questionNumber} OF {totalQuestions}
          </span>
          <span>{progressPercent}% COMPLETE</span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isBossLevel
                ? "bg-gradient-to-r from-red-600 via-yellow-500 to-amber-500"
                : "bg-gradient-to-r from-amber-500 to-cyan-400"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
