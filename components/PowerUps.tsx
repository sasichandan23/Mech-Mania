"use client";

import React from "react";
import { PowerUpInventory, PowerUpType } from "@/types/game";
import { Zap, Shield, Clock, SplitSquareVertical } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface PowerUpsProps {
  inventory: PowerUpInventory;
  disabled: boolean;
  activeShield: boolean;
  activeDoubleXP: boolean;
  onUsePowerUp: (type: PowerUpType) => void;
}

export default function PowerUps({
  inventory,
  disabled,
  activeShield,
  activeDoubleXP,
  onUsePowerUp,
}: PowerUpsProps) {
  const powerUpsConfig = [
    {
      id: "fiftyFifty" as PowerUpType,
      name: "50 / 50",
      description: "Omit 2 incorrect options",
      icon: SplitSquareVertical,
      count: inventory.fiftyFifty,
      isActive: false,
      color: "border-blue-500/40 hover:border-blue-400 bg-blue-950/30 text-blue-300",
    },
    {
      id: "timeFreeze" as PowerUpType,
      name: "CHRONOS",
      description: "+10s time freeze",
      icon: Clock,
      count: inventory.timeFreeze,
      isActive: false,
      color: "border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/30 text-cyan-300",
    },
    {
      id: "doubleXP" as PowerUpType,
      name: "2X XP",
      description: "Double next correct answer",
      icon: Zap,
      count: inventory.doubleXP,
      isActive: activeDoubleXP,
      color: "border-yellow-500/40 hover:border-yellow-400 bg-yellow-950/30 text-yellow-300",
    },
    {
      id: "shield" as PowerUpType,
      name: "HEAT SHIELD",
      description: "Absorbs 1 wrong answer",
      icon: Shield,
      count: inventory.shield,
      isActive: activeShield,
      color: "border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/30 text-emerald-300",
    },
  ];

  return (
    <div className="w-full bg-slate-900/90 border border-mech-border rounded-xl p-3 sm:p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <span>🛠️</span> POWER-UP ARSENAL
        </span>
        <span className="text-[10px] font-mono text-slate-500">
          SINGLE USE PER MISSION
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {powerUpsConfig.map((p) => {
          const Icon = p.icon;
          const isUsable = !disabled && p.count > 0 && !p.isActive;

          return (
            <button
              key={p.id}
              disabled={!isUsable}
              onClick={() => {
                if (isUsable) {
                  sounds.playPowerUp();
                  onUsePowerUp(p.id);
                }
              }}
              className={`p-2.5 rounded-lg border text-left transition-all duration-200 relative group active:scale-95 ${
                p.isActive
                  ? "border-amber-400 bg-amber-500/20 text-amber-300 ring-1 ring-amber-400 animate-pulse"
                  : isUsable
                  ? `${p.color} hover:scale-[1.02]`
                  : "opacity-40 border-slate-800 bg-slate-950 text-slate-600 cursor-not-allowed"
              }`}
            >
              {/* Badge for remaining count */}
              <div className="flex items-center justify-between mb-1">
                <Icon className={`w-4 h-4 ${p.isActive ? "text-amber-300" : ""}`} />
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-950 border border-slate-800">
                  {p.isActive ? "ACTIVE" : `x${p.count}`}
                </span>
              </div>

              <div className="text-xs font-bold font-mono tracking-wider">{p.name}</div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {p.isActive ? "ENGAGED" : p.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
