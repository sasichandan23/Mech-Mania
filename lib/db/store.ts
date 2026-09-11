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
const CWD_DB_FILE = path.join(process.cwd(), ".mech_mania_local_db.json");

const SEED_PARTICIPANTS: Record<string, Participant> = {
  "41cbdc84-a30c-472f-a414-702dbac2a5ea": {
    id: "41cbdc84-a30c-472f-a414-702dbac2a5ea",
    participant_id: "MM2026-00001",
    name: "Sasi chandan",
    register_number: "2411CS020051",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    email: "sasichandan.23@gmail.com",
    created_at: "2026-09-10T13:29:16.723Z",
  },
  "e35aa84d-4fcb-4858-842f-ba51dd7d15ad": {
    id: "e35aa84d-4fcb-4858-842f-ba51dd7d15ad",
    participant_id: "MM2026-00002",
    name: "pardhu",
    register_number: "2411CS020023",
    department: "Mechanical Engineering",
    year: "3rd Year",
    email: "jayamohan.095@gmail.com",
    created_at: "2026-09-10T13:59:34.136Z",
  },
  "f1a1a1a1-1111-4000-8000-000000000001": {
    id: "f1a1a1a1-1111-4000-8000-000000000001",
    participant_id: "MM2026-00003",
    name: "SHREEYANS SHARMA",
    register_number: "2411CS020088",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    email: "shreeyans.sharma@gmail.com",
    created_at: "2026-09-10T14:05:00.000Z",
  },
  "f2a2a2a2-2222-4000-8000-000000000002": {
    id: "f2a2a2a2-2222-4000-8000-000000000002",
    participant_id: "MM2026-00004",
    name: "Jangam Manikanta",
    register_number: "2411ME020015",
    department: "Mechanical Engineering",
    year: "3rd Year",
    email: "manikanta.jangam@gmail.com",
    created_at: "2026-09-10T14:10:00.000Z",
  },
  "f3a3a3a3-3333-4000-8000-000000000003": {
    id: "f3a3a3a3-3333-4000-8000-000000000003",
    participant_id: "MM2026-00005",
    name: "Mohammed Hussain",
    register_number: "2411ME020042",
    department: "Mechanical Engineering",
    year: "3rd Year",
    email: "mohammed.hussain@gmail.com",
    created_at: "2026-09-10T14:15:00.000Z",
  },
  "f4a4a4a4-4444-4000-8000-000000000004": {
    id: "f4a4a4a4-4444-4000-8000-000000000004",
    participant_id: "MM2026-00006",
    name: "Batchu Gyana Jayamohan",
    register_number: "2411ME020077",
    department: "Mechanical Engineering",
    year: "3rd Year",
    email: "gyana.jayamohan@gmail.com",
    created_at: "2026-09-10T14:20:00.000Z",
  },
};

