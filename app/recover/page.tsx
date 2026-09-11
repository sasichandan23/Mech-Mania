"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MechanicalBackground from "@/components/MechanicalBackground";
import { 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ArrowLeft, 
  Smartphone, 
  Trophy, 
  Zap, 
  Copy, 
  Check, 
  ExternalLink 
} from "lucide-react";
import { decodeSessionToken } from "@/lib/session-token";

export default function RecoverPage() {
  const [token, setToken] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any | null>(null);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("mech_mania_session_token");
      if (storedToken) {
        setToken(storedToken);
        const decoded = decodeSessionToken(storedToken);
        if (decoded && decoded.participant) {
          setSessionData(decoded);
          // Auto-sync immediately
          triggerSync(storedToken);
        } else {
          setSyncStatus("idle");
        }
      } else {
        setSyncStatus("idle");
      }
    }
  }, []);

  const triggerSync = async (tok: string) => {
    setSyncStatus("syncing");
    setStatusMessage("Synchronizing your mission results with the database...");
    try {
      const res = await fetch("/api/leaderboard/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tok }),
      });
      const json = await res.json();
      if (json.synced || json.success) {
        setSyncStatus("success");
        setStatusMessage(
          `Success! Your mission score (${json.attempt?.score || 0} XP) has been permanently saved to the leaderboard!`
        );
      } else {
        setSyncStatus("error");
        setStatusMessage(json.error || "Could not sync session with server.");
      }
    } catch (err: any) {
      console.error("Sync error:", err);
      setSyncStatus("error");
      setStatusMessage("Network error during sync. Please try again.");
    }
  };

  const copyUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <MechanicalBackground />

      <div className="relative z-10 max-w-xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-amber-400 mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            BACK TO LEADERBOARD
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight">
            MISSION DATA RECOVERY
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Restore & permanently record your score from your mobile device
          </p>
        </div>

        {/* Case 1: Found local token on this phone/browser */}
        {sessionData ? (
          <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/50 backdrop-blur shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider block">
                    SESSION FOUND ON THIS DEVICE
                  </span>
                  <h2 className="text-lg font-bold text-slate-100">
                    {sessionData.participant?.name || "Verified Engineer"}
                  </h2>
                  <span className="text-xs font-mono text-slate-400">
                    {sessionData.participant?.register_number} • {sessionData.participant?.department}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 font-mono font-bold text-amber-300 text-sm">
                  <Zap className="w-4 h-4 text-amber-400" />
                  {sessionData.attempt?.score ?? 0} XP
                </div>
                <span className="text-[10px] font-mono text-slate-400 block mt-1">
                  Accuracy: {sessionData.attempt?.accuracy ?? 0}%
                </span>
              </div>
            </div>

            {/* Sync State Alert */}
            {syncStatus === "syncing" && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {syncStatus === "success" && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {syncStatus === "error" && (
              <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
                <button
                  onClick={() => token && triggerSync(token)}
                  className="px-3 py-1 rounded-lg bg-rose-500 text-white font-bold text-xs"
                >
                  RETRY
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/leaderboard"
                className="w-full py-3 rounded-xl bg-amber-500 text-black font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
              >
                <Trophy className="w-4 h-4" />
                VIEW STANDINGS ON LEADERBOARD
              </Link>
              <button
                onClick={() => token && triggerSync(token)}
                disabled={syncStatus === "syncing"}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs hover:bg-slate-700 hover:text-white transition-colors whitespace-nowrap"
              >
                RE-SYNC NOW
              </button>
            </div>
          </div>
        ) : (
          /* Case 2: No token on this device */
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-mech-border backdrop-blur shadow-2xl space-y-5">
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto mb-3">
                <Smartphone className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                No Quiz Session Found on THIS Browser
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-1.5 max-w-md mx-auto">
                Each participant&apos;s quiz answers and score are saved securely inside the phone browser they used to play the game.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                HOW TO RECOVER IN 5 SECONDS:
              </span>
              <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside font-sans">
                <li>
                  Copy this recovery link below.
                </li>
                <li>
                  Send it to the <strong>8 students</strong> (e.g. via WhatsApp or group message).
                </li>
                <li>
                  Ask them to <strong>open the link on the phone</strong> they used to play MECH-MANIA.
                </li>
                <li>
                  Their phone will <strong>instantly auto-sync</strong> their score, rank, and answers directly into the permanent database!
                </li>
              </ol>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={copyUrl}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? "LINK COPIED TO CLIPBOARD!" : "COPY RECOVERY LINK"}</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
              >
                Go to Leaderboard
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
