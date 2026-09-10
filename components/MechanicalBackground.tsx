"use client";

import React from "react";

export default function MechanicalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-mech-grid">
      {/* Subtle radial ambient gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 w-[32rem] h-[32rem] bg-red-500/10 rounded-full blur-3xl" />

      {/* Large Ambient Mechanical Gear (Top Right) */}
      <svg
        className="absolute -top-24 -right-24 w-[28rem] h-[28rem] text-slate-800/25 animate-gear-rotate opacity-40"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <path d="M100 25a75 75 0 100 150 75 75 0 000-150zm0 115a40 40 0 110-80 40 40 0 010 80z" />
        {/* Gear Teeth */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <rect
            key={deg}
            x="93"
            y="5"
            width="14"
            height="26"
            rx="4"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
      </svg>

      {/* Meshed Secondary Counter-Rotating Gear (Bottom Left) */}
      <svg
        className="absolute -bottom-20 -left-20 w-80 h-80 text-amber-500/10 animate-gear-rotate-reverse opacity-30"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <circle cx="100" cy="100" r="70" />
        <circle cx="100" cy="100" r="35" fill="#0a0c10" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <rect
            key={deg}
            x="92"
            y="10"
            width="16"
            height="24"
            rx="3"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
      </svg>

      {/* HUD Corner Tech Accents */}
      <div className="absolute top-20 left-6 text-[10px] font-mono text-slate-600 hidden lg:block tracking-widest uppercase">
        SYS_STATUS: READY • MECH-MANIA-CORE-V26
      </div>
      <div className="absolute bottom-6 right-6 text-[10px] font-mono text-slate-600 hidden lg:block tracking-widest uppercase">
        AUTONOMOUS_GAME_ENGINE • 0_ADMIN_MODE
      </div>
    </div>
  );
}
