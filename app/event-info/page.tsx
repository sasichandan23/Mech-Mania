"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MechanicalBackground from "@/components/MechanicalBackground";
import { EVENT_CONFIG } from "@/config/event";
import { sounds } from "@/lib/sounds";
import { 
  QrCode, 
  HelpCircle, 
  Calendar, 
  Mail, 
  Award, 
  Heart, 
  Clock, 
  Zap, 
  CheckCircle2, 
  ExternalLink,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

export default function EventInfoPage() {
  const [currentOrigin, setCurrentOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <MechanicalBackground />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-mech-border text-slate-300 font-mono text-xs uppercase tracking-wider mb-4">
            <span>⚙️</span> {EVENT_CONFIG.COLLEGE_NAME} • {EVENT_CONFIG.CLUB_NAME}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 uppercase tracking-tight mb-2">
            EVENT PROTOCOLS & BRIEFING
          </h1>
          <p className="text-xs sm:text-sm font-mono text-amber-400 uppercase tracking-wider">
            {EVENT_CONFIG.EVENT_NAME} • ZERO-ADMIN AUTONOMOUS ENGINE
          </p>
        </div>

        {/* Big Projector / QR Code Card for Organizers */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border-2 border-amber-500/60 shadow-2xl backdrop-blur-xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3 text-left">
            <span className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs uppercase font-bold tracking-wider">
              PROJECTOR & DISPLAY MODE
            </span>
            <h2 className="text-2xl font-black text-slate-100">
              SCAN TO ENTER THE ARENA
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Organizers: Display this screen on the auditorium projector. Students can scan the QR code using any smartphone camera or navigate to the URL directly.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-400 break-all select-all">
              {currentOrigin ? `${currentOrigin}/register` : "https://mech-mania-2026.vercel.app/register"}
            </div>

            <div className="pt-2">
              <Link
                href="/register"
                onClick={() => sounds.playClick()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                <span>OPEN REGISTRATION</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* QR Code Graphic Container */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white text-black shadow-xl">
            {/* High-Contrast SVG QR Pattern */}
            <svg viewBox="0 0 160 160" className="w-44 h-44 sm:w-52 sm:h-52">
              {/* Finder Patterns (Top-Left, Top-Right, Bottom-Left) */}
              <rect x="10" y="10" width="40" height="40" fill="black" />
              <rect x="18" y="18" width="24" height="24" fill="white" />
              <rect x="24" y="24" width="12" height="12" fill="black" />

              <rect x="110" y="10" width="40" height="40" fill="black" />
              <rect x="118" y="18" width="24" height="24" fill="white" />
              <rect x="124" y="24" width="12" height="12" fill="black" />

              <rect x="10" y="110" width="40" height="40" fill="black" />
              <rect x="18" y="118" width="24" height="24" fill="white" />
              <rect x="24" y="124" width="12" height="12" fill="black" />

              {/* Data Blocks */}
              <rect x="60" y="15" width="10" height="10" fill="black" />
              <rect x="80" y="15" width="10" height="10" fill="black" />
              <rect x="60" y="35" width="10" height="10" fill="black" />
              <rect x="75" y="45" width="10" height="10" fill="black" />
              <rect x="90" y="30" width="10" height="10" fill="black" />
              
              <rect x="15" y="65" width="10" height="10" fill="black" />
              <rect x="35" y="75" width="10" height="10" fill="black" />
              <rect x="60" y="60" width="15" height="15" fill="black" />
              <rect x="85" y="65" width="10" height="10" fill="black" />
              <rect x="105" y="60" width="10" height="10" fill="black" />
              <rect x="125" y="70" width="15" height="10" fill="black" />

              <rect x="60" y="90" width="10" height="10" fill="black" />
              <rect x="75" y="105" width="10" height="10" fill="black" />
              <rect x="95" y="95" width="15" height="10" fill="black" />
              <rect x="120" y="100" width="10" height="10" fill="black" />
              <rect x="135" y="115" width="10" height="10" fill="black" />

              <rect x="60" y="125" width="10" height="10" fill="black" />
              <rect x="80" y="130" width="10" height="10" fill="black" />
              <rect x="105" y="125" width="10" height="10" fill="black" />
              <rect x="130" y="135" width="15" height="10" fill="black" />
            </svg>
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-800 mt-2">
              MECH-MANIA 2026 • FAST PORTAL
            </span>
          </div>
        </div>

        {/* Event Schedule & Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-mech-border space-y-3 text-left">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-sm">
              <Clock className="w-4 h-4" />
              <span>EVENT TIMELINE & SCHEDULE</span>
            </div>
            <ul className="space-y-2 text-xs font-mono text-slate-300 divide-y divide-slate-800">
              <li className="pt-2 flex justify-between">
                <span className="text-slate-400">Briefing & Rules:</span>
                <span className="text-slate-200">5 Minutes</span>
              </li>
              <li className="pt-2 flex justify-between">
                <span className="text-slate-400">Quiz Window:</span>
                <span className="text-slate-200">20 Minutes Per Student</span>
              </li>
              <li className="pt-2 flex justify-between">
                <span className="text-slate-400">Live Leaderboard:</span>
                <span className="text-emerald-400">Real-time Continuous</span>
              </li>
              <li className="pt-2 flex justify-between">
                <span className="text-slate-400">Certificate Issuance:</span>
                <span className="text-cyan-400">Immediate Dynamic Render</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-mech-border space-y-3 text-left">
            <div className="flex items-center gap-2 text-yellow-400 font-bold font-mono text-sm">
              <Award className="w-4 h-4" />
              <span>OFFICIAL PRIZES</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 divide-y divide-slate-800">
              {EVENT_CONFIG.PRIZES.map((p) => (
                <li key={p.rank} className="pt-2 flex items-center justify-between">
                  <span className="font-bold text-slate-200">{p.rank} ({p.title})</span>
                  <span className="font-mono text-amber-300 text-[11px]">{p.award}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Organizer & Support Contacts */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-100 text-sm">
              Organized by {EVENT_CONFIG.CLUB_NAME}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {EVENT_CONFIG.COLLEGE_NAME} • {EVENT_CONFIG.EVENT_DATE}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Support: {EVENT_CONFIG.ORGANIZER_CONTACT}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
