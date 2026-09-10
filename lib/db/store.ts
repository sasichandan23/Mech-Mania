import { 
  Participant, 
  Attempt, 
  AnswerRecord, 
  LeaderboardEntry,
  Question,
  PowerUpInventory
} from "@/types/game";
import { QUESTION_BANK } from "@/data/questions";
import { isSupabaseConfigured, supabaseServer } from "./supabase";
import fs from "fs";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";

// Local state fallback storage using writable tmp directory in serverless environments
interface LocalDbState {
  participants: Record<string, Participant>;
  attempts: Record<string, Attempt>;
  answers: AnswerRecord[];
  power_up_usage: Array<{ id: string; attempt_id: string; power_up_type: string; used_at: string }>;
  counter: number;
}

// In serverless (Vercel / AWS Lambda), os.tmpdir() is the only guaranteed writable directory
const LOCAL_DB_FILE = path.join(os.tmpdir(), "mech_mania_local_db.json");

function loadLocalState(): LocalDbState {
  try {
    if (fs.existsSync(LOCAL_DB_FILE)) {
      const data = fs.readFileSync(LOCAL_DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("Could not read local DB file from tmp, using memory store:", e);
  }
  return {
    participants: {},
    attempts: {},
    answers: [],
    power_up_usage: [],
    counter: 1,
  };
}

function saveLocalState(state: LocalDbState) {
  try {
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (e) {
    // Non-fatal warning if serverless filesystem is restricted
    console.warn("Could not write to local DB file in tmp:", e);
  }
}

// In-memory singleton cache per worker
let localStateCache: LocalDbState | null = null;
function getLocalState(): LocalDbState {
  if (!localStateCache) {
    localStateCache = loadLocalState();
  }
  return localStateCache;
}

export class GameStore {
  // Hydrate state from a verified session token (vital for serverless lambda instances)
  static hydrateFromSession(participant: Participant, attempt: Attempt) {
    const state = getLocalState();
    state.participants[participant.id] = participant;
    state.attempts[attempt.id] = attempt;
    saveLocalState(state);
  }

  // 1. Participant Management
  static async findParticipantByRegisterNumber(regNo: string): Promise<Participant | null> {
    const normalized = regNo.trim().toUpperCase();

    if (isSupabaseConfigured && supabaseServer) {
      try {
        const { data, error } = await supabaseServer
          .from("participants")
          .select("*")
          .eq("register_number", normalized)
          .maybeSingle();
        if (!error && data) return data;
      } catch (e) {
        console.error("Supabase findParticipant error:", e);
      }
    }

    const state = getLocalState();
    return Object.values(state.participants).find(
      (p) => p.register_number.toUpperCase() === normalized
    ) || null;
  }

  static async findParticipantByEmail(email: string): Promise<Participant | null> {
    const normalized = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabaseServer) {
      try {
        const { data, error } = await supabaseServer
          .from("participants")
          .select("*")
          .eq("email", normalized)
          .maybeSingle();
        if (!error && data) return data;
      } catch (e) {
        console.error("Supabase findByEmail error:", e);
      }
    }

    const state = getLocalState();
    return Object.values(state.participants).find(
      (p) => p.email.toLowerCase() === normalized
    ) || null;
  }

  static async getParticipantById(id: string): Promise<Participant | null> {
    if (isSupabaseConfigured && supabaseServer) {
      try {
        const { data, error } = await supabaseServer
          .from("participants")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        if (!error && data) return data;
      } catch (e) {
        console.error("Supabase getParticipantById error:", e);
      }
    }

    const state = getLocalState();
    return state.participants[id] || null;
  }

  static async createParticipant(data: {
    name: string;
    register_number: string;
    department: string;
    year: string;
    email: string;
  }): Promise<Participant> {
    const state = getLocalState();
    const nextNumber = state.counter;
    state.counter += 1;
    const participant_id = `MM2026-${String(nextNumber).padStart(5, "0")}`;
    const id = randomUUID();
    const created_at = new Date().toISOString();

    const participant: Participant = {
      id,
      participant_id,
      name: data.name.trim(),
      register_number: data.register_number.trim().toUpperCase(),
      department: data.department.trim(),
      year: data.year.trim(),
      email: data.email.trim().toLowerCase(),
      created_at,
    };

    if (isSupabaseConfigured && supabaseServer) {
      try {
        const { data: inserted, error } = await supabaseServer
          .from("participants")
          .insert([participant])
          .select()
          .single();
        if (!error && inserted) {
          state.participants[inserted.id] = inserted;
          return inserted;
        }
        console.error("Supabase insert participant error:", error);
      } catch (e) {
        console.error("Supabase participant insert exception:", e);
      }
    }

    state.participants[participant.id] = participant;
    saveLocalState(state);
    return participant;
  }

  // 2. Attempt Management
  static async getAttemptById(attemptId: string): Promise<Attempt | null> {
    if (isSupabaseConfigured && supabaseServer) {
      try {
        const { data, error } = await supabaseServer
          .from("attempts")
          .select("*")
          .eq("id", attemptId)
          .maybeSingle();
        if (!error && data) return data;
      } catch (e) {
        console.error("Supabase getAttemptById error:", e);
      }
    }

    const state = getLocalState();
    return state.attempts[attemptId] || null;
  }

  static async getAttemptByParticipantId(participantId: string): Promise<Attempt | null> {
    if (isSupabaseConfigured && supabaseServer) {
      try {
        const { data, error } = await supabaseServer
          .from("attempts")
          .select("*")
          .eq("participant_id", participantId)
          .maybeSingle();
        if (!error && data) return data;
      } catch (e) {
        console.error("Supabase getAttemptByParticipantId error:", e);
      }
    }

    const state = getLocalState();
    return Object.values(state.attempts).find(
      (a) => a.participant_id === participantId
    ) || null;
  }

  static async createAttempt(data: {
    participant_id: string;
    question_ids: string[];
    initial_power_ups: PowerUpInventory;
  }): Promise<Attempt> {
    const id = randomUUID();
    const started_at = new Date().toISOString();

    const attempt: Attempt = {
      id,
      participant_id: data.participant_id,
      status: "in_progress",
      score: 0,
      accuracy: 0,
      total_time: 0,
      best_streak: 0,
      current_streak: 0,
      current_level: 1,
      current_question_index: 0,
      question_ids: data.question_ids,
      remaining_lives: 3,
      power_ups: data.initial_power_ups,
      active_shield: false,
      active_double_xp: false,
      started_at,
    };

    if (isSupabaseConfigured && supabaseServer) {
      try {
        const { data: inserted, error } = await supabaseServer
          .from("attempts")
          .insert([attempt])
          .select()
          .single();
        if (!error && inserted) {
          const state = getLocalState();
          state.attempts[inserted.id] = inserted;
          return inserted;
        }
        console.error("Supabase insert attempt error:", error);
      } catch (e) {
        console.error("Supabase attempt insert exception:", e);
      }
    }

    const state = getLocalState();
    state.attempts[attempt.id] = attempt;
    saveLocalState(state);
    return attempt;
  }

  static async updateAttempt(attemptId: string, updates: Partial<Attempt>): Promise<Attempt | null> {
    if (isSupabaseConfigured && supabaseServer) {
      try {
        const { data, error } = await supabaseServer
          .from("attempts")
          .update(updates)
          .eq("id", attemptId)
          .select()
          .single();
        if (!error && data) {
          const state = getLocalState();
          state.attempts[attemptId] = data;
          return data;
        }
      } catch (e) {
        console.error("Supabase updateAttempt error:", e);
      }
    }

    const state = getLocalState();
    const existing = state.attempts[attemptId] || ({} as Partial<Attempt>);
    state.attempts[attemptId] = {
      ...existing,
      ...updates,
    } as Attempt;
    saveLocalState(state);
    return state.attempts[attemptId];
  }

  // 3. Answers & Audit
  static async recordAnswer(answer: Omit<AnswerRecord, "id">): Promise<void> {
    const id = randomUUID();
    const fullAnswer: AnswerRecord = { id, ...answer };

    if (isSupabaseConfigured && supabaseServer) {
      try {
        await supabaseServer.from("answers").insert([fullAnswer]);
      } catch (e) {
        console.error("Supabase recordAnswer error:", e);
      }
    }

    const state = getLocalState();
    state.answers.push(fullAnswer);
    saveLocalState(state);
  }

  static async recordPowerUpUsage(attemptId: string, powerUp: string): Promise<void> {
    const record = {
      id: randomUUID(),
      attempt_id: attemptId,
      power_up_type: powerUp,
      used_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabaseServer) {
      try {
        await supabaseServer.from("power_up_usage").insert([record]);
      } catch (e) {
        console.error("Supabase recordPowerUp error:", e);
      }
    }

    const state = getLocalState();
    state.power_up_usage.push(record);
    saveLocalState(state);
  }

  // 4. Leaderboard Calculation
  static async getLeaderboard(): Promise<LeaderboardEntry[]> {
    if (isSupabaseConfigured && supabaseServer) {
      try {
        const { data, error } = await supabaseServer
          .from("leaderboard_view")
          .select("*")
          .limit(100);
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (e) {
        console.error("Supabase leaderboard query error:", e);
      }
    }

    // Fallback calculation from local state
    const state = getLocalState();
    const completedAttempts = Object.values(state.attempts).filter(
      (a) => a && a.status === "completed"
    );

    // Sort by Score DESC, Accuracy DESC, Total Time ASC
    completedAttempts.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return a.total_time - b.total_time;
    });

    return completedAttempts.map((att, index) => {
      const p = (att.participant_id && state.participants[att.participant_id]) || {
        participant_id: "MM2026-????",
        name: "Anonymous Engineer",
        department: "Mechanical",
        year: "3rd",
      };
      return {
        rank: index + 1,
        participant_id: p.participant_id,
        name: p.name,
        department: p.department,
        year: p.year,
        score: att.score,
        accuracy: att.accuracy,
        total_time: att.total_time,
        completed_at: att.completed_at || att.started_at,
      };
    });
  }

  // 5. Question Lookup (Immutable server-side source)
  static getQuestionById(questionId: string): Question | null {
    return QUESTION_BANK.find((q) => q.id === questionId) || null;
  }
}
