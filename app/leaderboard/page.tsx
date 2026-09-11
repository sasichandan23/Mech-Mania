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
  ArrowLeft,
  Database,
  AlertTriangle,
  CheckCircle2,
  Users,
  Activity,
  Smartphone
} from "lucide-react";
import { isSupabaseConfigured, supabasePublic } from "@/lib/db/supabase";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<LeaderboardEntry[]>([]);
  const [counts, setCounts] = useState({
    total_registered: 0,
    total_playing: 0,
    total_completed: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [myParticipantId, setMyParticipantId] = useState<string | null>(null);
  const [myRegNo, setMyRegNo] = useState<string | null>(null);
  const [myUserUuid, setMyUserUuid] = useState<string | null>(null);
  const [isPermanentDb, setIsPermanentDb] = useState<boolean>(true);
  const [syncedNotice, setSyncedNotice] = useState<string | null>(null);

  // Load Leaderboard data
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard", { cache: "no-store" });
      const data = await res.json();
      if (data.leaderboard) {
        setEntries(data.leaderboard);
        setCounts({
          total_registered: data.total_registered ?? data.leaderboard.length,
          total_playing:
            data.total_playing ??
            data.leaderboard.filter(
              (e: LeaderboardEntry) =>
                e.status === "in_progress" || e.status === "playing" || (!e.status || e.status === "registered")
            ).length,
          total_completed:
            data.total_completed ??
            data.leaderboard.filter((e: LeaderboardEntry) => e.status === "completed").length,
        });
      }
      if (typeof data.is_permanent === "boolean") {
        setIsPermanentDb(data.is_permanent);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pId = localStorage.getItem("mech_mania_participant_id");
      const regNo = localStorage.getItem("mech_mania_reg_no");
      const userUuid = localStorage.getItem("mech_mania_user_uuid");
      setMyParticipantId(pId);
      setMyRegNo(regNo);
      setMyUserUuid(userUuid);

      // Self-healing: sync client session token with server/Supabase
      const token = localStorage.getItem("mech_mania_session_token");
      if (token) {
        fetch("/api/leaderboard/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })
          .then((r) => r.json())
          .then((syncRes) => {
            if (syncRes.synced) {
              setSyncedNotice(`Saved session for ${syncRes.participant?.name || "you"} synced with database.`);
              fetchLeaderboard();
            }
          })
          .catch((e) => console.warn("Client self-healing check:", e));
      }
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

    // Guarantee strictly sequential 1, 2, 3, 4, 5... sequence
    const sequential = result.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

    setFilteredEntries(sequential);
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
  const myRankEntry = entries.find(
    (e) =>
      (myUserUuid && e.id && e.id === myUserUuid) ||
      (myRegNo && e.register_number && e.register_number.toUpperCase() === myRegNo.toUpperCase()) ||
      (myParticipantId && e.participant_id === myParticipantId)
  );

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
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight">
                LIVE STANDINGS
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                REALTIME
              </span>
              {isPermanentDb ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                  <Database className="w-3 h-3 text-emerald-400" />
                  CLOUD DB PERMANENT
                </span>
              ) : (
                <Link
                  href="/admin/db"
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 flex items-center gap-1 transition-colors"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-400 animate-bounce" />
                  EPHEMERAL STORAGE • SETUP DB
                </Link>
              )}
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

        {/* Synced Notification if client session was just restored */}
        {syncedNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncedNotice}</span>
            </div>
            <button
              onClick={() => setSyncedNotice(null)}
              className="text-xs text-emerald-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Organizer Storage Warning if Supabase is not connected */}
        {!isPermanentDb && (
          <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold font-mono text-amber-300 uppercase tracking-wider block">
                  STORAGE WARNING: RUNNING IN EPHEMERAL MEMORY MODE
                </span>
                <span className="text-slate-300 text-[11px] block mt-0.5">
                  Serverless instances reset when inactive. To store all scores and participants permanently forever across all devices and days, connect Supabase in Vercel.
                </span>
              </div>
            </div>
            <Link
              href="/admin/db"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-black font-mono font-bold text-xs hover:bg-amber-400 shrink-0 transition-colors"
            >
              CONNECT DATABASE (2 MIN)
            </Link>
          </div>
        )}

        {/* Mobile Participant Recovery Alert */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-cyan-500/5">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold font-mono text-cyan-300 block">
                PLAYED ON MOBILE &amp; DON&apos;T SEE YOUR SCORE?
              </span>
              <span className="text-slate-300 text-[11px] block mt-0.5 font-sans">
                Each phone has its quiz score saved inside its browser. Tap below to automatically sync and restore your score to the official leaderboard!
              </span>
            </div>
          </div>
          <Link
            href="/recover"
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-mono font-black text-xs hover:bg-cyan-400 shrink-0 transition-colors whitespace-nowrap shadow-md shadow-cyan-500/20"
          >
            RESTORE MY SCORE →
          </Link>
        </div>

        {/* Live Participation KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block">
                TOTAL REGISTERED
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400 mt-0.5">
                {counts.total_registered}
              </div>
              <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
                All registered engineers
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 backdrop-blur flex items-center justify-between shadow-lg shadow-amber-500/5">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-300 tracking-wider">
                  CURRENTLY PLAYING
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 mt-0.5">
                {counts.total_playing}
              </div>
              <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
                Live in arena gauntlet
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur flex items-center justify-between shadow-lg shadow-emerald-500/5">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-300 tracking-wider block">
                COMPLETED MISSIONS
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-0.5">
                {counts.total_completed}
              </div>
              <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
                Conquered all 6 levels
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
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
                <div className="mt-2 flex items-center justify-center">
                  {top3[1].status === "completed" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> COMPLETED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> LIVE • LVL {top3[1].current_level || 1}
                    </span>
                  )}
                </div>
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
                <div className="mt-2 flex items-center justify-center">
                  {top3[0].status === "completed" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> COMPLETED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> LIVE • LVL {top3[0].current_level || 1}
                    </span>
                  )}
                </div>
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
                <div className="mt-2 flex items-center justify-center">
                  {top3[2].status === "completed" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> COMPLETED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> LIVE • LVL {top3[2].current_level || 1}
                    </span>
                  )}
                </div>
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
                  <th className="py-3 px-3 sm:px-4 w-12 sm:w-16">Rank</th>
                  <th className="py-3 px-3 sm:px-4">Engineer / ID</th>
                  <th className="py-3 px-3 sm:px-4">Status</th>
                  <th className="py-3 px-4 hidden md:table-cell">Department</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Score (XP)</th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell">Accuracy</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      {entries.length === 0
                        ? "No registered engineers yet. Register now to enter MECH-MANIA 2026!"
                        : "No matching engineers found for this query."}
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry, index) => {
                    // Match single current user uniquely by id, reg_no, or participant_id
                    const myMatchIndex = filteredEntries.findIndex(
                      (e) =>
                        (myUserUuid && e.id && e.id === myUserUuid) ||
                        (myRegNo && e.register_number && e.register_number.toUpperCase() === myRegNo.toUpperCase()) ||
                        (myParticipantId && e.participant_id === myParticipantId)
                    );
                    const isMe = index === myMatchIndex;

                    return (
                      <tr
                        key={`${entry.participant_id}-${entry.id || index}`}
                        className={`transition-colors ${
                          isMe
                            ? "bg-amber-500/15 font-bold text-amber-200 border-l-4 border-amber-500"
                            : "hover:bg-slate-800/40 text-slate-200"
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3 px-3 sm:px-4">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                              index === 0
                                ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/30"
                                : index === 1
                                ? "bg-slate-300 text-black shadow-lg shadow-slate-300/20"
                                : index === 2
                                ? "bg-amber-700 text-white shadow-lg shadow-amber-700/30"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            #{index + 1}
                          </span>
                        </td>

                        {/* Name & ID */}
                        <td className="py-3 px-3 sm:px-4 font-sans">
                          <div className="font-bold text-slate-100 flex items-center gap-1.5 flex-wrap">
                            <span>{entry.name}</span>
                            {isMe && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500 text-black text-[9px] font-mono font-black uppercase">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono text-slate-400">
                              {entry.participant_id}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 md:hidden">
                              • {entry.department}
                            </span>
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="py-3 px-3 sm:px-4">
                          {entry.status === "completed" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 whitespace-nowrap">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                              COMPLETED
                            </span>
                          ) : entry.status === "in_progress" || entry.status === "playing" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 animate-pulse whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                              LIVE • LVL {entry.current_level || 1}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-800/80 border border-slate-700 text-slate-400 whitespace-nowrap">
                              STANDBY
                            </span>
                          )}
                        </td>

                        {/* Department */}
                        <td className="py-3 px-4 hidden md:table-cell font-sans text-xs text-slate-300">
                          {entry.department} • {entry.year}
                        </td>

                        {/* XP */}
                        <td className="py-3 px-3 sm:px-4 text-right font-black text-amber-400 text-sm sm:text-base">
                          {entry.score}
                        </td>

                        {/* Accuracy */}
                        <td className="py-3 px-4 text-right hidden sm:table-cell text-emerald-400">
                          {entry.accuracy}%
                        </td>

                        {/* Time */}
                        <td className="py-3 px-3 sm:px-4 text-right text-slate-400">
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
