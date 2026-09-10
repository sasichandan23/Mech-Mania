"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MechanicalBackground from "@/components/MechanicalBackground";
import { LeaderboardEntry } from "@/types/game";
import { EVENT_CONFIG } from "@/config/event";
import { sounds } from "@/lib/sounds";
import { 
  Trophy, 
  Search, 
  Clock, 
  Filter, 
  RefreshCw, 
  Zap, 
  Award, 
  User, 
  ArrowLeft 
} from "lucide-react";
import { isSupabaseConfigured, supabasePublic } from "@/lib/db/supabase";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [myParticipantId, setMyParticipantId] = useState<string | null>(null);

  // Load Leaderboard data
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard", { cache: "no-store" });
      const data = await res.json();
      if (data.leaderboard) {
        setEntries(data.leaderboard);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMyParticipantId(localStorage.getItem("mech_mania_participant_id"));
    }

    fetchLeaderboard();

    // 1. Supabase Realtime Subscription if configured
    if (isSupabaseConfigured && supabasePublic) {
      const client = supabasePublic;
      const channel = client
        .channel("realtime-leaderboard")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "attempts" },
          () => {
            fetchLeaderboard();
          }
        )
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    } else {
      // 2. High-performance 5s polling fallback
      const interval = setInterval(() => {
        fetchLeaderboard();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  // Filter & Search
  useEffect(() => {
    let result = [...entries];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.participant_id.toLowerCase().includes(query) ||
          e.department.toLowerCase().includes(query)
      );
    }

    if (selectedDept !== "ALL") {
      result = result.filter((e) => e.department.toLowerCase().includes(selectedDept.toLowerCase()));
    }

    setFilteredEntries(result);
  }, [entries, searchQuery, selectedDept]);

  const departments = [
    "ALL",
    "Mechanical",
    "Automobile",
    "Mechatronics",
    "Production",
    "Robotics",
    "Aerospace",
  ];

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  };

  const top3 = entries.slice(0, 3);
  const myRankEntry = entries.find((e) => e.participant_id === myParticipantId);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <MechanicalBackground />

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-mech-border/80 pb-6">
          <div>
            <Link
              href="/"
              onClick={() => sounds.playClick()}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-amber-400 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              BACK TO HQ
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight">
                LIVE STANDINGS
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                REALTIME
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Rankings determined by Score → Accuracy → Total Completion Time
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              fetchLeaderboard();
            }}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-900 border border-mech-border text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>SYNC NOW</span>
          </button>
        </div>

        {/* Top 3 Podium (If at least 1 entry) */}
        {top3.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-2">
            {/* 2nd Place */}
            {top3[1] && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700 backdrop-blur text-center relative order-2 md:order-1">
                <div className="text-3xl mb-1">🥈</div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                  RANK #2 • SILVER
                </span>
                <div className="text-lg font-black text-slate-100 mt-1 truncate">
                  {top3[1].name}
                </div>
                <div className="text-xs text-slate-400 font-mono">{top3[1].department}</div>
                <div className="mt-3 py-1.5 px-3 rounded-xl bg-slate-950 border border-slate-800 inline-flex items-center gap-2 font-mono font-bold text-amber-300 text-sm">
                  <Zap className="w-4 h-4 text-amber-400" />
                  {top3[1].score} XP
                </div>
              </div>
            )}

            {/* 1st Place (Gold Champion) */}
            {top3[0] && (
              <div className="p-6 rounded-2xl bg-gradient-to-b from-yellow-950/40 via-slate-900/90 to-slate-900/90 border-2 border-yellow-500/80 backdrop-blur text-center relative order-1 md:order-2 shadow-2xl shadow-yellow-500/10">
                <div className="text-4xl mb-1">🥇</div>
                <span className="text-xs font-mono text-yellow-400 uppercase font-black tracking-wider block">
                  LEADER • GRAND CHAMPION
                </span>
                <div className="text-xl font-black text-slate-100 mt-1 truncate">
                  {top3[0].name}
                </div>
                <div className="text-xs text-slate-400 font-mono">{top3[0].department}</div>
                <div className="mt-3 py-2 px-4 rounded-xl bg-yellow-500/20 border border-yellow-500/40 inline-flex items-center gap-2 font-mono font-black text-yellow-300 text-base">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  {top3[0].score} XP
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-900/60 backdrop-blur text-center relative order-3">
                <div className="text-3xl mb-1">🥉</div>
                <span className="text-[10px] font-mono text-amber-500 uppercase font-bold block">
                  RANK #3 • BRONZE
                </span>
                <div className="text-lg font-black text-slate-100 mt-1 truncate">
                  {top3[2].name}
                </div>
                <div className="text-xs text-slate-400 font-mono">{top3[2].department}</div>
                <div className="mt-3 py-1.5 px-3 rounded-xl bg-slate-950 border border-slate-800 inline-flex items-center gap-2 font-mono font-bold text-amber-300 text-sm">
                  <Zap className="w-4 h-4 text-amber-400" />
                  {top3[2].score} XP
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-mech-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500"
            />
          </div>

          {/* Department Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => {
                  sounds.playClick();
                  setSelectedDept(dept);
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold whitespace-nowrap transition-colors ${
                  selectedDept === dept
                    ? "bg-amber-500 text-black font-bold"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="rounded-2xl bg-slate-900/90 border border-mech-border overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-16">Rank</th>
                  <th className="py-3 px-4">Engineer / ID</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Department</th>
                  <th className="py-3 px-4 text-right">Score (XP)</th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell">Accuracy</th>
                  <th className="py-3 px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      {entries.length === 0
                        ? "No completed missions recorded yet. Be the first to conquer MECH-MANIA!"
                        : "No matching engineers found for this query."}
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => {
                    const isMe = entry.participant_id === myParticipantId;

                    return (
                      <tr
                        key={entry.participant_id}
                        className={`transition-colors ${
                          isMe
                            ? "bg-amber-500/15 font-bold text-amber-200 border-l-4 border-amber-500"
                            : "hover:bg-slate-800/40 text-slate-200"
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3 px-4">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                              entry.rank === 1
                                ? "bg-yellow-500 text-black"
                                : entry.rank === 2
                                ? "bg-slate-300 text-black"
                                : entry.rank === 3
                                ? "bg-amber-700 text-white"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            #{entry.rank}
                          </span>
                        </td>

                        {/* Name & ID */}
                        <td className="py-3 px-4 font-sans">
                          <div className="font-bold text-slate-100 flex items-center gap-1.5">
                            <span>{entry.name}</span>
                            {isMe && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500 text-black text-[9px] font-mono font-black uppercase">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {entry.participant_id}
                          </span>
                        </td>

                        {/* Department */}
                        <td className="py-3 px-4 hidden sm:table-cell font-sans text-xs text-slate-300">
                          {entry.department} • {entry.year}
                        </td>

                        {/* XP */}
                        <td className="py-3 px-4 text-right font-black text-amber-400 text-sm sm:text-base">
                          {entry.score}
                        </td>

                        {/* Accuracy */}
                        <td className="py-3 px-4 text-right hidden sm:table-cell text-emerald-400">
                          {entry.accuracy}%
                        </td>

                        {/* Time */}
                        <td className="py-3 px-4 text-right text-slate-400">
                          {formatTime(entry.total_time)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Current User Floating Rank Bar */}
        {myRankEntry && (
          <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-amber-500 text-black shadow-2xl flex items-center justify-between font-mono animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black text-amber-400 flex items-center justify-center font-black text-lg">
                #{myRankEntry.rank}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block -mb-1 opacity-80">
                  YOUR CURRENT STANDING
                </span>
                <span className="font-bold font-sans text-base">{myRankEntry.name}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black">{myRankEntry.score} XP</span>
              <span className="text-xs block opacity-80">{myRankEntry.accuracy}% Accuracy</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
