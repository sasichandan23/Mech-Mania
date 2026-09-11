"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EVENT_CONFIG } from "@/config/event";
import MechanicalBackground from "@/components/MechanicalBackground";
import CarLaunchTransition from "@/components/CarLaunchTransition";
import { sounds } from "@/lib/sounds";
import { 
  Play, 
  Trophy, 
  Shield, 
  Zap, 
  Clock, 
  Flame, 
  Award, 
  HelpCircle, 
  ArrowRight,
  ChevronRight,
  CheckCircle,
  Sparkles
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [showCarLaunch, setShowCarLaunch] = useState(false);

  const handleEnterArena = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    sounds.playClick();
    setShowCarLaunch(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      <MechanicalBackground />

      {/* Animated Car Burnout & Launch Transition */}
      {showCarLaunch && (
        <CarLaunchTransition onComplete={() => router.push("/register")} />
      )}

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
        {/* College & Club Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-mech-border text-slate-300 font-mono text-xs uppercase tracking-wider mb-6 backdrop-blur shadow-lg">
          <span className="text-amber-400">⚙️</span>
          <span>{EVENT_CONFIG.COLLEGE_NAME}</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400 font-semibold">{EVENT_CONFIG.CLUB_NAME}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase mb-4">
          <span className="block text-slate-100">
            {EVENT_CONFIG.EVENT_NAME.split(" ")[0]}
          </span>
          <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(245,158,11,0.4)]">
            {EVENT_CONFIG.EVENT_NAME.split(" ")[1] || "2026"}
          </span>
        </h1>

        {/* Subtitle & Tagline */}
        <p className="text-sm sm:text-base md:text-lg font-mono text-amber-300/90 tracking-widest uppercase max-w-2xl mx-auto mb-3 font-semibold">
          {EVENT_CONFIG.TAGLINE}
        </p>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
          {EVENT_CONFIG.SUBTITLE}. Zero admin delay. Test your core mechanical intuition across 6 intense sectors and defeat the Mechanical Mastermind.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14">
          <button
            onClick={handleEnterArena}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black shadow-xl shadow-amber-500/25 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black text-black group-hover:translate-x-0.5 transition-transform" />
            <span>ENTER THE ARENA</span>
          </button>

          <Link
            href="/leaderboard"
            onClick={() => sounds.playClick()}
            className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-sm uppercase tracking-wider bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-mech-border hover:border-yellow-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>LEADERBOARD</span>
          </Link>
        </div>

        {/* Live Event Specs Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-mech-border/60 backdrop-blur text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">GAUNTLET</span>
            <div className="text-base sm:text-lg font-black font-mono text-slate-100 flex items-center gap-1.5 mt-0.5">
              <span>6 SECTORS</span>
              <span className="text-[10px] text-amber-400 font-semibold px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">30 Qs</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-mech-border/60 backdrop-blur text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">CORE HEALTH</span>
            <div className="text-base sm:text-lg font-black font-mono text-red-400 flex items-center gap-1 mt-0.5">
              <span>❤️ ❤️ ❤️</span>
              <span className="text-[10px] text-slate-400 font-normal">3 LIVES</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-mech-border/60 backdrop-blur text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">TACTICAL LOADOUT</span>
            <div className="text-base sm:text-lg font-black font-mono text-cyan-400 flex items-center gap-1.5 mt-0.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>4 POWER-UPS</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-mech-border/60 backdrop-blur text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">TIME LIMIT</span>
            <div className="text-base sm:text-lg font-black font-mono text-purple-400 flex items-center gap-1.5 mt-0.5">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>20 MINUTES</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gauntlet Sectors (Levels Preview) */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            MISSION ARCHITECTURE
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            6 PROGRESSIVE LEVELS
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
            Each level pushes your mechanical knowledge deeper, culminating in the Final Boss.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EVENT_CONFIG.LEVELS.map((lvl) => {
            const isBoss = lvl.level === 6;
            return (
              <div
                key={lvl.level}
                className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                  isBoss
                    ? "bg-red-950/20 border-red-500/50 hover:border-red-500 shadow-xl shadow-red-950/30"
                    : "bg-slate-900/80 border-mech-border hover:border-amber-500/50 shadow-lg"
                }`}
              >
                {isBoss && (
                  <div className="absolute top-0 right-0 bg-red-600 text-[9px] font-mono font-black uppercase tracking-wider text-white px-3 py-0.5 rounded-bl">
                    FINAL BOSS
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    SECTOR 0{lvl.level}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isBoss
                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    +{lvl.xpPerQuestion} XP / Q
                  </span>
                </div>
                <h3 className={`text-base font-bold mb-1.5 ${isBoss ? "text-red-400 font-black" : "text-slate-100"}`}>
                  {lvl.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lvl.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Prizes Showcase */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-mech-border relative overflow-hidden backdrop-blur-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              CERTIFICATIONS & RECOGNITION
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              HONORS & CERTIFICATES
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
              Top engineers receive official verified digital certificates of excellence and prestigious distinctions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {EVENT_CONFIG.PRIZES.slice(0, 3).map((prize, idx) => (
              <div
                key={prize.rank}
                className={`p-5 rounded-2xl border text-center relative ${
                  idx === 0
                    ? "bg-yellow-950/20 border-yellow-500/60 ring-1 ring-yellow-500/30"
                    : idx === 1
                    ? "bg-slate-800/40 border-slate-600"
                    : "bg-amber-950/20 border-amber-700/60"
                }`}
              >
                <div className="text-3xl mb-2">
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                </div>
                <div className="text-xs font-mono font-bold uppercase text-slate-400">
                  {prize.rank}
                </div>
                <div className="text-lg font-black text-slate-100 mt-0.5 mb-1.5">
                  {prize.title}
                </div>
                <div className="text-xs text-amber-300 font-semibold font-mono">
                  {prize.award}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-slate-400 font-mono">
            📜 All verified participants automatically receive an official downloadable Certificate of Participation!
          </div>
        </div>
      </section>

      {/* Ready to Deploy Footer CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="space-y-4">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-100">
            ARE YOU READY TO PROVE YOUR SKILLS?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Scan the QR code or click below to register. Your session starts instantly.
          </p>
          <div className="pt-2">
            <button
              onClick={handleEnterArena}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-xl shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <span>COMMENCE REGISTRATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
