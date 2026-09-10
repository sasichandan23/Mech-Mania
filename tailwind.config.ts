import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mech: {
          dark: "#0a0c10",
          card: "#121721",
          border: "#1e293b",
          amber: "#f59e0b",
          amberLight: "#fbbf24",
          cyan: "#06b6d4",
          cyanLight: "#22d3ee",
          hazard: "#eab308",
          red: "#ef4444",
          green: "#10b981",
          slate: "#334155",
          muted: "#94a3b8",
        },
      },
      animation: {
        "gear-rotate": "spin 20s linear infinite",
        "gear-rotate-reverse": "spin 25s linear infinite reverse",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "radar-sweep": "radarSweep 4s linear infinite",
        "glitch": "glitch 1s linear infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 15px rgba(245, 158, 11, 0.6))" },
          "50%": { opacity: "0.7", filter: "drop-shadow(0 0 5px rgba(245, 158, 11, 0.2))" },
        },
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
