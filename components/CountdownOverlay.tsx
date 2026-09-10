"use client";

import React, { useState, useEffect } from "react";
import { sounds } from "@/lib/sounds";

interface CountdownOverlayProps {
  onComplete: () => void;
}

export default function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState<number>(3);
  const [isFinal, setIsFinal] = useState(false);

  useEffect(() => {
    // 3
    sounds.playCountdownBeep(false);

    const timer2 = setTimeout(() => {
      setCount(2);
      sounds.playCountdownBeep(false);
    }, 1000);

    const timer1 = setTimeout(() => {
      setCount(1);
      sounds.playCountdownBeep(false);
    }, 2000);

    const timerLaunch = setTimeout(() => {
      setIsFinal(true);
      sounds.playCountdownBeep(true);
    }, 3000);

    const timerDone = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer2);
      clearTimeout(timer1);
      clearTimeout(timerLaunch);
      clearTimeout(timerDone);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in">
      <div className="text-center space-y-4">
        <div className="text-xs font-mono tracking-widest text-amber-400 uppercase animate-pulse">
          INITIALIZING MECHANICAL CORE SYSTEMS
        </div>

        {!isFinal ? (
          <div className="text-8xl sm:text-9xl font-black font-mono text-amber-400 drop-shadow-[0_0_35px_rgba(245,158,11,0.8)] scale-110 transition-transform">
            {count}
          </div>
        ) : (
          <div className="text-4xl sm:text-6xl font-black font-mono bg-gradient-to-r from-red-500 via-amber-400 to-yellow-400 bg-clip-text text-transparent animate-bounce">
            🔥 START ENGINE!
          </div>
        )}

        <div className="text-sm font-mono text-slate-400">
          {!isFinal ? "PREPARE FOR SECTOR 1" : "ARENA DEPLOYMENT IN PROGRESS"}
        </div>
      </div>
    </div>
  );
}
