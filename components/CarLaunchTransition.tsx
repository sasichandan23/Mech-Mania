"use client";

import React, { useEffect, useState } from "react";
import { sounds } from "@/lib/sounds";
import { FastForward, Gauge, Flame, Cog } from "lucide-react";

interface CarLaunchTransitionProps {
  onComplete: () => void;
}

export type LaunchStage =
  | "enter"          // 🏎️ Car appears on grid
  | "engine_start"   // 🔥 Engine starts + exhaust/hood glow
  | "engine_rev"     // 🔊 Engine rev
  | "burnout"        // 🔥 Tires burn out + 💨 smoke appears
  | "accelerate"     // Car accelerates VERY FAST & exits screen
  | "loading";       // ⚙️ "LOADING MISSION..."

export default function CarLaunchTransition({ onComplete }: CarLaunchTransitionProps) {
  const [stage, setStage] = useState<LaunchStage>("enter");
  const [rpm, setRpm] = useState<number>(0);
  const [loadingProgress, setLoadingProgress] = useState<number>(10);

  useEffect(() => {
    // 1. Trigger realistic procedural Web Audio V8 burnout & launch sounds
    sounds.unlockAudio();
    sounds.playCarBurnoutLaunch();

    // 2. Exact user-requested sequence timeline:
    // 0ms - 600ms: 🏎️ Car appears
    // 600ms - 1400ms: Engine starts & 🔥 Exhaust / engine glow
    const tEngineStart = setTimeout(() => {
      setStage("engine_start");
      setRpm(1800);
    }, 600);

    // 1400ms - 2300ms: 🔊 Engine rev
    const tEngineRev = setTimeout(() => {
      setStage("engine_rev");
      setRpm(8600);
    }, 1400);

    // 2300ms - 3800ms: 🔥 Tires burn out & 💨 Smoke appears
    const tBurnout = setTimeout(() => {
      setStage("burnout");
      setRpm(9800);
    }, 2300);

    // 3800ms - 4600ms: Car accelerates VERY FAST & Exits screen
    const tAccelerate = setTimeout(() => {
      setStage("accelerate");
      setRpm(10500);
    }, 3800);

    // 4600ms - 5800ms: ⚙️ "LOADING MISSION..."
    const tLoading = setTimeout(() => {
      setStage("loading");
    }, 4600);

    // 5800ms: Registration page
    const tComplete = setTimeout(() => {
      onComplete();
    }, 5800);

    // Keyboard ESC to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(tEngineStart);
      clearTimeout(tEngineRev);
      clearTimeout(tBurnout);
      clearTimeout(tAccelerate);
      clearTimeout(tLoading);
      clearTimeout(tComplete);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onComplete]);

  // Loading bar animation during "loading" stage
  useEffect(() => {
    if (stage === "loading") {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 12;
        });
      }, 90);
      return () => clearInterval(interval);
    }
  }, [stage]);

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden bg-[#07090e] flex flex-col justify-between select-none">
      {/* Ambient Cyber Grid */}
      <div className="absolute inset-0 pointer-events-none bg-mech-grid opacity-20" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[50rem] h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cinematic Speed Streaks (during accelerate) */}
      {stage === "accelerate" && (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-cyan-400 to-amber-300 opacity-90 animate-speed-streak"
              style={{
                top: `${(i * 4.2) % 100}%`,
                left: "-100%",
                width: `${45 + (i % 5) * 15}%`,
                animationDelay: `${i * 0.025}s`,
                animationDuration: "0.2s",
              }}
            />
          ))}
        </div>
      )}

      {/* Top Header HUD */}
      <header className="relative z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-mech-border/60 bg-slate-950/90 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              ARENA DEPLOYMENT PROTOCOL • V8 TURBOCHARGED
            </div>
            <div className="text-xs sm:text-sm font-mono text-slate-200 font-bold flex items-center gap-2">
              <span>STATUS:</span>
              <span className="text-amber-400 font-black">
                {stage === "enter" && "🏎️ CAR ON STARTING GRID"}
                {stage === "engine_start" && "🔥 ENGINE IGNITION • EXHAUST GLOWING"}
                {stage === "engine_rev" && "🔊 ENGINE REV • 8,600 RPM"}
                {stage === "burnout" && "🔥 TIRES BURNING OUT • SMOKE ACTIVE"}
                {stage === "accelerate" && "🚀 ACCELERATING AT HYPER SPEED!"}
                {stage === "loading" && "⚙️ LAUNCH COMPLETE • LOADING MISSION..."}
              </span>
            </div>
          </div>
        </div>

        {/* Tachometer & Skip Button */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
            <Gauge className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">RPM:</span>
            <span className="font-black text-slate-100 tabular-nums">{rpm}</span>
          </div>

          <button
            onClick={onComplete}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white hover:border-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>SKIP</span>
            <FastForward className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </header>

      {/* Main Drag Strip Stage: 100% VISIBLE & CENTERED */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden w-full">
        {/* ========================================================================= */}
        {/* STAGE 6: "LOADING MISSION..." OVERLAY (When car has exited screen) */}
        {/* ========================================================================= */}
        {stage === "loading" ? (
          <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/95 border-2 border-amber-500/70 shadow-2xl shadow-amber-500/20 backdrop-blur text-center space-y-5 animate-in zoom-in-95 duration-300">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <Cog className="w-16 h-16 text-amber-400 animate-spin" style={{ animationDuration: "3s" }} />
              <div className="absolute w-8 h-8 rounded-full bg-amber-500/20 animate-ping" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight flex items-center justify-center gap-2">
                <span>LOADING MISSION...</span>
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-1">
                SYNCHRONIZING SECTOR 01 • ACCESS PROTOCOLS GRANTED
              </p>
            </div>

            {/* High-Tech Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[10px] text-amber-300">
                <span>PREPARING BRIEFING</span>
                <span>{loadingProgress}%</span>
              </div>
              <div className="h-3 w-full bg-slate-950 rounded-full border border-slate-800 p-0.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full transition-all duration-150 shadow-lg shadow-amber-500/50"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>

            <div className="text-[10px] font-mono text-emerald-400 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ARENA INITIALIZED • OPENING REGISTRATION</span>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* STAGES 1 TO 5: THE ANIMATED MECHANICAL RACING CAR & DRAG STRIP */
          /* ========================================================================= */
          <div className="w-full max-w-4xl relative flex flex-col items-center">
            {/* The Asphalt Road Strip */}
            <div className="w-full relative">
              {/* Road Markings & Surface */}
              <div className="w-full h-24 sm:h-32 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-y-2 border-slate-700 relative overflow-hidden rounded-2xl shadow-2xl">
                {/* Starting Grid Line */}
                <div className="absolute top-0 bottom-0 left-12 sm:left-28 w-4 bg-yellow-400/90 border-r-2 border-dashed border-black/70 z-10 flex flex-col justify-between py-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-full h-2 bg-black/70" />
                  ))}
                </div>

                {/* Road Dashed Speed Lines */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 flex gap-8 opacity-40">
                  {[...Array(40)].map((_, i) => (
                    <div key={i} className="w-8 h-1 bg-white shrink-0" />
                  ))}
                </div>

                {/* Burning Rubber Skid Marks Under Rear Wheels */}
                <div
                  className={`absolute top-6 sm:top-8 left-12 sm:left-28 h-4 bg-black/90 rounded-full blur-[1px] transition-all duration-700 ${
                    stage === "enter" || stage === "engine_start" || stage === "engine_rev"
                      ? "w-0 opacity-0"
                      : "w-full opacity-90"
                  }`}
                />
                <div
                  className={`absolute bottom-4 sm:bottom-6 left-12 sm:left-28 h-4 bg-black/90 rounded-full blur-[1px] transition-all duration-700 ${
                    stage === "enter" || stage === "engine_start" || stage === "engine_rev"
                      ? "w-0 opacity-0"
                      : "w-full opacity-90"
                  }`}
                />
              </div>

              {/* =================================================================== */}
              {/* THE ANIMATED CAR CONTAINER */}
              {/* =================================================================== */}
              <div
                className={`absolute bottom-4 sm:bottom-6 left-4 sm:left-20 transition-all ${
                  stage === "enter"
                    ? "translate-x-0 opacity-100"
                    : stage === "engine_start"
                    ? "translate-x-0 animate-chassis-idle opacity-100"
                    : stage === "engine_rev"
                    ? "translate-x-0 animate-chassis-burnout opacity-100"
                    : stage === "burnout"
                    ? "translate-x-1 animate-chassis-burnout opacity-100"
                    : "translate-x-[170vw] duration-[750ms] ease-in opacity-95"
                }`}
                style={{ width: "min(88vw, 540px)" }}
              >
                <div className="relative">
                  {/* Headlight Beams (Off during 'enter', Beaming ON from 'engine_start' onwards) */}
                  {stage !== "enter" && (
                    <div
                      className="absolute top-8 right-[-180px] sm:right-[-320px] w-56 sm:w-96 h-28 sm:h-40 bg-gradient-to-r from-cyan-300/50 via-amber-200/20 to-transparent pointer-events-none transform -skew-y-3 blur-md transition-opacity duration-300"
                      style={{ clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 70%)" }}
                    />
                  )}

                  {/* 💨 Billowing Smoke Clouds (Erupting during burnout and accelerate) */}
                  {(stage === "burnout" || stage === "accelerate") && (
                    <div className="absolute -left-16 sm:-left-24 bottom-0 pointer-events-none z-20">
                      {/* Expanding smoke particles */}
                      <div className="w-20 h-20 sm:w-36 sm:h-36 rounded-full bg-slate-200/60 blur-xl animate-smoke-puff-1" />
                      <div className="absolute -top-8 -left-6 w-24 h-24 sm:w-44 sm:h-44 rounded-full bg-slate-300/50 blur-2xl animate-smoke-puff-2" />
                      <div className="absolute -top-14 -left-12 w-28 h-28 sm:w-52 sm:h-52 rounded-full bg-slate-100/40 blur-2xl animate-smoke-puff-3" />
                      <div className="absolute -top-4 -left-16 w-20 h-20 sm:w-36 sm:h-36 rounded-full bg-slate-400/40 blur-xl animate-smoke-puff-1" />
                    </div>
                  )}

                  {/* 🔥 Exhaust Flames & Sparks at Rear */}
                  <div className="absolute -left-8 sm:-left-12 bottom-6 z-20 flex flex-col gap-1 pointer-events-none">
                    {/* Burnout fire & backfire sparks */}
                    {stage === "burnout" && (
                      <div className="relative">
                        <div className="w-16 sm:w-28 h-5 sm:h-7 bg-gradient-to-l from-yellow-200 via-orange-500 to-red-600 rounded-l-full blur-[1px] animate-exhaust-flame" />
                        <div className="absolute top-0 -left-4 w-4 h-4 rounded-full bg-yellow-200 blur-sm" />
                        {/* Flying Sparks */}
                        <div className="absolute -top-3 -left-8 w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
                        <div className="absolute top-4 -left-10 w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                        <div className="absolute -top-1 -left-14 w-1.5 h-1.5 rounded-full bg-yellow-100 animate-ping" />
                      </div>
                    )}

                    {/* Supersonic Nitro Boost (During accelerate) */}
                    {stage === "accelerate" && (
                      <div className="relative">
                        <div className="w-32 sm:w-60 h-6 sm:h-8 bg-gradient-to-l from-white via-cyan-400 to-blue-600 rounded-l-full blur-[2px] shadow-[0_0_50px_#06b6d4] animate-nitro-boost" />
                      </div>
                    )}
                  </div>

                  {/* ================================================================= */}
                  {/* REALISTIC VECTOR MECHANICAL SUPERCAR */}
                  {/* ================================================================= */}
                  <svg
                    viewBox="0 0 540 180"
                    className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] filter select-none"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      {/* Metallic Carbon Body Gradient */}
                      <linearGradient id="cyberBody" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="35%" stopColor="#0f172a" />
                        <stop offset="70%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>

                      {/* Amber Speed Stripe */}
                      <linearGradient id="cyberAmber" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#fbbf24" />
                      </linearGradient>

                      {/* Glass Cockpit */}
                      <linearGradient id="cyberGlass" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>

                    {/* 1. REAR GT SPOILER WING */}
                    <path d="M 32 50 L 12 40 L 62 40 L 66 50 Z" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                    <path d="M 42 50 L 46 80 L 52 80 L 48 50 Z" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
                    <path d="M 28 50 L 32 80 L 38 80 L 34 50 Z" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />

                    {/* 2. CHASSIS MAIN SILHOUETTE */}
                    <path
                      d="M 38 120 
                         L 52 85 
                         L 145 80 
                         L 210 44 
                         L 350 44 
                         L 435 84 
                         L 505 92 
                         L 525 106 
                         L 528 128 
                         L 490 128 
                         A 44 44 0 0 0 402 128 
                         L 200 128 
                         A 44 44 0 0 0 112 128 
                         L 38 128 Z"
                      fill="url(#cyberBody)"
                      stroke="#475569"
                      strokeWidth="2.5"
                    />

                    {/* 3. 🔥 ENGINE HOOD VENTS & TURBO INTAKE (GLOWING DURING ENGINE START & REV) */}
                    <path
                      d="M 405 76 L 450 76 L 460 84 L 398 84 Z"
                      fill={stage !== "enter" ? "#f59e0b" : "#1e293b"}
                      stroke={stage !== "enter" ? "#fbbf24" : "#475569"}
                      strokeWidth="1.5"
                      className={stage !== "enter" ? "animate-pulse" : ""}
                    />
                    {stage !== "enter" && (
                      <ellipse cx="430" cy="80" rx="14" ry="4" fill="#ff4400" className="animate-ping" opacity="0.6" />
                    )}

                    {/* 4. WIDEBODY FENDER WHEEL ARCHES */}
                    <path
                      d="M 100 128 A 54 54 0 0 1 208 128 L 196 128 A 44 44 0 0 0 112 128 Z"
                      fill="#0f172a"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                    <path
                      d="M 390 128 A 54 54 0 0 1 498 128 L 486 128 A 44 44 0 0 0 402 128 Z"
                      fill="#0f172a"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />

                    {/* 5. AMBER MECH RACING LIVERY STRIPE */}
                    <path
                      d="M 48 100 L 155 96 L 240 76 L 390 76 L 475 96 L 520 102 L 515 108 L 470 102 L 388 82 L 238 82 L 152 102 L 46 106 Z"
                      fill="url(#cyberAmber)"
                    />

                    {/* 6. COCKPIT WINDSHIELD */}
                    <path d="M 218 50 L 338 50 L 416 82 L 275 82 Z" fill="url(#cyberGlass)" stroke="#06b6d4" strokeWidth="2" />
                    <path d="M 334 50 L 342 50 L 418 82 L 410 82 Z" fill="#0f172a" />

                    {/* 7. PROJECTOR HEADLIGHTS */}
                    <path
                      d="M 505 98 L 524 104 L 512 110 L 498 102 Z"
                      fill={stage !== "enter" ? "#ffffff" : "#334155"}
                      className={stage !== "enter" ? "drop-shadow-[0_0_15px_#22d3ee]" : ""}
                    />
                    <circle cx="512" cy="103" r="4" fill={stage !== "enter" ? "#22d3ee" : "#1e293b"} />

                    {/* 8. 🔥 GLOWING EXHAUST TIPS (Orange Glow in engine_start/rev/burnout) */}
                    <ellipse
                      cx="36"
                      cy="124"
                      rx="6"
                      ry="4"
                      fill={stage !== "enter" ? "#ff4400" : "#000000"}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />
                    <ellipse
                      cx="34"
                      cy="130"
                      rx="6"
                      ry="4"
                      fill={stage !== "enter" ? "#ff4400" : "#000000"}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />

                    {/* 9. REAR ROTATING WHEEL & BURNING BRAKE ROTOR (X: 156, Y: 128) */}
                    <g transform="translate(156, 128)">
                      <circle cx="0" cy="0" r="38" fill="#090d16" stroke="#1e293b" strokeWidth="3" />
                      <circle cx="0" cy="0" r="28" fill="#020617" />

                      {/* Red-Hot Glowing Brake Rotor (during burnout & accelerate) */}
                      <circle
                        cx="0"
                        cy="0"
                        r="23"
                        fill={stage === "burnout" || stage === "accelerate" ? "#ef4444" : "#334155"}
                        opacity={stage === "burnout" || stage === "accelerate" ? 0.95 : 0.5}
                        className={stage === "burnout" ? "animate-pulse" : ""}
                      />

                      {/* Rotating Wheel Spokes */}
                      <g className={stage === "burnout" || stage === "accelerate" ? "animate-spin origin-center" : ""}>
                        <circle cx="0" cy="0" r="26" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
                        {[0, 72, 144, 216, 288].map((deg) => (
                          <g key={deg} transform={`rotate(${deg})`}>
                            <line x1="0" y1="0" x2="0" y2="25" stroke="#cbd5e1" strokeWidth="3" />
                            <circle cx="0" cy="18" r="2" fill="#f59e0b" />
                          </g>
                        ))}
                        <circle cx="0" cy="0" r="6" fill="#f59e0b" stroke="#000000" strokeWidth="1" />
                      </g>
                    </g>

                    {/* 10. FRONT ROTATING WHEEL (X: 446, Y: 128) */}
                    <g transform="translate(446, 128)">
                      <circle cx="0" cy="0" r="38" fill="#090d16" stroke="#1e293b" strokeWidth="3" />
                      <circle cx="0" cy="0" r="28" fill="#020617" />
                      <circle cx="0" cy="0" r="23" fill="#334155" opacity="0.5" />

                      <g className={stage === "burnout" || stage === "accelerate" ? "animate-spin origin-center" : ""}>
                        <circle cx="0" cy="0" r="26" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
                        {[0, 72, 144, 216, 288].map((deg) => (
                          <g key={deg} transform={`rotate(${deg})`}>
                            <line x1="0" y1="0" x2="0" y2="25" stroke="#cbd5e1" strokeWidth="3" />
                            <circle cx="0" cy="18" r="2" fill="#f59e0b" />
                          </g>
                        ))}
                        <circle cx="0" cy="0" r="6" fill="#f59e0b" stroke="#000000" strokeWidth="1" />
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Mission Telemetry Footer */}
      <footer className="relative z-30 px-4 sm:px-8 py-3 border-t border-mech-border/60 bg-slate-950/90 backdrop-blur flex items-center justify-between font-mono text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="hidden sm:inline">MECH-MANIA 2026 SPEEDWAY ARENA</span>
          <span className="sm:hidden">MECH ARENA</span>
        </div>
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <span>NEXT:</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
            ENGINEER REGISTRATION
          </span>
        </div>
      </footer>
    </div>
  );
}
