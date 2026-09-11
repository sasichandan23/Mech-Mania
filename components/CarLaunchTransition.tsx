"use client";

import React, { useEffect, useState } from "react";
import { sounds } from "@/lib/sounds";
import { Zap, FastForward, Gauge, Flame } from "lucide-react";

interface CarLaunchTransitionProps {
  onComplete: () => void;
}

export default function CarLaunchTransition({ onComplete }: CarLaunchTransitionProps) {
  // Phases: "ignition" (0-700ms) -> "burnout" (700-1700ms) -> "launch" (1700-2400ms) -> "flash" (2400-2600ms)
  const [phase, setPhase] = useState<"ignition" | "burnout" | "launch" | "flash">("ignition");
  const [rpm, setRpm] = useState<number>(1200);
  const [speed, setSpeed] = useState<number>(0);

  useEffect(() => {
    // 1. Trigger realistic procedural Web Audio V8 burnout & launch sounds
    sounds.unlockAudio();
    sounds.playCarBurnoutLaunch();

    // 2. Timeline progression
    const burnoutTimer = setTimeout(() => {
      setPhase("burnout");
      setRpm(8400);
      setSpeed(42);
    }, 700);

    const launchTimer = setTimeout(() => {
      setPhase("launch");
      setRpm(9800);
      setSpeed(195);
    }, 1700);

    const flashTimer = setTimeout(() => {
      setPhase("flash");
    }, 2350);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2600);

    // Keyboard ESC to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(burnoutTimer);
      clearTimeout(launchTimer);
      clearTimeout(flashTimer);
      clearTimeout(completeTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-slate-950 flex flex-col justify-between transition-opacity duration-300 select-none ${
        phase === "flash" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Dynamic Screen Flash on Launch Transition */}
      <div
        className={`absolute inset-0 z-40 pointer-events-none transition-opacity duration-200 bg-amber-400 ${
          phase === "flash" ? "opacity-90" : "opacity-0"
        }`}
      />

      {/* Cinematic Speed Blur Streaks (during launch) */}
      {phase === "launch" && (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-cyan-400 to-amber-300 opacity-80 animate-speed-streak"
              style={{
                top: `${(i * 6.5) % 100}%`,
                left: "-100%",
                width: `${40 + (i % 5) * 15}%`,
                animationDelay: `${(i * 0.04)}s`,
                animationDuration: "0.25s",
              }}
            />
          ))}
        </div>
      )}

      {/* Ambient Grid & Drag Strip Sky */}
      <div className="absolute inset-0 pointer-events-none bg-mech-grid opacity-25" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top HUD Bar */}
      <header className="relative z-20 px-4 sm:px-8 py-5 flex items-center justify-between border-b border-mech-border/60 bg-slate-950/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              LAUNCH CONTROL SYSTEM • MECH V8 TURBO
            </div>
            <div className="text-xs font-mono text-slate-300 font-bold flex items-center gap-2">
              <span>STATUS:</span>
              <span
                className={`${
                  phase === "ignition"
                    ? "text-yellow-400 animate-pulse"
                    : phase === "burnout"
                    ? "text-red-400 animate-bounce"
                    : "text-cyan-400 font-black"
                }`}
              >
                {phase === "ignition" && "IGNITION & PRE-HEAT"}
                {phase === "burnout" && "TIRE BURNOUT • HEAT OPTIMAL"}
                {phase === "launch" && "NITRO INJECTION • HYPER LAUNCH!"}
              </span>
            </div>
          </div>
        </div>

        {/* Digital Tachometer & Speed Display */}
        <div className="hidden sm:flex items-center gap-6 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">RPM:</span>
            <span className="font-black text-slate-100 tabular-nums">{rpm}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">VELOCITY:</span>
            <span className="font-black text-cyan-300 tabular-nums">{speed} MPH</span>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={onComplete}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white hover:border-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>SKIP</span>
          <FastForward className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </header>

      {/* Main Drag Strip Stage & Mechanical Car Arena */}
      <main className="relative z-10 flex-1 flex flex-col justify-end pb-8 sm:pb-16 overflow-hidden">
        {/* RPM Rev Meter Progress Strip */}
        <div className="max-w-md mx-auto w-full px-4 mb-8 text-center">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 mb-1">
            <span>IDLE</span>
            <span className="text-amber-400">BOOST READY</span>
            <span className="text-red-500">REDLINE 9,800 RPM</span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full border border-slate-800 p-0.5 overflow-hidden flex gap-0.5">
            {[...Array(24)].map((_, i) => {
              const activeCount =
                phase === "ignition" ? 8 : phase === "burnout" ? 20 : 24;
              const isActive = i < activeCount;
              const isRedline = i >= 18;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-sm transition-colors duration-150 ${
                    isActive
                      ? isRedline
                        ? "bg-red-500 shadow-sm shadow-red-500"
                        : "bg-amber-400 shadow-sm shadow-amber-400"
                      : "bg-slate-800"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* The Drag Strip Surface */}
        <div className="relative w-full">
          {/* Asphalt Track */}
          <div className="w-full h-16 sm:h-20 bg-slate-900 border-t-2 border-slate-700 relative overflow-hidden shadow-inner">
            {/* Start Line Grid Pattern */}
            <div className="absolute top-0 bottom-0 left-12 sm:left-32 w-4 bg-yellow-400/80 border-r-2 border-dashed border-black/60" />

            {/* Road Lane Dashed Markings */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-repeat-x flex gap-8">
              {[...Array(30)].map((_, idx) => (
                <div key={idx} className="w-10 h-1 bg-slate-600/40 shrink-0" />
              ))}
            </div>

            {/* Tire Burnout Rubber Skid Marks (emerges during burnout and launch) */}
            <div
              className={`absolute top-4 sm:top-5 left-12 sm:left-32 h-3 bg-black/80 rounded-full blur-[1px] transition-all duration-700 ${
                phase === "ignition" ? "w-0 opacity-0" : "w-64 sm:w-96 opacity-90"
              }`}
            />
            <div
              className={`absolute bottom-4 sm:bottom-5 left-12 sm:left-32 h-3 bg-black/80 rounded-full blur-[1px] transition-all duration-700 ${
                phase === "ignition" ? "w-0 opacity-0" : "w-64 sm:w-96 opacity-90"
              }`}
            />
          </div>

          {/* ========================================================================= */}
          {/* THE MECHANICAL GT CYBER CAR CONTAINER */}
          {/* ========================================================================= */}
          <div
            className={`absolute bottom-6 sm:bottom-8 left-4 sm:left-24 transition-all ${
              phase === "ignition"
                ? "translate-x-0 animate-chassis-idle"
                : phase === "burnout"
                ? "translate-x-1 sm:translate-x-2 animate-chassis-burnout"
                : "translate-x-[180vw] duration-[850ms] ease-in"
            }`}
            style={{ width: "min(88vw, 560px)" }}
          >
            <div className="relative">
              {/* Headlight Beam Projection Cone (cast forward) */}
              <div
                className={`absolute top-8 right-[-140px] sm:right-[-260px] w-48 sm:w-80 h-28 sm:h-36 bg-gradient-to-r from-cyan-300/45 via-amber-200/20 to-transparent pointer-events-none transform -skew-y-3 blur-md transition-opacity duration-300 ${
                  phase === "ignition" ? "opacity-70 animate-pulse" : "opacity-100"
                }`}
                style={{
                  clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 65%)",
                }}
              />

              {/* Billowing Burnout Smoke Clouds (Erupting from rear tires) */}
              {(phase === "burnout" || phase === "launch") && (
                <div className="absolute -left-12 sm:-left-20 bottom-1 pointer-events-none z-10">
                  {/* Smoke Puff 1 */}
                  <div className="w-16 h-16 sm:w-28 sm:h-28 rounded-full bg-slate-300/40 blur-xl animate-smoke-puff-1" />
                  {/* Smoke Puff 2 */}
                  <div className="absolute -top-6 -left-4 w-20 h-20 sm:w-36 sm:h-36 rounded-full bg-slate-400/35 blur-2xl animate-smoke-puff-2" />
                  {/* Smoke Puff 3 (Dense rubber smoke) */}
                  <div className="absolute -top-12 -left-10 w-24 h-24 sm:w-44 sm:h-44 rounded-full bg-slate-200/30 blur-2xl animate-smoke-puff-3" />
                </div>
              )}

              {/* Rear Exhaust Flames & Sparks */}
              <div className="absolute -left-6 sm:-left-10 bottom-6 z-10 flex flex-col gap-1.5 pointer-events-none">
                {/* Burnout Exhaust Flame / Nitro Rocket */}
                {phase === "burnout" && (
                  <div className="relative">
                    <div className="w-10 sm:w-16 h-3 sm:h-4 bg-gradient-to-l from-yellow-300 via-orange-500 to-transparent rounded-l-full blur-[1px] animate-exhaust-flame" />
                    <div className="absolute top-0 -left-3 w-3 h-3 rounded-full bg-yellow-200 blur-sm" />
                    {/* Backfire Flying Sparks */}
                    <div className="absolute -top-2 -left-6 w-1 h-1 rounded-full bg-yellow-300 animate-ping" />
                    <div className="absolute top-3 -left-8 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  </div>
                )}

                {/* Hyper Nitro Boost Cone (during launch) */}
                {phase === "launch" && (
                  <div className="relative">
                    <div className="w-24 sm:w-44 h-5 sm:h-6 bg-gradient-to-l from-white via-cyan-400 to-blue-600 rounded-l-full blur-[2px] shadow-[0_0_35px_#06b6d4] animate-nitro-boost" />
                    <div className="absolute -top-1 left-2 w-16 h-2 bg-gradient-to-l from-cyan-200 to-transparent blur-[1px]" />
                  </div>
                )}
              </div>

              {/* SVG HIGH-RESOLUTION CYBER MECHANICAL GT CAR */}
              <svg
                viewBox="0 0 540 180"
                className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] filter"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Body Gradient */}
                  <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="35%" stopColor="#0f172a" />
                    <stop offset="70%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>

                  {/* Amber Racing Stripe Gradient */}
                  <linearGradient id="amberStripe" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>

                  {/* Cockpit Tint */}
                  <linearGradient id="glassTint" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
                  </linearGradient>

                  {/* Carbon Texture */}
                  <pattern id="carbonPattern" width="4" height="4" patternUnits="userSpaceOnUse">
                    <rect width="2" height="2" fill="#090d16" />
                    <rect x="2" width="2" height="2" fill="#171e2e" />
                    <rect y="2" width="2" height="2" fill="#171e2e" />
                    <rect x="2" y="2" width="2" height="2" fill="#090d16" />
                  </pattern>
                </defs>

                {/* 1. REAR GT WING SPOILER */}
                <path
                  d="M32 50 L12 40 L60 40 L64 50 Z"
                  fill="url(#carbonPattern)"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <path d="M42 50 L46 80 L52 80 L48 50 Z" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                <path d="M28 50 L32 80 L38 80 L34 50 Z" fill="#0f172a" stroke="#475569" strokeWidth="1" />

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
                  fill="url(#bodyGradient)"
                  stroke="#475569"
                  strokeWidth="2"
                />

                {/* 3. WIDEBODY FENDER FLARES (Front & Rear) */}
                <path
                  d="M 100 128 A 54 54 0 0 1 208 128 L 196 128 A 44 44 0 0 0 112 128 Z"
                  fill="url(#carbonPattern)"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <path
                  d="M 390 128 A 54 54 0 0 1 498 128 L 486 128 A 44 44 0 0 0 402 128 Z"
                  fill="url(#carbonPattern)"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />

                {/* 4. AERODYNAMIC CARBON FRONT SPLITTER & REAR DIFFUSER */}
                <path d="M 500 128 L 536 128 L 532 134 L 495 134 Z" fill="#000000" stroke="#f59e0b" strokeWidth="1.5" />
                <path d="M 30 128 L 45 128 L 42 135 L 24 135 Z" fill="#000000" stroke="#f59e0b" strokeWidth="1.5" />

                {/* 5. SIDE SKIRT GROUND EFFECTS */}
                <rect x="200" y="126" width="202" height="6" fill="#000000" stroke="#334155" strokeWidth="1" />

                {/* 6. MECH-MANIA AMBER SPEED RACING LIVERY STRIPE */}
                <path
                  d="M 48 100 L 155 96 L 240 76 L 390 76 L 475 96 L 520 102 L 515 108 L 470 102 L 388 82 L 238 82 L 152 102 L 46 106 Z"
                  fill="url(#amberStripe)"
                  opacity="0.95"
                />

                {/* 7. COCKPIT / WINDSHIELD GLASS */}
                <path
                  d="M 218 50 L 338 50 L 416 82 L 275 82 Z"
                  fill="url(#glassTint)"
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                />
                {/* Windshield Pillar */}
                <path d="M 334 50 L 342 50 L 418 82 L 410 82 Z" fill="#0f172a" />

                {/* 8. HOOD SCOOP & TURBOCHARGER INTAKE */}
                <path d="M 410 74 L 450 74 L 460 82 L 400 82 Z" fill="url(#carbonPattern)" stroke="#f59e0b" strokeWidth="1" />
                <ellipse cx="440" cy="78" rx="8" ry="3" fill="#06b6d4" opacity="0.8" />

                {/* 9. HEADLIGHT ASSEMBLY (Projector LED & Cyber DRL) */}
                <path
                  d="M 505 98 L 524 104 L 512 110 L 498 102 Z"
                  fill="#ffffff"
                  className={phase !== "ignition" ? "drop-shadow-[0_0_12px_#22d3ee]" : ""}
                />
                <circle cx="512" cy="103" r="3.5" fill="#22d3ee" />

                {/* 10. REAR WHEEL ASSEMBLY (X: 156, Y: 128, R: 38) */}
                <g transform="translate(156, 128)">
                  {/* Tire Rubber (Wide 315 drag radial) */}
                  <circle cx="0" cy="0" r="38" fill="#090d16" stroke="#1e293b" strokeWidth="3" />
                  <circle cx="0" cy="0" r="28" fill="#020617" />

                  {/* Red-Hot Glowing Brake Rotor (during burnout) */}
                  <circle
                    cx="0"
                    cy="0"
                    r="22"
                    fill={phase === "burnout" ? "#ef4444" : "#334155"}
                    opacity={phase === "burnout" ? 0.9 : 0.5}
                    className={phase === "burnout" ? "animate-pulse" : ""}
                  />
                  {/* Brake Caliper */}
                  <path d="M -16 -12 L -6 -20 L 0 -18 L -10 -8 Z" fill="#f59e0b" />

                  {/* Rotating Wheel Rim Group */}
                  <g className={phase !== "ignition" ? "animate-spin origin-center" : ""}>
                    <circle cx="0" cy="0" r="26" fill="none" stroke="#64748b" strokeWidth="2.5" />
                    {/* 5 Double-Spokes */}
                    {[0, 72, 144, 216, 288].map((deg) => (
                      <g key={deg} transform={`rotate(${deg})`}>
                        <line x1="0" y1="0" x2="0" y2="25" stroke="#94a3b8" strokeWidth="3" />
                        <circle cx="0" cy="18" r="1.5" fill="#f59e0b" />
                      </g>
                    ))}
                    <circle cx="0" cy="0" r="6" fill="#f59e0b" stroke="#000000" strokeWidth="1" />
                  </g>
                </g>

                {/* 11. FRONT WHEEL ASSEMBLY (X: 446, Y: 128, R: 38) */}
                <g transform="translate(446, 128)">
                  <circle cx="0" cy="0" r="38" fill="#090d16" stroke="#1e293b" strokeWidth="3" />
                  <circle cx="0" cy="0" r="28" fill="#020617" />

                  <circle cx="0" cy="0" r="22" fill="#334155" opacity="0.5" />
                  <path d="M -16 -12 L -6 -20 L 0 -18 L -10 -8 Z" fill="#f59e0b" />

                  <g className={phase !== "ignition" ? "animate-spin origin-center" : ""}>
                    <circle cx="0" cy="0" r="26" fill="none" stroke="#64748b" strokeWidth="2.5" />
                    {[0, 72, 144, 216, 288].map((deg) => (
                      <g key={deg} transform={`rotate(${deg})`}>
                        <line x1="0" y1="0" x2="0" y2="25" stroke="#94a3b8" strokeWidth="3" />
                        <circle cx="0" cy="18" r="1.5" fill="#f59e0b" />
                      </g>
                    ))}
                    <circle cx="0" cy="0" r="6" fill="#f59e0b" stroke="#000000" strokeWidth="1" />
                  </g>
                </g>

                {/* 12. EXHAUST DUAL TIPS (At Rear: X: 36, Y: 126) */}
                <ellipse cx="36" cy="124" rx="5" ry="3" fill="#000000" stroke="#64748b" strokeWidth="1.5" />
                <ellipse cx="34" cy="129" rx="5" ry="3" fill="#000000" stroke="#64748b" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Mission Countdown Footer */}
      <footer className="relative z-20 px-4 sm:px-8 py-4 border-t border-mech-border/60 bg-slate-950/80 backdrop-blur flex items-center justify-between font-mono text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="hidden sm:inline">WARPING INTO MECH-MANIA 2026 ARENA...</span>
          <span className="sm:hidden">ENGINE ACTIVE...</span>
        </div>
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <span>DESTINATION:</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400">
            ENGINEER REGISTRATION
          </span>
        </div>
      </footer>
    </div>
  );
}
