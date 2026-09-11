// TypeScript Interfaces and Types for MECH-MANIA 2026

export type QuestionType =
  | "multiple_choice"
  | "image_id"
  | "machine_id"
  | "scenario"
  | "speed_round"
  | "puzzle"
  | "fun_mech";

export type Difficulty = "easy" | "medium" | "hard" | "boss";

export type PowerUpType = "fiftyFifty" | "timeFreeze" | "doubleXP" | "shield";

export interface Question {
  id: string;
  question_text: string;
  question_type: QuestionType;
  options: string[];
  correct_answer: number; // Index 0-3 (Kept secret on server)
  level: number; // 1 to 6
  category: string;
  difficulty: Difficulty;
  points: number;
  time_limit: number; // in seconds
  image_url?: string;
  schematic_svg?: string; // Built-in vector mechanical diagram
  explanation: string;
}

// Client-safe version of Question (no correct_answer or explanation)
export interface ClientQuestion {
  id: string;
  question_text: string;
  question_type: QuestionType;
  options: string[];
  level: number;
  category: string;
  difficulty: Difficulty;
  points: number;
  time_limit: number;
  image_url?: string;
  schematic_svg?: string;
}

export interface Participant {
  id: string;
  participant_id: string; // e.g. "MM2026-00042"
  name: string;
  register_number: string;
  department: string;
  year: string;
  email: string;
  created_at: string;
}

export type AttemptStatus = "in_progress" | "completed" | "timed_out" | "abandoned";

export interface PowerUpInventory {
  fiftyFifty: number;
  timeFreeze: number;
  doubleXP: number;
  shield: number;
}

export interface Attempt {
  id: string;
  participant_id: string;
  status: AttemptStatus;
  score: number;
  accuracy: number;
  total_time: number; // seconds taken
  best_streak: number;
  current_streak: number;
  current_level: number; // 1 to 6
  current_question_index: number; // 0 to 29
  question_ids: string[]; // 30 ordered question IDs for this attempt
  remaining_lives: number;
  power_ups: PowerUpInventory;
  active_shield: boolean;
  active_double_xp: boolean;
  started_at: string;
  completed_at?: string;
}

export interface AnswerRecord {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_answer: number;
  is_correct: boolean;
  points_earned: number;
  response_time: number;
  answered_at: string;
}

export interface SubmitAnswerPayload {
  attempt_id: string;
  question_id: string;
  selected_option: number; // -1 for timeout
  time_spent: number;
}

export interface SubmitAnswerResponse {
  is_correct: boolean;
  correct_option: number; // revealed only after submission
  points_earned: number;
  current_score: number;
  current_streak: number;
  best_streak: number;
  remaining_lives: number;
  is_critical_mode: boolean;
  shield_absorbed: boolean;
  explanation: string;
  next_question?: ClientQuestion;
  next_level?: number;
  level_completed?: {
    level: number;
    level_name: string;
    xp_earned: number;
    accuracy: number;
    streak: number;
  };
  quiz_completed?: boolean;
  final_summary?: {
    score: number;
    accuracy: number;
    total_time: number;
    correct_count: number;
    wrong_count: number;
    best_streak: number;
  };
}

export interface UsePowerUpPayload {
  attempt_id: string;
  power_up: PowerUpType;
  current_question_id: string;
}

export interface UsePowerUpResponse {
  success: boolean;
  power_up: PowerUpType;
  remaining_power_ups: PowerUpInventory;
  // If 50/50, indices of options to eliminate
  eliminated_options?: number[];
  message: string;
}

export interface LeaderboardEntry {
  id?: string;
  register_number?: string;
  rank: number;
  participant_id: string;
  name: string;
  department: string;
  year: string;
  score: number;
  accuracy: number;
  total_time: number;
  completed_at: string;
  status?: string;
  current_level?: number;
  current_question_index?: number;
}

export interface GameSessionState {
  participant: Participant;
  attempt: Attempt;
  current_question: ClientQuestion;
  total_questions: number;
  level_name: string;
  is_boss_level: boolean;
}
