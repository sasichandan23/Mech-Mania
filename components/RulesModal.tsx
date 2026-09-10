"use client";

import React from "react";
import { EVENT_CONFIG } from "@/config/event";
import { Heart, Flame, Clock, Zap, Shield, Trophy, CheckCircle2 } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface RulesModalProps {
  onStartEngine: () => void;
}

export default function RulesModal({ onStartEngine }: RulesModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-mech-border rounded-2xl p-5 sm:p-8 shadow-2xl relative">
        {/* Subtle Hazard Top Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 hazard-stripes" />

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-wider mb-2">
            <span>⚙️</span> MISSION BRIEFING & PROTOCOLS
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            {EVENT_CONFIG.EVENT_NAME}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
            {EVENT_CONFIG.TAGLINE} • {EVENT_CONFIG.SUBTITLE}
          </p>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 text-sm">
          {/* Rule 1: Questions & Levels */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">30 Questions • 6 Levels</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Progression across Mech Basics, Workshop, Auto, Advanced Thermo/Fluids, Future Tech, and the Final Boss.
              </p>
            </div>
          </div>

          {/* Rule 2: 3 Lives & Overheat */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <Heart className="w-5 h-5 fill-red-500" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">❤️ 3 Core Lives</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Wrong answers cost 1 life. At 0 lives, core overheats: you still continue playing with reduced XP!
              </p>
            </div>
          </div>

          {/* Rule 3: Speed & Streak Bonuses */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">🔥 Streak & Speed Bonuses</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Stack consecutive correct answers for massive multiplier combos. Fast responses earn extra speed XP.
              </p>
            </div>
          </div>

          {/* Rule 4: Timed Attempt */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">⏱️ 20-Min Global Clock</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Each question has a 25s–35s timer. The entire attempt must be completed within 20 minutes.
              </p>
            </div>
          </div>

          {/* Rule 5: 4 Power-Ups */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">🎯 4 Tactical Power-Ups</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Use 50/50, Chronos Freeze, 2X XP Overdrive, and Thermal Shield to turn the tide.
              </p>
            </div>
          </div>

          {/* Rule 6: Leaderboard & Ranking */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">🏆 Live Autonomous Standings</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Rankings determined by Score → Accuracy → Completion Time. Instant digital certificate upon completion.
              </p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-mech-border/60">
          <span className="text-xs font-mono text-slate-400">
            ⚠️ Single attempt per engineer. Session recovery enabled.
          </span>
          <button
            onClick={() => {
              sounds.playCountdownBeep(true);
              onStartEngine();
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>START ENGINE</span>
            <span className="text-base">🔥</span>
          </button>
        </div>
      </div>
    </div>
  );
}
