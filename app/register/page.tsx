"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EVENT_CONFIG } from "@/config/event";
import MechanicalBackground from "@/components/MechanicalBackground";
import { sounds } from "@/lib/sounds";
import { User, Hash, BookOpen, Calendar, Mail, ArrowRight, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    register_number: "",
    department: "Mechanical Engineering",
    year: "3rd Year",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recoveredNotice, setRecoveredNotice] = useState<string | null>(null);

  const departments = [
    "Mechanical Engineering",
    "Automobile Engineering",
    "Mechatronics & Automation",
    "Production / Manufacturing",
    "Aerospace / Aeronautical",
    "Robotics Engineering",
    "Electrical & Electronics",
    "Computer Science & Engineering",
    "Civil Engineering",
    "Other Department",
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate / Alumni"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setIsLoading(true);
    setErrorMessage(null);
    setRecoveredNotice(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setErrorMessage(data.error || "Attempt already completed for this register number.");
        } else {
          setErrorMessage(data.error || "Failed to register. Please check your inputs.");
        }
        sounds.playWrong();
        setIsLoading(false);
        return;
      }

      // Success or session recovered
      sounds.playCorrect();
      if (typeof window !== "undefined") {
        localStorage.setItem("mech_mania_attempt_id", data.attempt.id);
        localStorage.setItem("mech_mania_participant_id", data.participant.participant_id);
        if (data.participant.register_number) {
          localStorage.setItem("mech_mania_reg_no", data.participant.register_number);
        }
        if (data.participant.id) {
          localStorage.setItem("mech_mania_user_uuid", data.participant.id);
        }
        if (data.session_token) {
          localStorage.setItem("mech_mania_session_token", data.session_token);
        }
      }

      if (data.recovered) {
        setRecoveredNotice("Active mission identified! Resuming your operational status...");
        setTimeout(() => {
          window.location.href = "/play";
        }, 1000);
      } else {
        window.location.href = "/play";
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMessage("Network anomaly. Please verify your connection and try again.");
      sounds.playWrong();
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-8">
      <MechanicalBackground />

      <div className="relative z-10 w-full max-w-lg bg-slate-900/95 border border-mech-border rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-mech-border/70 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold block">
              ACCESS PORTAL • TERMINAL V26
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-tight">
              ENGINEER REGISTRATION
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-xs text-red-200 flex items-start gap-2.5 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold font-mono uppercase block text-red-300">REGISTRATION REJECTED</span>
              <span>{errorMessage}</span>
              {errorMessage.includes("completed") && (
                <div className="mt-2">
                  <Link
                    href="/leaderboard"
                    className="text-amber-400 underline font-semibold hover:text-amber-300"
                  >
                    View Official Leaderboard Standings →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Session Recovered Notice */}
        {recoveredNotice && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-xs text-emerald-200 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold font-mono uppercase block text-emerald-300">SESSION RECOVERED</span>
              <span>{recoveredNotice}</span>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5 font-semibold">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                required
                autoCapitalize="words"
                autoComplete="name"
                placeholder="e.g. Johnathan Vance"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-base sm:text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
              />
            </div>
          </div>

          {/* Register Number */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5 font-semibold">
              Register / Roll Number *
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="register_number"
                required
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                placeholder="e.g. 23ME1045"
                value={formData.register_number}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-base sm:text-sm font-mono text-slate-100 placeholder-slate-600 outline-none transition-all uppercase"
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500 mt-1 block">
              Used for duplicate attempt verification and session recovery.
            </span>
          </div>

          {/* Department & Year in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5 font-semibold">
                Department *
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-base sm:text-xs text-slate-200 outline-none transition-all cursor-pointer"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-900 text-slate-100">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5 font-semibold">
                Year of Study *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-base sm:text-xs text-slate-200 outline-none transition-all cursor-pointer"
                >
                  {years.map((yr) => (
                    <option key={yr} value={yr} className="bg-slate-900 text-slate-100">
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5 font-semibold">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="email"
                placeholder="e.g. pilot@college.edu"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-base sm:text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>INITIALIZING SESSION...</span>
                </>
              ) : (
                <>
                  <span>CONFIRM & ENTER ARENA</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security & Rules Note */}
        <div className="mt-6 pt-4 border-t border-mech-border/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>⚡ 1 Attempt Per Student</span>
          <span>⚙️ Instant Session Generation</span>
        </div>
      </div>
    </div>
  );
}
