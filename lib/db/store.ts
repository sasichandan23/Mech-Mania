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
  static async hydrateFromSession(participant: Participant, attempt: Attempt) {
    const state = getLocalState();
    state.participants[participant.id] = participant;
    state.attempts[attempt.id] = attempt;
    saveLocalState(state);

    // Persist records immediately into Supabase
    if (isSupabaseConfigured && supabaseServer) {
      try {
        await supabaseServer
          .from("participants")
          .upsert([participant], { onConflict: "id" });
        await supabaseServer
          .from("attempts")
          .upsert([attempt], { onConflict: "id" });
      } catch (e) {
        console.error("Supabase sync from session error:", e);
      }
    }
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
          .upsert([participant], { onConflict: "id" })
          .select()
          .single();
        if (!error && inserted) {
          state.participants[inserted.id] = inserted;
          saveLocalState(state);
          return inserted;
        }
        if (error) {
          console.error("Supabase insert participant error:", error);
          // Try to recover existing if conflict on register_number
          const { data: existing } = await supabaseServer
            .from("participants")
            .select("*")
            .eq("register_number", participant.register_number)
            .maybeSingle();
          if (existing) {
            state.participants[existing.id] = existing;
            saveLocalState(state);
            return existing;
          }
        }
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
          .upsert([attempt], { onConflict: "id" })
          .select()
          .single();
        if (!error && inserted) {
          const state = getLocalState();
          state.attempts[inserted.id] = inserted;
          saveLocalState(state);
          return inserted;
        }
        if (error) {
          console.error("Supabase insert attempt error:", error);
          // If conflict on participant_id unique constraint, retrieve existing attempt
          const { data: existing } = await supabaseServer
            .from("attempts")
            .select("*")
            .eq("participant_id", data.participant_id)
            .maybeSingle();
          if (existing) {
            const state = getLocalState();
            state.attempts[existing.id] = existing;
            saveLocalState(state);
            return existing;
          }
        }
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
        // Strip undefined keys so Supabase / PostgREST doesn't choke
        const cleanPayload: Record<string, any> = { id: attemptId };
        for (const [key, val] of Object.entries(updates)) {
          if (val !== undefined) {
            cleanPayload[key] = val;
          }
        }

        // 1. Try direct update first
        const { data: updated, error: updateErr } = await supabaseServer
          .from("attempts")
          .update(cleanPayload)
          .eq("id", attemptId)
          .select()
          .maybeSingle();

        if (!updateErr && updated) {
          const state = getLocalState();
          state.attempts[attemptId] = {
            ...(state.attempts[attemptId] || {}),
            ...updated,
          };
          saveLocalState(state);
          return state.attempts[attemptId];
        }

        // 2. If update didn't match rows, try upsert
        const { data: upserted, error: upsertErr } = await supabaseServer
          .from("attempts")
          .upsert(cleanPayload, { onConflict: "id" })
          .select()
          .maybeSingle();

        if (!upsertErr && upserted) {
          const state = getLocalState();
          state.attempts[attemptId] = {
            ...(state.attempts[attemptId] || {}),
            ...upserted,
          };
          saveLocalState(state);
          return state.attempts[attemptId];
        }

        if (updateErr || upsertErr) {
          console.error("Supabase updateAttempt error:", updateErr || upsertErr);
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

  // 4. Leaderboard Calculation (Comprehensive: includes 100% of participants and attempts)
  static async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const localState = getLocalState();

    // Dictionaries for participants and attempts
    const participantsMap: Map<string, Participant> = new Map();
    const attemptsMap: Map<string, Attempt> = new Map();

    // 1. Seed with local state
    if (localState.participants) {
      for (const p of Object.values(localState.participants)) {
        if (p) {
          if (p.id) participantsMap.set(p.id, p);
          if (p.participant_id) participantsMap.set(p.participant_id, p);
          if (p.register_number) participantsMap.set(p.register_number.toUpperCase(), p);
        }
      }
    }
    if (localState.attempts) {
      for (const a of Object.values(localState.attempts)) {
        if (a) {
          if (a.id) attemptsMap.set(a.id, a);
          if (a.participant_id) attemptsMap.set(a.participant_id, a);
        }
      }
    }

    // 2. Fetch from Supabase (if connected)
    if (isSupabaseConfigured && supabaseServer) {
      try {
        const [pRes, aRes] = await Promise.all([
          supabaseServer
            .from("participants")
            .select("*")
            .order("created_at", { ascending: false }),
          supabaseServer
            .from("attempts")
            .select("*")
            .order("score", { ascending: false }),
        ]);

        if (!pRes.error && pRes.data) {
          for (const p of pRes.data) {
            if (p) {
              if (p.id) participantsMap.set(p.id, p);
              if (p.participant_id) participantsMap.set(p.participant_id, p);
              if (p.register_number) participantsMap.set(p.register_number.toUpperCase(), p);
            }
          }
        }

        if (!aRes.error && aRes.data) {
          for (const a of aRes.data) {
            if (a) {
              // If attempt already exists, keep the one with higher score or completed status
              const existing =
                (a.id && attemptsMap.get(a.id)) ||
                (a.participant_id && attemptsMap.get(a.participant_id));

              if (
                !existing ||
                Number(a.score || 0) > Number(existing.score || 0) ||
                (a.status === "completed" && existing.status !== "completed")
              ) {
                if (a.id) attemptsMap.set(a.id, a);
                if (a.participant_id) attemptsMap.set(a.participant_id, a);
              }
            }
          }
        }
      } catch (e) {
        console.error("Supabase getLeaderboard fetch exception:", e);
      }
    }

    // 3. Deduplicate unique participants
    const uniqueParticipants = new Map<string, Participant>();
    participantsMap.forEach((p) => {
      if (p.participant_id) {
        uniqueParticipants.set(p.participant_id, p);
      }
    });

    // 4. Build leaderboard entry for every participant
    const entries: LeaderboardEntry[] = [];
    const processedParticipantKeys = new Set<string>();

    uniqueParticipants.forEach((p, pId) => {
      processedParticipantKeys.add(pId);
      if (p.id) processedParticipantKeys.add(p.id);

      // Match attempt by participant UUID or participant_id code
      const att = attemptsMap.get(p.id) || attemptsMap.get(p.participant_id);

      const score = att ? Number(att.score) || 0 : 0;
      const accuracy = att ? Number(att.accuracy) || 0 : 0;
      const total_time = att ? Number(att.total_time) || 0 : 0;
      const status = att ? att.status || "in_progress" : "registered";
      const current_level = att ? Number(att.current_level) || 1 : 1;
      const current_question_index = att ? Number(att.current_question_index) || 0 : 0;
      const completed_at =
        att?.completed_at ||
        att?.started_at ||
        p.created_at ||
        new Date().toISOString();

      entries.push({
        rank: 0,
        participant_id: p.participant_id,
        name: p.name || "Anonymous Engineer",
        department: p.department || "Mechanical",
        year: p.year || "3rd",
        score,
        accuracy,
        total_time,
        completed_at,
        status,
        current_level,
        current_question_index,
      });
    });

    // 5. Also include any orphan attempts where participant record was missing
    attemptsMap.forEach((att) => {
      if (att && att.participant_id && !processedParticipantKeys.has(att.participant_id)) {
        processedParticipantKeys.add(att.participant_id);
        const isOfficialId = att.participant_id.startsWith("MM2026-");
        entries.push({
          rank: 0,
          participant_id: isOfficialId ? att.participant_id : "MM2026-????",
          name: "Anonymous Engineer",
          department: "Mechanical",
          year: "3rd",
          score: Number(att.score) || 0,
          accuracy: Number(att.accuracy) || 0,
          total_time: Number(att.total_time) || 0,
          completed_at: att.completed_at || att.started_at || new Date().toISOString(),
          status: att.status || "in_progress",
          current_level: Number(att.current_level) || 1,
          current_question_index: Number(att.current_question_index) || 0,
        });
      }
    });

    // 6. Sort all entries:
    // - Score DESC
    // - Completed status before in_progress if tied
    // - Accuracy DESC
    // - Total time ASC (if > 0)
    // - Completed/Created timestamp ASC
    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aComp = a.status === "completed" ? 1 : 0;
      const bComp = b.status === "completed" ? 1 : 0;
      if (bComp !== aComp) return bComp - aComp;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      if (a.total_time > 0 && b.total_time > 0 && a.total_time !== b.total_time) {
        return a.total_time - b.total_time;
      }
      return new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime();
    });

    // 7. Assign 1-indexed Ranks
    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }

  // 5. Question Lookup (Immutable server-side source)
  static getQuestionById(questionId: string): Question | null {
    return QUESTION_BANK.find((q) => q.id === questionId) || null;
  }
}
