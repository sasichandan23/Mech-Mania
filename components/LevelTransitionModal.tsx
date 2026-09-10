"use client";

import React, { useEffect } from "react";
import { EVENT_CONFIG } from "@/config/event";
import { CheckCircle2, ArrowRight, Zap, Flame } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface LevelTransitionModalProps {
  completedLevel: number;
  completedLevelName: string;
  nextLevel: number;
  xpEarned: number;
  streak: number;
  onContinue: () => void;
}

export default function LevelTransitionModal({
  completedLevel,
  completedLevelName,
  nextLevel,
  xpEarned,
  streak,
  onContinue,
}: LevelTransitionModalProps) {
  useEffect(() => {
    sounds.playLevelUp();
  }, []);

  const nextLevelConfig = EVENT_CONFIG.LEVELS.find((l) => l.level === nextLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border border-mech-border rounded-2xl p-5 sm:p-8 shadow-2xl relative text-center">
        {/* Glowing Ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/15 rounded-full blur-2xl" />

        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
          SECTOR {completedLevel} COMPLETED
        </span>
        <h3 className="text-2xl font-black text-slate-100 mt-1 mb-2">
          {completedLevelName}
        </h3>
        <p className="text-xs text-slate-400 font-mono mb-6">
          Diagnostic telemetry confirmed. System ready for sector advance.
        </p>

        {/* Level Stats Summary */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">XP EARNED</span>
            <span className="text-xl font-mono font-black text-amber-400 flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 text-amber-400" />
              +{xpEarned}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">ACTIVE STREAK</span>
            <span className="text-xl font-mono font-black text-orange-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-orange-400" />
              x{streak}
            </span>
          </div>
        </div>

        {/* Next Level Preview */}
        {nextLevelConfig && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-6 text-left">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
              UPCOMING SECTOR:
            </div>
            <div className="font-bold text-slate-200 text-sm">
              LEVEL {nextLevelConfig.level}: {nextLevelConfig.name}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {nextLevelConfig.description}
            </div>
          </div>
        )}

        <button
          onClick={() => {
            sounds.playClick();
            onContinue();
          }}
          className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>ADVANCE TO LEVEL {nextLevel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
