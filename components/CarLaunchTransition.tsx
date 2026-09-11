"use client";

import React, { useEffect, useState } from "react";
import { sounds } from "@/lib/sounds";
import { Zap, FastForward, Gauge, Flame, Flag } from "lucide-react";

interface CarLaunchTransitionProps {
  onComplete: () => void;
}

export default function CarLaunchTransition({ onComplete }: CarLaunchTransitionProps) {
  // Phases: "ignition" (0-1200ms) -> "burnout" (1200-2800ms) -> "launch" (2800-3600ms) -> "flash" (3600-3850ms)
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
      setSpeed(45);
    }, 1200);

    const launchTimer = setTimeout(() => {
      setPhase("launch");
      setRpm(9900);
      setSpeed(215);
    }, 2800);

    const flashTimer = setTimeout(() => {
      setPhase("flash");
    }, 3600);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3850);

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
      className={`fixed inset-0 z-[9999] overflow-hidden bg-slate-950 flex flex-col justify-between transition-opacity duration-300 select-none ${
        phase === "flash" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Dynamic Screen Flash on Launch Transition */}
      <div
        className={`absolute inset-0 z-50 pointer-events-none transition-opacity duration-200 bg-amber-400 ${
          phase === "flash" ? "opacity-95" : "opacity-0"
        }`}
      />

      {/* Cinematic Speed Blur Streaks (during launch) */}
      {phase === "launch" && (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-cyan-400 to-amber-300 opacity-90 animate-speed-streak"
              style={{
                top: `${(i * 5.2) % 100}%`,
                left: "-100%",
                width: `${40 + (i % 5) * 18}%`,
                animationDelay: `${i * 0.03}s`,
                animationDuration: "0.22s",
              }}
            />
          ))}
        </div>
      )}

      {/* Ambient Grid Background */}
      <div className="absolute inset-0 pointer-events-none bg-mech-grid opacity-30" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[45rem] h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top HUD Bar */}
      <header className="relative z-30 px-4 sm:px-8 py-4 flex items-center justify-between border-b border-mech-border/60 bg-slate-950/90 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              LAUNCH CONTROL SYSTEM • MECH V8 TURBOCHARGED
            </div>
            <div className="text-xs sm:text-sm font-mono text-slate-200 font-bold flex items-center gap-2">
              <span>STATUS:</span>
              <span
                className={`${
                  phase === "ignition"
                    ? "text-yellow-400 animate-pulse"
                    : phase === "burnout"
                    ? "text-red-400 font-black animate-bounce"
                    : "text-cyan-400 font-black"
                }`}
              >
                {phase === "ignition" && "STAGE 1: ENGINE START & PRE-HEAT"}
                {phase === "burnout" && "STAGE 2: TIRE BURNOUT • HEAT OPTIMAL"}
                {phase === "launch" && "STAGE 3: NITRO INJECTION • HYPER LAUNCH!"}
              </span>
            </div>
          </div>
        </div>

        {/* Digital Tachometer & Speed Display */}
        <div className="hidden sm:flex items-center gap-6 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">RPM:</span>
            <span className="font-black text-slate-100 tabular-nums text-sm">{rpm}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">VELOCITY:</span>
            <span className="font-black text-cyan-300 tabular-nums text-sm">{speed} MPH</span>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={onComplete}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white hover:border-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>SKIP</span>
          <FastForward className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </header>

      {/* Main Drag Strip Stage: PROMINENTLY CENTERED */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center p-4 overflow-hidden w-full max-w-5xl mx-auto">
        {/* Drag Strip Countdown Lights & RPM Meter */}
        <div className="flex flex-col items-center gap-2 mb-6 sm:mb-8 w-full max-w-md">
          {/* Drag Tree Lights */}
          <div className="flex items-center gap-3 p-2 px-5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur">
            <span className="font-mono text-[10px] font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Flag className="w-3 h-3 text-amber-400" />
              <span>DRAG TREE:</span>
            </span>
            {/* Stage 1: Red */}
            <div
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                phase === "ignition"
                  ? "bg-red-500 shadow-[0_0_15px_#ef4444] border-red-400"
                  : "bg-red-950 border-red-900 opacity-40"
              }`}
            />
            {/* Stage 2: Amber 1 */}
            <div
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                phase === "burnout"
                  ? "bg-amber-400 shadow-[0_0_15px_#f59e0b] border-amber-300"
                  : "bg-amber-950 border-amber-900 opacity-40"
              }`}
            />
            {/* Stage 2: Amber 2 */}
            <div
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                phase === "burnout"
                  ? "bg-amber-400 shadow-[0_0_15px_#f59e0b] border-amber-300"
                  : "bg-amber-950 border-amber-900 opacity-40"
              }`}
            />
            {/* Stage 3: Green Launch */}
            <div
              className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                phase === "launch" || phase === "flash"
                  ? "bg-emerald-400 shadow-[0_0_25px_#10b981] border-emerald-300 animate-ping"
                  : "bg-emerald-950 border-emerald-900 opacity-40"
              }`}
            />
          </div>

          {/* RPM Rev Bar Strip */}
          <div className="w-full">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 mb-1 px-1">
              <span>0 RPM</span>
              <span className="text-amber-400">BOOST ACTIVE</span>
              <span className="text-red-500">9,900 RPM</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full border border-slate-800 p-0.5 overflow-hidden flex gap-0.5">
              {[...Array(24)].map((_, i) => {
                const activeCount =
                  phase === "ignition" ? 8 : phase === "burnout" ? 21 : 24;
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
        </div>

        {/* ========================================================================= */}
        {/* THE ANIMATED MECHANICAL SUPERCAR STAGE */}
        {/* ========================================================================= */}
        <div
          className={`relative w-full max-w-2xl transition-transform ${
            phase === "ignition"
              ? "animate-chassis-idle scale-100"
              : phase === "burnout"
              ? "animate-chassis-burnout scale-[1.02]"
              : "translate-x-[160vw] scale-105 duration-[900ms] ease-in"
          }`}
        >
          {/* Card Container holding the Supercar Graphic */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/70 shadow-[0_0_50px_rgba(245,158,11,0.35)] bg-slate-900">
            {/* The Photorealistic High-Definition Supercar Image */}
            <img
              src="/arena_supercar.jpg"
              alt="MECH-MANIA V8 Supercar"
              className="w-full h-auto object-cover block select-none pointer-events-none"
            />

            {/* Glowing Headlights High-Beam Flash Rays */}
            <div
              className={`absolute top-[38%] left-[12%] w-28 sm:w-44 h-28 sm:h-44 rounded-full bg-cyan-300/60 blur-2xl pointer-events-none transition-all duration-300 ${
                phase !== "ignition" ? "opacity-100 scale-125" : "opacity-60"
              }`}
            />

            {/* Neon Underglow Ground Reflection */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-12 transition-all duration-300 pointer-events-none ${
                phase === "ignition"
                  ? "bg-gradient-to-t from-cyan-500/50 to-transparent"
                  : phase === "burnout"
                  ? "bg-gradient-to-t from-amber-500/70 via-red-500/40 to-transparent animate-pulse"
                  : "bg-gradient-to-t from-cyan-400/90 to-transparent"
              }`}
            />

            {/* Billowing Burnout Tire Smoke Erupting from Rear Wheel */}
            {(phase === "burnout" || phase === "launch") && (
              <div className="absolute right-[12%] bottom-[6%] pointer-events-none z-20">
                <div className="w-28 h-28 sm:w-44 sm:h-44 rounded-full bg-slate-200/50 blur-2xl animate-smoke-puff-1" />
                <div className="absolute -top-10 -right-6 w-32 h-32 sm:w-52 sm:h-52 rounded-full bg-slate-300/40 blur-3xl animate-smoke-puff-2" />
                <div className="absolute -top-20 -right-14 w-36 h-36 sm:w-64 sm:h-64 rounded-full bg-slate-100/35 blur-3xl animate-smoke-puff-3" />
              </div>
            )}

            {/* Rear Exhaust Backfire Flames & Sparks */}
            <div className="absolute right-[2%] bottom-[32%] pointer-events-none z-20">
              {phase === "burnout" && (
                <div className="relative">
                  {/* High Intensity Backfire Flame */}
                  <div className="w-20 sm:w-36 h-8 sm:h-10 bg-gradient-to-r from-yellow-200 via-orange-500 to-red-600 rounded-r-full blur-[1px] animate-exhaust-flame" />
                  <div className="absolute top-1 right-[-12px] w-5 h-5 rounded-full bg-yellow-100 blur-sm" />
                  {/* Flying Spark Particles */}
                  <div className="absolute -top-4 right-[-24px] w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
                  <div className="absolute top-5 right-[-32px] w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                </div>
              )}

              {/* Nitro Blue Flame Jet (during launch) */}
              {phase === "launch" && (
                <div className="relative">
                  <div className="w-40 sm:w-72 h-10 sm:h-12 bg-gradient-to-r from-white via-cyan-400 to-blue-600 rounded-r-full blur-[2px] shadow-[0_0_50px_#06b6d4] animate-nitro-boost" />
                </div>
              )}
            </div>

            {/* In-Car Telemetry HUD Badge */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/80 border border-slate-700/80 backdrop-blur font-mono text-[11px] text-amber-300 flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-bold">ENGINE TELEMETRY: {phase.toUpperCase()}</span>
            </div>
          </div>

          {/* Road Asphalt & Rubber Burn Skid Marks */}
          <div className="mt-3 relative w-full h-8 bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
            <div className="w-full h-1 border-t border-dashed border-slate-700/60" />
            <div
              className={`absolute inset-0 bg-black/70 rounded-xl blur-[1px] transition-opacity duration-500 ${
                phase === "ignition" ? "opacity-0" : "opacity-95"
              }`}
            />
          </div>
        </div>
      </main>

      {/* Bottom Mission Countdown Footer */}
      <footer className="relative z-30 px-4 sm:px-8 py-3.5 border-t border-mech-border/60 bg-slate-950/90 backdrop-blur flex items-center justify-between font-mono text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="hidden sm:inline">WARPING INTO MECH-MANIA 2026 ARENA...</span>
          <span className="sm:hidden">STARTING ENGINE...</span>
        </div>
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <span>DESTINATION:</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
            ENGINEER REGISTRATION
          </span>
        </div>
      </footer>
    </div>
  );
}
