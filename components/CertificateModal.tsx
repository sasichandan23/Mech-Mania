"use client";

import React, { useRef, useEffect } from "react";
import { EVENT_CONFIG } from "@/config/event";
import { Download, X, Award } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface CertificateModalProps {
  participantName: string;
  participantId: string;
  department: string;
  year: string;
  score: number;
  accuracy: number;
  rank?: number | null;
  onClose: () => void;
}

export default function CertificateModal({
  participantName,
  participantId,
  department,
  year,
  score,
  accuracy,
  rank,
  onClose,
}: CertificateModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas Size: 1200 x 800 (High Resolution Landscape)
    const w = 1200;
    const h = 800;
    canvas.width = w;
    canvas.height = h;

    // 1. Background
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, "#0a0d14");
    bgGrad.addColorStop(0.5, "#101622");
    bgGrad.addColorStop(1, "#07090e");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Outer Decorative Borders
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    // Corner Accents
    const cornerSize = 25;
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(30, 30, cornerSize, 4);
    ctx.fillRect(30, 30, 4, cornerSize);
    ctx.fillRect(w - 30 - cornerSize, 30, cornerSize, 4);
    ctx.fillRect(w - 34, 30, 4, cornerSize);
    ctx.fillRect(30, h - 34, cornerSize, 4);
    ctx.fillRect(30, h - 30 - cornerSize, 4, cornerSize);
    ctx.fillRect(w - 30 - cornerSize, h - 34, cornerSize, 4);
    ctx.fillRect(w - 34, h - 30 - cornerSize, 4, cornerSize);

    // 3. Watermark Gear in Center
    ctx.save();
    ctx.translate(w / 2, h / 2 + 30);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.04)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 180, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 90, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 4. Header & College Info
    ctx.textAlign = "center";
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 16px 'Courier New', monospace";
    ctx.fillText(`${EVENT_CONFIG.COLLEGE_NAME.toUpperCase()} • ${EVENT_CONFIG.CLUB_NAME.toUpperCase()}`, w / 2, 85);

    // Title: MECH-MANIA 2026
    ctx.fillStyle = "#f59e0b";
    ctx.font = "900 48px system-ui, sans-serif";
    ctx.fillText(EVENT_CONFIG.EVENT_NAME, w / 2, 145);

    // Subtitle
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.fillText(EVENT_CONFIG.SUBTITLE.toUpperCase(), w / 2, 175);

    // Certificate Type
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "italic 24px Georgia, serif";
    ctx.fillText("Certificate of Achievement & Participation", w / 2, 230);

    ctx.fillStyle = "#64748b";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("This certificate is officially awarded to", w / 2, 270);

    // Participant Name (Big & Bold)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 38px system-ui, sans-serif";
    ctx.fillText(participantName.toUpperCase(), w / 2, 325);

    // Underline
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 250, 345);
    ctx.lineTo(w / 2 + 250, 345);
    ctx.stroke();

    // Participant Details
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText(
      `Participant ID: ${participantId}  |  Dept: ${department}  |  Year: ${year}`,
      w / 2,
      375
    );

    // Achievement Description
    ctx.fillStyle = "#94a3b8";
    ctx.font = "15px system-ui, sans-serif";
    const desc = `for successfully demonstrating technical excellence, speed, and analytical engineering acumen`;
    ctx.fillText(desc, w / 2, 420);
    ctx.fillText(
      `across 6 challenging mechanical engineering sectors in ${EVENT_CONFIG.EVENT_NAME}.`,
      w / 2,
      445
    );

    // 5. Score & Metrics Box
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.fillRect(w / 2 - 300, 480, 600, 80);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.strokeRect(w / 2 - 300, 480, 600, 80);

    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 22px 'Courier New', monospace";
    ctx.fillText(`SCORE: ${score} XP`, w / 2 - 180, 526);

    ctx.fillStyle = "#38bdf8";
    ctx.fillText(`ACCURACY: ${accuracy}%`, w / 2, 526);

    ctx.fillStyle = "#34d399";
    ctx.fillText(rank ? `RANK: #${rank}` : "STATUS: COMPLETED", w / 2 + 180, 526);

    // 6. Signatures & Date
    // Date
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Date: ${EVENT_CONFIG.EVENT_DATE}`, 120, 680);
    ctx.fillText(`Venue: ${EVENT_CONFIG.COLLEGE_NAME}`, 120, 705);

    // Signature 1: Faculty Coordinator
    ctx.textAlign = "center";
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 60, 685);
    ctx.lineTo(w / 2 + 60, 685);
    ctx.stroke();

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 14px system-ui, sans-serif";
    ctx.fillText("FACULTY ADVISOR", w / 2, 705);
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText(EVENT_CONFIG.CLUB_NAME, w / 2, 725);

    // Signature 2: Club President
    ctx.beginPath();
    ctx.moveTo(w - 240, 685);
    ctx.lineTo(w - 100, 685);
    ctx.stroke();

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 14px system-ui, sans-serif";
    ctx.fillText("STUDENT CONVENOR", w - 170, 705);
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("MECH-MANIA 2026 Core", w - 170, 725);
  }, [participantName, participantId, department, year, score, accuracy, rank]);

  const handleDownload = () => {
    sounds.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `MECH_MANIA_2026_Certificate_${participantId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-mech-border rounded-2xl p-5 sm:p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-mech-border">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-lg text-slate-100">Official E-Certificate</h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Preview */}
        <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-black flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            className="w-full max-w-2xl h-auto rounded-lg shadow-2xl"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-mono text-slate-400">
            Rendered automatically via client graphics pipeline. No organizer action needed.
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-mech-border text-slate-300 text-xs font-bold uppercase hover:bg-slate-800"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