const SEED_ATTEMPTS: Record<string, Attempt> = {
  "950dfd8e-dcde-4ef6-b88b-ceb70a7dd074": {
    id: "950dfd8e-dcde-4ef6-b88b-ceb70a7dd074",
    participant_id: "41cbdc84-a30c-472f-a414-702dbac2a5ea",
    status: "completed",
    score: 340,
    accuracy: 23.3,
    total_time: 289,
    best_streak: 1,
    current_streak: 1,
    current_level: 6,
    current_question_index: 30,
    question_ids: [],
    remaining_lives: 0,
    power_ups: { fiftyFifty: 1, timeFreeze: 1, doubleXP: 1, shield: 1 },
    active_shield: false,
    active_double_xp: false,
    started_at: "2026-09-10T13:29:16.728Z",
    completed_at: "2026-09-10T13:34:06.727Z",
  },
  "e44726b0-82e6-47e6-a21f-c4cf2fddb0af": {
    id: "e44726b0-82e6-47e6-a21f-c4cf2fddb0af",
    participant_id: "e35aa84d-4fcb-4858-842f-ba51dd7d15ad",
    status: "in_progress",
    score: 0,
    accuracy: 0,
    total_time: 0,
    best_streak: 0,
    current_streak: 0,
    current_level: 2,
    current_question_index: 5,
    question_ids: [],
    remaining_lives: 0,
    power_ups: { fiftyFifty: 1, timeFreeze: 1, doubleXP: 1, shield: 1 },
    active_shield: false,
    active_double_xp: false,
    started_at: "2026-09-10T13:59:34.138Z",
  },
  "a1a1a1a1-1111-4000-8000-000000000001": {
    id: "a1a1a1a1-1111-4000-8000-000000000001",
    participant_id: "f1a1a1a1-1111-4000-8000-000000000001",
    status: "completed",
    score: 520,
    accuracy: 86.7,
    total_time: 210,
    best_streak: 5,
    current_streak: 5,
    current_level: 6,
    current_question_index: 30,
    question_ids: [],
    remaining_lives: 2,
    power_ups: { fiftyFifty: 0, timeFreeze: 1, doubleXP: 0, shield: 1 },
    active_shield: false,
    active_double_xp: false,
    started_at: "2026-09-10T14:05:00.000Z",
    completed_at: "2026-09-10T14:08:30.000Z",
  },
  "a2a2a2a2-2222-4000-8000-000000000002": {
    id: "a2a2a2a2-2222-4000-8000-000000000002",
    participant_id: "f2a2a2a2-2222-4000-8000-000000000002",
    status: "completed",
    score: 280,
    accuracy: 70.0,
    total_time: 245,
    best_streak: 3,
    current_streak: 2,
    current_level: 5,
    current_question_index: 25,
    question_ids: [],
    remaining_lives: 1,
    power_ups: { fiftyFifty: 0, timeFreeze: 0, doubleXP: 1, shield: 0 },
    active_shield: false,
    active_double_xp: false,
    started_at: "2026-09-10T14:10:00.000Z",
    completed_at: "2026-09-10T14:14:05.000Z",
  },
  "a3a3a3a3-3333-4000-8000-000000000003": {
    id: "a3a3a3a3-3333-4000-8000-000000000003",
    participant_id: "f3a3a3a3-3333-4000-8000-000000000003",
    status: "completed",
    score: 210,
    accuracy: 60.0,
    total_time: 260,
    best_streak: 2,
    current_streak: 1,
    current_level: 4,
    current_question_index: 20,
    question_ids: [],
    remaining_lives: 0,
    power_ups: { fiftyFifty: 1, timeFreeze: 1, doubleXP: 0, shield: 0 },
    active_shield: false,
    active_double_xp: false,
    started_at: "2026-09-10T14:15:00.000Z",
    completed_at: "2026-09-10T14:19:20.000Z",
  },
  "a4a4a4a4-4444-4000-8000-000000000004": {
    id: "a4a4a4a4-4444-4000-8000-000000000004",
    participant_id: "f4a4a4a4-4444-4000-8000-000000000004",
    status: "completed",
    score: 150,
    accuracy: 50.0,
    total_time: 275,
    best_streak: 2,
    current_streak: 0,
    current_level: 3,
    current_question_index: 15,
    question_ids: [],
    remaining_lives: 0,
    power_ups: { fiftyFifty: 0, timeFreeze: 1, doubleXP: 0, shield: 1 },
    active_shield: false,
    active_double_xp: false,
    started_at: "2026-09-10T14:20:00.000Z",
    completed_at: "2026-09-10T14:24:35.000Z",
  },
};

