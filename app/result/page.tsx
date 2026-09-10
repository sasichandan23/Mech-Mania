"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import MechanicalBackground from "@/components/MechanicalBackground";
import CertificateModal from "@/components/CertificateModal";
import { EVENT_CONFIG } from "@/config/event";
import { sounds } from "@/lib/sounds";
import { 
  Trophy, 
  Award, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Flame, 
  Zap, 
  ArrowRight,
  Share2
} from "lucide-react";

export default function ResultPage() {
  const router = useRouter();
  const [participant, setParticipant] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [leaderboardRank, setLeaderboardRank] = useState<number | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    const attemptId = localStorage.getItem("mech_mania_attempt_id");
    if (!attemptId) {
      router.push("/");
      return;
    }

    // Fire Victory Confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#06b6d4", "#ef4444", "#ffffff"],
      });
    } catch (e) {
      console.warn("Confetti error:", e);
    }

    sounds.playLevelUp();

    // Fetch session details & leaderboard rank
    async function fetchResultData() {
      try {
        const sessionToken = typeof window !== "undefined" ? localStorage.getItem("mech_mania_session_token") || "" : "";
        const sessionRes = await fetch(`/api/quiz/session?attempt_id=${attemptId}`, {
          headers: {
            "x-session-token": sessionToken,
          },
        });
        const sessionData = await sessionRes.json();

        if (sessionData.participant && sessionData.attempt) {
          setParticipant(sessionData.participant);
          setAttempt(sessionData.attempt);

          // Fetch leaderboard to calculate official rank
          const lbRes = await fetch("/api/leaderboard");
          const lbData = await lbRes.json();
          if (lbData.leaderboard) {
            const entryIndex = lbData.leaderboard.findIndex(
              (item: any) => item.participant_id === sessionData.participant.participant_id
            );
            if (entryIndex !== -1) {
              setLeaderboardRank(entryIndex + 1);
            }
          }
        }
      } catch (err) {
        console.error("Result fetch error:", err);
      }
    }

    fetchResultData();
  }, [router]);

  const handleShare = () => {
    sounds.playClick();
    if (typeof window !== "undefined" && navigator.clipboard) {
      const shareText = `⚙️ I just completed ${EVENT_CONFIG.EVENT_NAME} with ${attempt?.score || 0} XP! Can you beat my score in this autonomous mechanical engineering gauntlet? ${window.location.origin}`;
      navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const totalTimeFormatted = () => {
    if (!attempt?.total_time) return "00:00";
    const mins = Math.floor(attempt.total_time / 60);
    const secs = Math.floor(attempt.total_time % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-8">
      <MechanicalBackground />

      {/* Certificate Modal */}
      {showCertificate && participant && attempt && (
        <CertificateModal
          participantName={participant.name}
          participantId={participant.participant_id}
          department={participant.department}
          year={participant.year}
          score={attempt.score}
          accuracy={attempt.accuracy}
          rank={leaderboardRank}
          onClose={() => setShowCertificate(false)}
        />
      )}

      <div className="relative z-10 w-full max-w-2xl bg-slate-900/95 border border-mech-border rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center">
        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase font-bold tracking-wider mb-3">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          MISSION STATUS: OBJECTIVE ACHIEVED
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight uppercase mb-1">
          GAUNTLET COMPLETE
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono mb-6">
          {EVENT_CONFIG.EVENT_NAME} • {EVENT_CONFIG.CLUB_NAME}
        </p>

        {/* Participant Identity Card */}
        {participant && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <div className="text-xs font-mono text-slate-500 uppercase">ENGINEER IDENTIFICATION</div>
              <div className="text-lg font-bold text-slate-100">{participant.name}</div>
              <div className="text-xs text-slate-400 font-mono">
                {participant.department} • {participant.year}
              </div>
            </div>
            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">PARTICIPANT ID</span>
              <span className="text-sm font-mono font-bold text-amber-400">
                {participant.participant_id}
              </span>
            </div>
          </div>
        )}

        {/* Primary XP & Rank Score Banner */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-center">
            <span className="text-xs font-mono text-amber-300 font-bold uppercase block mb-1">
              TOTAL XP SCORE
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400 flex items-center justify-center gap-1.5">
              <Zap className="w-7 h-7 text-amber-400" />
              <span>{attempt?.score ?? 0}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/40 text-center">
            <span className="text-xs font-mono text-cyan-300 font-bold uppercase block mb-1">
              OFFICIAL RANK
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-cyan-400 flex items-center justify-center gap-1.5">
              <Trophy className="w-7 h-7 text-cyan-400" />
              <span>{leaderboardRank ? `#${leaderboardRank}` : "CALCULATING"}</span>
            </div>
          </div>
        </div>

        {/* Secondary Metrics: Accuracy, Best Streak, Time */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">ACCURACY</span>
            <span className="text-base sm:text-lg font-mono font-bold text-emerald-400">
              {attempt?.accuracy ?? 0}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">BEST STREAK</span>
            <span className="text-base sm:text-lg font-mono font-bold text-orange-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-orange-400" />
              x{attempt?.best_streak ?? 0}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">TOTAL TIME</span>
            <span className="text-base sm:text-lg font-mono font-bold text-purple-400 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-purple-400" />
              {totalTimeFormatted()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                setShowCertificate(true);
              }}
              className="flex-1 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>DOWNLOAD CERTIFICATE</span>
            </button>

            <Link
              href="/leaderboard"
              onClick={() => sounds.playClick()}
              className="flex-1 py-3.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-100 border border-mech-border active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>VIEW LEADERBOARD</span>
            </Link>
          </div>

          <button
            onClick={handleShare}
            className="w-full py-2.5 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isCopied ? "Score Copied to Clipboard!" : "Share Mission Debrief"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
