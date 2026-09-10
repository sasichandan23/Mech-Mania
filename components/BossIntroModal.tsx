"use client";

import React, { useEffect } from "react";
import { Skull, AlertTriangle, Flame } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface BossIntroModalProps {
  onEngageBoss: () => void;
}

export default function BossIntroModal({ onEngageBoss }: BossIntroModalProps) {
  useEffect(() => {
    sounds.playBossAlarm();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-xl animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-950 border-2 border-red-500 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-red-600/50 relative overflow-hidden text-center">
        {/* Red Hazard Stripes */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

        <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Skull className="w-9 h-9" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-500/20 border border-red-500/40 text-red-400 font-mono text-xs uppercase font-bold tracking-widest mb-3">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          CRITICAL THREAT DETECTED
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 uppercase tracking-tight mb-2">
          FINAL BOSS
        </h2>
        <h3 className="text-lg sm:text-xl font-bold text-slate-200 uppercase tracking-wide mb-3">
          THE MECHANICAL MASTERMIND
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 italic mb-6">
          &ldquo;Only the strongest engineers survive. Standard formulas will not save you.&rdquo;
        </p>

        {/* Boss Rules Highlight */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-red-500/40 mb-6 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
            <Flame className="w-4 h-4 text-red-400" />
            <span>High Stakes: <strong>+300 XP</strong> per correct answer</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span>⏱️</span>
            <span>Extended Calculation Time: <strong>35 seconds</strong> per problem</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span>🛡️</span>
            <span>Power-ups remain operational if unspent</span>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onEngageBoss();
          }}
          className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-black shadow-xl shadow-red-600/40 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>ENGAGE MECHANICAL MASTERMIND</span>
          <Flame className="w-5 h-5 text-black" />
        </button>
      </div>
    </div>
  );
}
