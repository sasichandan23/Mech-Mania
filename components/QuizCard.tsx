"use client";

import React, { useEffect } from "react";
import { ClientQuestion } from "@/types/game";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface QuizCardProps {
  question: ClientQuestion;
  isBossLevel: boolean;
  eliminatedOptionIndices?: number[];
  selectedOption: number | null;
  isSubmitting: boolean;
  isAnswerSubmitted: boolean;
  correctOptionIndex: number | null;
  explanationText: string | null;
  onSelectOption: (index: number) => void;
}

export default function QuizCard({
  question,
  isBossLevel,
  eliminatedOptionIndices = [],
  selectedOption,
  isSubmitting,
  isAnswerSubmitted,
  correctOptionIndex,
  explanationText,
  onSelectOption,
}: QuizCardProps) {
  const optionLetters = ["A", "B", "C", "D"];

  // Keyboard shortcut listener (A, B, C, D or 1, 2, 3, 4)
  useEffect(() => {
    if (isAnswerSubmitted || isSubmitting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      let index = -1;
      if (key === "A" || key === "1") index = 0;
      else if (key === "B" || key === "2") index = 1;
      else if (key === "C" || key === "3") index = 2;
      else if (key === "D" || key === "4") index = 3;

      if (index !== -1 && !eliminatedOptionIndices.includes(index)) {
        sounds.playClick();
        onSelectOption(index);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAnswerSubmitted, isSubmitting, eliminatedOptionIndices, onSelectOption]);

  return (
    <div
      className={`w-full bg-slate-900/95 rounded-2xl border ${
        isBossLevel
          ? "border-red-500/80 shadow-red-950/40 shadow-2xl"
          : "border-mech-border shadow-2xl"
      } p-5 sm:p-7 backdrop-blur-xl relative overflow-hidden transition-all`}
    >
      {/* Top Banner: Category & Difficulty */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-mech-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase font-bold tracking-wider">
            {question.category}
          </span>
          <span className="text-[11px] font-mono text-slate-400 uppercase">
            {question.question_type.replace("_", " ")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${
              question.difficulty === "easy"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : question.difficulty === "medium"
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                : question.difficulty === "hard"
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "bg-red-500/30 text-red-300 border border-red-500/50 animate-pulse"
            }`}
          >
            {question.difficulty}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-amber-300 font-bold">
            +{question.points} XP
          </span>
        </div>
      </div>

      {/* Schematic Diagram if available */}
      {question.schematic_svg && (
        <div className="mb-5 p-4 rounded-xl bg-slate-950/80 border border-mech-border flex flex-col items-center justify-center relative">
          <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            ENGINEERING SCHEMATIC
          </div>
          <div
            className="w-full flex justify-center py-2"
            dangerouslySetInnerHTML={{ __html: question.schematic_svg }}
          />
        </div>
      )}

      {/* Question Text */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100 leading-relaxed mb-6">
        {question.question_text}
      </h2>

      {/* Answer Options (A, B, C, D) */}
      <div className="grid grid-cols-1 gap-3 sm:gap-3.5 mb-4">
        {question.options.map((option, index) => {
          const isEliminated = eliminatedOptionIndices.includes(index);
          const isSelected = selectedOption === index;
          const isCorrect = isAnswerSubmitted && correctOptionIndex === index;
          const isWrongSelected = isAnswerSubmitted && isSelected && !isCorrect;

          let optionStyle = "border-mech-border/80 bg-slate-950/60 text-slate-200 hover:border-amber-500/50 hover:bg-slate-800/80";

          if (isEliminated) {
            optionStyle = "opacity-30 pointer-events-none line-through border-slate-800 bg-slate-950 text-slate-600";
          } else if (isCorrect) {
            optionStyle = "border-emerald-500 bg-emerald-950/50 text-emerald-200 glow-cyan ring-1 ring-emerald-400";
          } else if (isWrongSelected) {
            optionStyle = "border-red-500 bg-red-950/50 text-red-200 glow-red ring-1 ring-red-400";
          } else if (isSelected && !isAnswerSubmitted) {
            optionStyle = "border-amber-500 bg-amber-950/40 text-amber-200 ring-1 ring-amber-500/50";
          }

          return (
            <button
              key={index}
              disabled={isSubmitting || isAnswerSubmitted || isEliminated}
              onClick={() => {
                sounds.playClick();
                onSelectOption(index);
              }}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group active:scale-[0.99] ${optionStyle}`}
            >
              <div className="flex items-center gap-3.5 sm:gap-4">
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-sm transition-colors ${
                    isCorrect
                      ? "bg-emerald-500 text-black font-bold"
                      : isWrongSelected
                      ? "bg-red-500 text-white font-bold"
                      : isSelected
                      ? "bg-amber-500 text-black"
                      : "bg-slate-800 text-slate-400 group-hover:bg-amber-500/20 group-hover:text-amber-400"
                  }`}
                >
                  {optionLetters[index]}
                </span>
                <span className="text-sm sm:text-base font-medium tracking-wide">
                  {option}
                </span>
              </div>

              {/* Status Icons */}
              {isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2 animate-bounce" />
              )}
              {isWrongSelected && (
                <XCircle className="w-5 h-5 text-red-400 shrink-0 ml-2 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Concept Explanation Box after submission */}
      {isAnswerSubmitted && explanationText && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-xs sm:text-sm text-slate-300 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold font-mono uppercase text-xs mb-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            ENGINEERING DEBRIEF:
          </div>
          <p className="leading-relaxed text-slate-300 font-sans">
            {explanationText}
          </p>
        </div>
      )}
    </div>
  );
}
