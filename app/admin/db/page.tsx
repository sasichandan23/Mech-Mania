"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MechanicalBackground from "@/components/MechanicalBackground";
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  ArrowLeft, 
  ShieldAlert, 
  Key, 
  Server, 
  Users, 
  Award,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";

interface DbDiagnosticData {
  status: "healthy" | "warning" | "error";
  supabase_configured: boolean;
  supabase_connected: boolean;
  environment_variables: {
    NEXT_PUBLIC_SUPABASE_URL: boolean;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: boolean;
    SUPABASE_SERVICE_ROLE_KEY: boolean;
    isSupabaseConfigured: boolean;
  };
  database_counts: {
    participants: number;
    attempts: number;
    leaderboard_entries: number;
  };
  error_details: string | null;
  setup_help: string;
}

export default function AdminDbPage() {
  const [data, setData] = useState<DbDiagnosticData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedSql, setCopiedSql] = useState(false);

  const fetchDiagnostic = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/db-diagnostic", { cache: "no-store" });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Diagnostic error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostic();
  }, []);

  const copySqlLocation = () => {
    navigator.clipboard.writeText("supabase/SETUP_LEADERBOARD_DATABASE.sql");
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <MechanicalBackground />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-mech-border/80 pb-6">
          <div>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-amber-400 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              BACK TO LEADERBOARD
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight">
                DATABASE DIAGNOSTICS
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-400">
                SYSTEM AUDIT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Verify permanent persistence across Vercel serverless cold starts
            </p>
          </div>

          <button
            onClick={fetchDiagnostic}
            disabled={isLoading}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 border border-mech-border text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>TEST CONNECTION</span>
          </button>
        </div>

        {/* Status Card */}
        {data && (
          <div
            className={`p-6 rounded-2xl border ${
              data.supabase_connected
                ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-300"
                : "bg-amber-950/40 border-amber-500/60 text-amber-300"
            } shadow-2xl backdrop-blur`}
          >
            <div className="flex items-center gap-3">
              {data.supabase_connected ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
              )}
              <div>
                <h2 className="text-lg font-black tracking-tight text-white uppercase">
                  {data.supabase_connected
                    ? "PERMANENT DATABASE OPERATIONAL"
                    : "RUNNING IN EPHEMERAL LOCAL MODE"}
                </h2>
                <p className="text-xs text-slate-300 mt-1 font-mono">
                  {data.supabase_connected
                    ? "Supabase PostgreSQL is connected. All participant scores, attempts, and times are permanently saved across server restarts and days!"
                    : "Scores are currently saved in temporary container memory. When Vercel serverless instances sleep overnight, temporary memory is reset. Follow the 2-minute setup below to make scores permanent forever!"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Database Record Counts */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                Registered Participants
              </span>
              <div className="text-2xl font-black text-slate-100 mt-1">
                {data.database_counts.participants}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <Award className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                Game Attempts Logged
              </span>
              <div className="text-2xl font-black text-slate-100 mt-1">
                {data.database_counts.attempts}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <Database className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                Leaderboard Standings
              </span>
              <div className="text-2xl font-black text-slate-100 mt-1">
                {data.database_counts.leaderboard_entries}
              </div>
            </div>
          </div>
        )}

        {/* Environment Variables Audit */}
        {data && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-mech-border space-y-3 font-mono text-xs">
            <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Vercel Environment Variables Status</span>
            </h3>

            <div className="grid grid-cols-1 gap-2 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300 font-bold">NEXT_PUBLIC_SUPABASE_URL</span>
                {data.environment_variables.NEXT_PUBLIC_SUPABASE_URL ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> CONFIGURED
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-1 font-bold">
                    <XCircle className="w-4 h-4" /> MISSING
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300 font-bold">SUPABASE_SERVICE_ROLE_KEY</span>
                {data.environment_variables.SUPABASE_SERVICE_ROLE_KEY ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> CONFIGURED
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-1 font-bold">
                    <XCircle className="w-4 h-4" /> MISSING
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300 font-bold">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                {data.environment_variables.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> CONFIGURED
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1 font-bold">
                    <AlertTriangle className="w-4 h-4" /> OPTIONAL
                  </span>
                )}
              </div>
            </div>

            {data.error_details && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs mt-3">
                <span className="font-bold block text-red-300 mb-1">Database Error Details:</span>
                <code>{data.error_details}</code>
              </div>
            )}
          </div>
        )}

        {/* Student Mobile Recovery Tool Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-slate-900/90 border border-amber-500/40 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider block">
                STUDENT AUTO-RECOVERY PORTAL
              </span>
              <h3 className="text-base font-black text-slate-100 uppercase">
                Recover Any Student&apos;s Score From Their Phone
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Each student&apos;s phone has their signed score stored in their browser. Have them open this link to auto-upload to the leaderboard:
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={copySqlLocation}
                className="px-3.5 py-2 rounded-xl bg-amber-500 text-black font-mono font-bold text-xs hover:bg-amber-400 flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>COPY /RECOVER LINK</span>
              </button>
              <Link
                href="/recover"
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 font-mono text-xs hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>OPEN RECOVERY</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Add / Restore Missing Participant Form */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-mech-border space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-100 uppercase flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>Directly Restore / Add Participant</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Manually record any student&apos;s score immediately into the leaderboard & database
              </p>
            </div>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = new FormData(form);
              const payload = {
                name: formData.get("name"),
                register_number: formData.get("register_number"),
                department: formData.get("department"),
                year: formData.get("year"),
                score: Number(formData.get("score")),
                accuracy: Number(formData.get("accuracy")),
                total_time: Number(formData.get("total_time")),
                status: "completed",
              };

              try {
                const res = await fetch("/api/admin/manual-participant", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });
                const resJson = await res.json();
                if (resJson.success) {
                  alert(`✅ ${resJson.message}`);
                  form.reset();
                  fetchDiagnostic();
                } else {
                  alert(`❌ ${resJson.error}`);
                }
              } catch (err: any) {
                alert("Network error: " + err.message);
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono"
          >
            <div>
              <label className="text-slate-400 block mb-1">Student Full Name *</label>
              <input
                name="name"
                required
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Register Number *</label>
              <input
                name="register_number"
                required
                placeholder="e.g. 2411ME01004"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Department</label>
              <input
                name="department"
                defaultValue="Mechanical"
                placeholder="Mechanical / CSE / Automobile"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Score (XP) *</label>
              <input
                name="score"
                type="number"
                required
                placeholder="e.g. 320"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Accuracy (%)</label>
              <input
                name="accuracy"
                type="number"
                step="0.1"
                defaultValue="80"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Total Time (Seconds)</label>
              <input
                name="total_time"
                type="number"
                defaultValue="180"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-3 pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-black font-black font-mono text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
              >
                + SAVE & RECORD ON LEADERBOARD NOW
              </button>
            </div>
          </form>
        </div>

        {/* 2-Minute Permanent Setup Guide */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-mech-border space-y-4">
          <h3 className="text-base font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-amber-400" />
            <span>2-Minute Permanent Setup (Why scores reset overnight & How to fix it)</span>
          </h3>

          <div className="space-y-3 text-xs text-slate-300">
            <p>
              <strong className="text-amber-400">Why did yesterday&apos;s scores vanish?</strong>{" "}
              Vercel runs on serverless functions. When no one visits the site for a few hours, Vercel recycles the container and wipes the temporary disk. A cloud database (Supabase) is required so scores are never wiped.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 font-mono block">
                  STEP 1: Run SQL Setup in Supabase
                </span>
                <p className="text-slate-400">
                  Open your project at{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 underline inline-flex items-center gap-1"
                  >
                    supabase.com <ExternalLink className="w-3 h-3" />
                  </a>
                  {" "}→ Click <strong>SQL Editor</strong> → Open or paste the contents of:
                </p>
                <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-700 font-mono text-[11px] text-amber-300">
                  <span className="flex-1">supabase/SETUP_LEADERBOARD_DATABASE.sql</span>
                  <button
                    onClick={copySqlLocation}
                    className="px-2 py-1 rounded bg-amber-500 text-black font-bold flex items-center gap-1 hover:bg-amber-400"
                  >
                    {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSql ? "Copied" : "Copy Path"}</span>
                  </button>
                </div>
                <p className="text-slate-400">Click <strong>RUN</strong>. This creates all tables and permissions.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 font-mono block">
                  STEP 2: Add Keys in Vercel
                </span>
                <p className="text-slate-400">
                  In Supabase, go to <strong>Project Settings → API</strong>. Copy the URL and Service Role Key.
                  In Vercel, go to your <strong>Project → Settings → Environment Variables</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1 font-mono text-slate-300 text-[11px]">
                  <li><code className="text-amber-400">NEXT_PUBLIC_SUPABASE_URL</code> = https://xyz.supabase.co</li>
                  <li><code className="text-amber-400">SUPABASE_SERVICE_ROLE_KEY</code> = eyJhbGciOi... (service_role secret)</li>
                  <li><code className="text-amber-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> = eyJhbGciOi... (anon public)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 font-mono block">
                  STEP 3: Redeploy on Vercel
                </span>
                <p className="text-slate-400">
                  In Vercel, go to <strong>Deployments</strong> → Click the 3 dots on the latest deployment → <strong>Redeploy</strong>.
                  Then visit this page and click <strong>TEST CONNECTION</strong> above. You will see a green checkmark!
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
              <span className="font-bold font-mono text-emerald-400 block mb-1">
                🔄 Automatic Self-Healing for Yesterday&apos;s 2 Mobile Phones:
              </span>
              <p className="text-[11px] text-slate-300">
                We have built automatic client-side self-healing! The two mobile phones you used yesterday still have their signed game sessions stored in their phone storage. The moment you open the website on those two mobile phones, their completed scores will automatically re-upload and persist into the database!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
