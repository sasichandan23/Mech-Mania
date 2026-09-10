# ⚙️ MECH-MANIA 2026: THINK • PLAY • ENGINEER
### Autonomous Mechanical Engineering Game Quiz for College Events

> **CRITICAL ARCHITECTURE**: Engineered for **ZERO LIVE ADMIN INTERACTION**.
> The organizer/admin does NOT need to add questions, configure sessions, manually calculate scores, manage the leaderboard, or move students between levels. The application autonomously orchestrates the entire competition from start to finish.

---

## 🚀 Event Day Organizer Experience

On event day, the organizer's only role is:
1. Explain the rules to students or project `/event-info` onto the auditorium screen.
2. Ask students to scan the QR code or visit the website.
3. Announce: *"Ready? 3... 2... 1... START!"*
4. **Step away.** The application handles registration, question randomization, per-question timers, server scoring, streaks, lives, power-ups, sector transitions, final boss gauntlet, live realtime leaderboards, and instant certificate downloads automatically.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 App Router
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (Industrial Cyberpunk & Mechanical Theme)
- **Audio Synthesizer**: Web Audio API (Procedural sound effects: zero external asset dependencies, 100% offline-ready with Mute toggle)
- **Database & Realtime**: Supabase PostgreSQL (with automatic local-first fallback engine for zero-friction local development)
- **Graphics**: HTML5 Canvas Client Certificate Renderer (zero external paid certificate APIs)
- **Deployment**: Vercel + GitHub (Free-tier compatible)

---

## 🎮 Game Architecture & Progression

```
LANDING PAGE (/)
      ↓
REGISTRATION (/register) [Auto-generates MM2026-XXXXX]
      ↓
MISSION BRIEFING & RULES
      ↓
3-2-1 ENGINE COUNTDOWN
      ↓
LEVEL 1 — MECH BASICS (5 Questions)
      ↓
LEVEL 2 — WORKSHOP & MANUFACTURING (5 Questions, Lathe/Milling/Welding/Bearings)
      ↓
LEVEL 3 — AUTOMOBILE & IC ENGINES (5 Questions, Cycles/Transmission/Brakes)
      ↓
LEVEL 4 — ENGINEERING CHALLENGE (5 Questions, Thermo/Fluids/Heat Transfer/Mohr's Circle)
      ↓
LEVEL 5 — FUTURE ENGINEERING (5 Questions, Robotics/EV/3D Printing/CAN Bus/Industry 4.0)
      ↓
LEVEL 6 — ⚠️ FINAL BOSS: THE MECHANICAL MASTERMIND (5 Difficult Questions, +300 XP each)
      ↓
GAUNTLET COMPLETE (/result)
      ↓
LIVE REALTIME LEADERBOARD (/leaderboard) & DOWNLOAD CERTIFICATE
```

### Key Gameplay Systems:
- **❤️ 3 Core Lives**: Incorrect answers deduct a life. If all 3 lives are lost, the core enters **Overheat Mode** (50% XP multiplier), ensuring players are never abruptly kicked out and can finish the entire game!
- **⚡ Streaks**: 3x (+50 XP), 5x (+150 XP), and 7x (+300 XP) combo bonuses.
- **⏱️ Timers**: 20-minute global attempt limit + 25s–35s per-question timer with auto-submit on timeout.
- **🎯 4 Tactical Power-Ups**:
  - `50/50`: Eliminates 2 incorrect options.
  - `Chronos`: Freezes the timer for +10 seconds.
  - `2X XP`: Doubles points on the next correct answer.
  - `Heat Shield`: Absorbs 1 incorrect answer without losing a life.
- **🔒 Server-Authoritative Scoring**: Correct answers and explanations are never shipped to the client ahead of time. Answers are validated on `/api/quiz/submit-answer`.
- **🔄 Session Recovery**: Refreshing or losing network connection safely resumes the active question, level, score, lives, and timer. Duplicate attempts per register number are blocked.

---

## ⚙️ Customizing Event Branding (Pre-Deployment)

To customize college name, event date, prizes, or rules, simply edit **`config/event.ts`**:

```typescript
export const EVENT_CONFIG = {
  EVENT_NAME: "MECH-MANIA 2026",
  TAGLINE: "THINK • PLAY • ENGINEER",
  COLLEGE_NAME: "National Institute of Technology",
  CLUB_NAME: "Mechanical Engineering Club",
  EVENT_YEAR: "2026",
  EVENT_DATE: "September 2026",
  ORGANIZER_CONTACT: "mechclub@college.edu",
  // ...
};
```
No database migrations or code rewrites are necessary!

---

## 📦 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/mech-mania.git
   cd mech-mania
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> Even without configuring Supabase environment variables, the game is 100% playable locally using its built-in local database engine!

---

## 🗄️ Supabase PostgreSQL Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard:
   - Copy and run `supabase/migrations/20260101000000_init_mech_mania.sql`.
   - Copy and run `supabase/seed.sql`.
3. In **Project Settings** → **API**, copy:
   - `Project URL`
   - `anon / public` key
   - `service_role` secret
4. Create `.env.local` based on `.env.example`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
   ```

---

## 🚢 Deploying to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"** → Import your repo.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**.
5. Your autonomous event website is now live! Project `/event-info` onto the screen and enjoy the event!

---

## 📜 Certificate Generation

When a student completes the quiz, clicking **"DOWNLOAD CERTIFICATE"** triggers an HTML5 high-resolution canvas renderer. It generates a verified certificate PNG with their:
- Full Name
- Participant ID (`MM2026-XXXXX`)
- Department & Year
- Final XP Score & Accuracy %
- Official Leaderboard Rank
- College Name, Mechanical Club seal, and signatures

No paid PDF or certificate APIs required.

---

## 🛡️ License

MIT License. Designed and engineered for College Mechanical Engineering Clubs.