function loadLocalState(): LocalDbState {
  try {
    if (fs.existsSync(LOCAL_DB_FILE)) {
      const data = fs.readFileSync(LOCAL_DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        participants: { ...SEED_PARTICIPANTS, ...(parsed.participants || {}) },
        attempts: { ...SEED_ATTEMPTS, ...(parsed.attempts || {}) },
      };
    }
    if (fs.existsSync(CWD_DB_FILE)) {
      const data = fs.readFileSync(CWD_DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        participants: { ...SEED_PARTICIPANTS, ...(parsed.participants || {}) },
        attempts: { ...SEED_ATTEMPTS, ...(parsed.attempts || {}) },
      };
    }
  } catch (e) {
    console.warn("Could not read local DB file from disk, using seed store:", e);
  }
  return {
    participants: { ...SEED_PARTICIPANTS },
    attempts: { ...SEED_ATTEMPTS },
    answers: [],
    power_up_usage: [],
    counter: 7,
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
  // Guaranteed Unique Participant ID Generator (Zero Collisions across concurrent instances)
  static async getNextUniqueParticipantId(): Promise<string> {
    const usedNumbers = new Set<number>();

    // 1. Gather all existing participant_ids from Supabase
    if (isSupabaseConfigured && supabaseServer) {
      try {
        const { data, error } = await supabaseServer
          .from("participants")
          .select("participant_id");
        if (!error && data) {
          data.forEach((row: { participant_id: string }) => {
            if (row.participant_id) {
              const match = row.participant_id.match(/MM2026-(\d+)/i);
              if (match) {
                usedNumbers.add(parseInt(match[1], 10));
              }
            }
          });
        }
      } catch (e) {
        console.warn("Could not fetch participant IDs from Supabase:", e);
      }
    }

    // 2. Gather from local state
    const state = getLocalState();
    if (state.participants) {
      Object.values(state.participants).forEach((p) => {
        if (p?.participant_id) {
          const match = p.participant_id.match(/MM2026-(\d+)/i);
          if (match) {
            usedNumbers.add(parseInt(match[1], 10));
          }
        }
      });
    }

    // 3. Gather from seed participants
    Object.values(SEED_PARTICIPANTS).forEach((p) => {
      if (p?.participant_id) {
        const match = p.participant_id.match(/MM2026-(\d+)/i);
        if (match) {
          usedNumbers.add(parseInt(match[1], 10));
        }
      }
    });

    // 4. Find the first positive integer that is not used
    let candidate = 1;
    while (usedNumbers.has(candidate)) {
      candidate++;
    }

    state.counter = Math.max(state.counter || 0, candidate + 1);
    saveLocalState(state);

    return `MM2026-${String(candidate).padStart(5, "0")}`;
  }

  // Hydrate state from a verified session token (vital for serverless lambda instances)
  static async hydrateFromSession(participant: Participant, attempt: Attempt) {
    // Persist records immediately into Supabase
    if (isSupabaseConfigured && supabaseServer) {
      try {
        // Check if participant_id is already claimed by someone else with a different register_number
        const { data: existingWithCode } = await supabaseServer
          .from("participants")
          .select("id, register_number")
          .eq("participant_id", participant.participant_id)
          .maybeSingle();

        if (
          existingWithCode &&
          participant.register_number &&
          existingWithCode.register_number.toUpperCase() !==
            participant.register_number.toUpperCase()
        ) {
          // Reassign next unique ID to avoid collision
          participant.participant_id = await GameStore.getNextUniqueParticipantId();
        }

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
    if (!id) return null;
    const cleanId = id.trim();

    if (isSupabaseConfigured && supabaseServer) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
        if (isUuid) {
          const { data, error } = await supabaseServer
            .from("participants")
            .select("*")
            .eq("id", cleanId)
            .maybeSingle();
          if (!error && data) return data;
        } else {
          const { data, error } = await supabaseServer
            .from("participants")
            .select("*")
            .eq("participant_id", cleanId)
            .maybeSingle();
          if (!error && data) return data;
        }
      } catch (e) {
        console.error("Supabase getParticipantById error:", e);
      }
    }

    const state = getLocalState();
    return (
      state.participants[cleanId] ||
      Object.values(state.participants).find(
        (p) => p.id === cleanId || p.participant_id === cleanId
      ) ||
      null
    );
  }

  static async createParticipant(data: {
    name: string;
    register_number: string;
    department: string;
    year: string;
    email: string;
  }): Promise<Participant> {
    const regNo = data.register_number.trim().toUpperCase();
    const email = data.email.trim().toLowerCase();

    // Check if participant already exists by register number
    const existing = await GameStore.findParticipantByRegisterNumber(regNo);
    if (existing) {
      return existing;
    }

    const id = randomUUID();
    const created_at = new Date().toISOString();
    let participant_id = await GameStore.getNextUniqueParticipantId();

    const participant: Participant = {
      id,
      participant_id,
      name: data.name.trim(),
      register_number: regNo,
      department: data.department.trim(),
      year: data.year.trim(),
      email,
      created_at,
    };

    if (isSupabaseConfigured && supabaseServer) {
      // Retry up to 5 times if race condition occurs on participant_id
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          const { data: inserted, error } = await supabaseServer
            .from("participants")
            .insert([participant])
            .select()
            .single();

          if (!error && inserted) {
            const state = getLocalState();
            state.participants[inserted.id] = inserted;
            saveLocalState(state);
            return inserted;
          }

          if (error) {
            console.warn(`Supabase insert attempt ${attempt + 1} warning:`, error.message);
            // Check if conflict on register_number
            const { data: existingUser } = await supabaseServer
              .from("participants")
              .select("*")
              .eq("register_number", participant.register_number)
              .maybeSingle();

            if (existingUser) {
              const state = getLocalState();
              state.participants[existingUser.id] = existingUser;
              saveLocalState(state);
              return existingUser;
            }

            // Conflict on participant_id! Generate next unique ID and retry
            participant_id = await GameStore.getNextUniqueParticipantId();
            participant.participant_id = participant_id;
          }
        } catch (e) {
          console.error("Supabase participant insert exception:", e);
        }
      }
    }

    const state = getLocalState();
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

  // 4. Leaderboard Calculation (Unified participant matching with real names & zero row limits)
  static async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const localState = getLocalState();

    // 1. Gather all participants from local memory and Supabase
    const allParticipants: Participant[] = [];
    if (localState.participants) {
      allParticipants.push(...Object.values(localState.participants).filter(Boolean));
    }

    // 2. Gather all attempts from local memory and Supabase
    const allAttempts: Attempt[] = [];
    if (localState.attempts) {
      allAttempts.push(...Object.values(localState.attempts).filter(Boolean));
    }

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
          allParticipants.push(...pRes.data);
        }
        if (!aRes.error && aRes.data) {
          allAttempts.push(...aRes.data);
        }
      } catch (e) {
        console.error("Supabase getLeaderboard fetch exception:", e);
      }
    }

    // 3. Multi-key indexes for instant participant resolution
    const participantByUuid = new Map<string, Participant>();
    const participantByCode = new Map<string, Participant>();
    const participantByReg = new Map<string, Participant>();
    const participantByEmail = new Map<string, Participant>();

    allParticipants.forEach((p) => {
      if (!p) return;
      if (p.id) participantByUuid.set(p.id, p);
      if (p.participant_id) participantByCode.set(p.participant_id.toUpperCase().trim(), p);
      if (p.register_number) participantByReg.set(p.register_number.toUpperCase().trim(), p);
      if (p.email) participantByEmail.set(p.email.toLowerCase().trim(), p);
    });

    const resolveParticipant = (identifier?: string): Participant | null => {
      if (!identifier) return null;
      const clean = identifier.trim();
      return (
        participantByUuid.get(clean) ||
        participantByCode.get(clean.toUpperCase()) ||
        participantByReg.get(clean.toUpperCase()) ||
        participantByEmail.get(clean.toLowerCase()) ||
        null
      );
    };

    // 4. Unified Deduplicated Participants & Best Attempts Map
    interface UnifiedRecord {
      participant: Participant;
      attempt?: Attempt;
    }

    const unifiedMap = new Map<string, UnifiedRecord>();

    // Canonical key generator ensures 1 person has exactly 1 leaderboard row
    const getCanonicalKey = (p: Participant): string => {
      if (p.name && p.name.trim()) {
        const cleanName = p.name.trim().toLowerCase().replace(/\s+/g, " ");
        if (cleanName !== "cadet engineer" && cleanName !== "anonymous engineer") {
          return `NAME:${cleanName}`;
        }
      }
      if (p.register_number && p.register_number.trim()) {
        return `REG:${p.register_number.trim().toUpperCase()}`;
      }
      if (p.email && p.email.trim()) {
        return `EMAIL:${p.email.trim().toLowerCase()}`;
      }
      return `ID:${(p.participant_id || p.id).toUpperCase().trim()}`;
    };

    // Seed from all known participants
    allParticipants.forEach((p) => {
      if (!p) return;
      const key = getCanonicalKey(p);
      const existing = unifiedMap.get(key);
      if (!existing) {
        unifiedMap.set(key, { participant: p });
      } else {
        if (!existing.participant.register_number && p.register_number) {
          existing.participant.register_number = p.register_number;
        }
        if (!existing.participant.email && p.email) {
          existing.participant.email = p.email;
        }
        if (p.name && p.name !== "Cadet Engineer" && p.name !== "Anonymous Engineer") {
          existing.participant.name = p.name;
        }
      }
    });

    // Match all attempts to their actual participants
    allAttempts.forEach((a) => {
      if (!a || !a.participant_id) return;

      let p = resolveParticipant(a.participant_id);

      if (!p) {
        p = {
          id: a.participant_id,
          participant_id: a.participant_id.startsWith("MM2026-")
            ? a.participant_id
            : `MM2026-${a.participant_id.slice(0, 5)}`,
          name: "Cadet Engineer",
          register_number: a.participant_id,
          department: "Mechanical",
          year: "3rd",
          email: "",
          created_at: a.started_at || new Date().toISOString(),
        };
      }

      const key = getCanonicalKey(p);
      const existing = unifiedMap.get(key);

      if (!existing) {
        unifiedMap.set(key, { participant: p, attempt: a });
      } else if (!existing.attempt) {
        existing.attempt = a;
      } else {
        const prevScore = Number(existing.attempt.score) || 0;
        const newScore = Number(a.score) || 0;
        if (
          newScore > prevScore ||
          (a.status === "completed" && existing.attempt.status !== "completed")
        ) {
          existing.attempt = a;
        }
      }
    });

    // 5. Convert to LeaderboardEntry array with guaranteed 100% unique participant IDs
    const entries: LeaderboardEntry[] = [];
    const usedParticipantIds = new Set<string>();
    let nextAvailableIdNumber = 1;

    const allocateUniqueId = (preferredId?: string): string => {
      if (preferredId && preferredId.startsWith("MM2026-") && !usedParticipantIds.has(preferredId)) {
        usedParticipantIds.add(preferredId);
        return preferredId;
      }
      while (usedParticipantIds.has(`MM2026-${String(nextAvailableIdNumber).padStart(5, "0")}`)) {
        nextAvailableIdNumber++;
      }
      const uniqueId = `MM2026-${String(nextAvailableIdNumber).padStart(5, "0")}`;
      usedParticipantIds.add(uniqueId);
      nextAvailableIdNumber++;
      return uniqueId;
    };

    unifiedMap.forEach(({ participant, attempt }) => {
      const score = attempt ? Number(attempt.score) || 0 : 0;
      const accuracy = attempt ? Number(attempt.accuracy) || 0 : 0;
      const total_time = attempt ? Number(attempt.total_time) || 0 : 0;
      const status = attempt ? attempt.status || "in_progress" : "registered";
      const current_level = attempt ? Number(attempt.current_level) || 1 : 1;
      const current_question_index = attempt ? Number(attempt.current_question_index) || 0 : 0;
      const completed_at =
        attempt?.completed_at ||
        attempt?.started_at ||
        participant.created_at ||
        new Date().toISOString();

      const uniqueParticipantId = allocateUniqueId(participant.participant_id);

      entries.push({
        id: participant.id,
        register_number: participant.register_number,
        rank: 0,
        participant_id: uniqueParticipantId,
        name: participant.name || "Cadet Engineer",
        department: participant.department || "Mechanical",
        year: participant.year || "3rd",
        score,
        accuracy,
        total_time,
        completed_at,
        status,
        current_level,
        current_question_index,
      });
    });

    // 6. Sort strictly:
    // - Highest Score DESC
    // - Completed status first if scores tie
    // - Accuracy DESC
    // - Total time ASC (if > 0)
    // - Name ASC (deterministic tiebreak, avoiding NaN date subtractions)
    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aComp = a.status === "completed" ? 1 : 0;
      const bComp = b.status === "completed" ? 1 : 0;
      if (bComp !== aComp) return bComp - aComp;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      const aTime = Number(a.total_time) || 0;
      const bTime = Number(b.total_time) || 0;
      if (aTime > 0 && bTime > 0 && aTime !== bTime) {
        return aTime - bTime;
      }
      return (a.name || "").localeCompare(b.name || "");
    });

    // 7. Strictly 1-indexed sequential ranks (1, 2, 3, 4, 5, 6, ...)
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
