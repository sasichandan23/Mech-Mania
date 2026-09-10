"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { EVENT_CONFIG } from "@/config/event";
import { sounds } from "@/lib/sounds";
import { Volume2, VolumeX, Trophy, Shield, Info, Menu, X, Play } from "lucide-react";

export default function Navbar() {
  const [isMuted, setIsMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMuted(sounds.getIsMuted());
  }, []);

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sounds.playClick();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-mech-border/80 bg-mech-dark/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          href="/"
          onClick={() => sounds.playClick()}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl select-none">⚙️</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-wider bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                {EVENT_CONFIG.EVENT_NAME}
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded">
                LIVE
              </span>
            </div>
            <p className="text-[10px] font-mono tracking-widest text-slate-400 -mt-0.5">
              {EVENT_CONFIG.TAGLINE}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/register"
            onClick={() => sounds.playClick()}
            className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <Play className="w-4 h-4 text-amber-500" />
            Arena
          </Link>
          <Link
            href="/leaderboard"
            onClick={() => sounds.playClick()}
            className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <Trophy className="w-4 h-4 text-yellow-500" />
            Leaderboard
          </Link>
          <Link
            href="/event-info"
            onClick={() => sounds.playClick()}
            className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <Info className="w-4 h-4 text-cyan-400" />
            Rules & Briefing
          </Link>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleMute}
            aria-label="Toggle Sound Effects"
            className="p-2 rounded-lg border border-mech-border bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-all flex items-center gap-2 text-xs font-mono"
            title={isMuted ? "Sound Off (Click to unmute)" : "Sound On (Click to mute)"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-red-400" />
                <span className="text-red-400">MUTED</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-amber-400">SFX ON</span>
              </>
            )}
          </button>

          {/* Enter Arena CTA */}
          <Link
            href="/register"
            onClick={() => sounds.playClick()}
            className="px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all active:scale-95"
          >
            ENTER ARENA
          </Link>
        </nav>

        {/* Mobile Hamburger & SFX Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={handleToggleMute}
            aria-label="Toggle Sound"
            className="p-2 rounded border border-mech-border bg-slate-900 text-slate-300"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle Menu"
            className="p-2 rounded border border-mech-border bg-slate-900 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-mech-border bg-mech-dark/95 backdrop-blur-xl px-4 py-4 space-y-3">
          <Link
            href="/register"
            onClick={() => {
              sounds.playClick();
              setMobileMenuOpen(false);
            }}
            className="block px-3 py-2 rounded-md text-sm font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20"
          >
            🚀 Enter The Arena
          </Link>
          <Link
            href="/leaderboard"
            onClick={() => {
              sounds.playClick();
              setMobileMenuOpen(false);
            }}
            className="block px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-slate-800"
          >
            🏆 Live Leaderboard
          </Link>
          <Link
            href="/event-info"
            onClick={() => {
              sounds.playClick();
              setMobileMenuOpen(false);
            }}
            className="block px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-slate-800"
          >
            📖 Rules & Event Info
          </Link>
        </div>
      )}
    </header>
  );
}
