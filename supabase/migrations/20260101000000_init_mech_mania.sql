-- ==========================================================
-- MECH-MANIA 2026: SUPABASE POSTGRESQL INITIAL SCHEMA
-- Autonomous Zero-Admin Mechanical Engineering Game Quiz
-- ==========================================================

-- Enable pgcrypto for UUIDs if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id VARCHAR(32) UNIQUE NOT NULL, -- e.g. MM2026-00001
    name VARCHAR(255) NOT NULL,
    register_number VARCHAR(64) UNIQUE NOT NULL,
    department VARCHAR(128) NOT NULL,
    year VARCHAR(32) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for instant lookup on registration & resume
CREATE INDEX IF NOT EXISTS idx_participants_reg_num ON participants(register_number);
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);

-- 2. QUESTIONS TABLE (Server-Authoritative)
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(64) PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_type VARCHAR(64) NOT NULL DEFAULT 'multiple_choice',
    options JSONB NOT NULL, -- Array of 4 string options
    correct_answer INTEGER NOT NULL, -- Index 0-3
    level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 6),
    category VARCHAR(128) NOT NULL,
    difficulty VARCHAR(32) NOT NULL,
    points INTEGER NOT NULL DEFAULT 100,
    time_limit INTEGER NOT NULL DEFAULT 25,
    image_url TEXT,
    schematic_svg TEXT,
    explanation TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_level ON questions(level);

-- 3. ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'timed_out'
    score INTEGER NOT NULL DEFAULT 0,
    accuracy NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    total_time NUMERIC(8, 2) NOT NULL DEFAULT 0.00, -- seconds
    best_streak INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    current_level INTEGER NOT NULL DEFAULT 1 CHECK (current_level BETWEEN 1 AND 6),
    current_question_index INTEGER NOT NULL DEFAULT 0,
    question_ids JSONB NOT NULL, -- Array of 30 question IDs in order
    remaining_lives INTEGER NOT NULL DEFAULT 3,
    power_ups JSONB NOT NULL DEFAULT '{"fiftyFifty": 1, "timeFreeze": 1, "doubleXP": 1, "shield": 1}'::jsonb,
    active_shield BOOLEAN NOT NULL DEFAULT FALSE,
    active_double_xp BOOLEAN NOT NULL DEFAULT FALSE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    CONSTRAINT one_attempt_per_participant UNIQUE (participant_id)
);

-- Indexes for ranking and performance
CREATE INDEX IF NOT EXISTS idx_attempts_leaderboard ON attempts(score DESC, total_time ASC);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON attempts(status);

-- 4. ANSWERS LOG TABLE
CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    question_id VARCHAR(64) NOT NULL REFERENCES questions(id),
    selected_answer INTEGER NOT NULL, -- -1 if timed out
    is_correct BOOLEAN NOT NULL,
    points_earned INTEGER NOT NULL,
    response_time NUMERIC(6, 2) NOT NULL,
    answered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_answers_attempt ON answers(attempt_id);

-- 5. POWER-UP USAGE AUDIT TABLE
CREATE TABLE IF NOT EXISTS power_up_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    power_up_type VARCHAR(64) NOT NULL,
    used_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EVENT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS event_settings (
    key VARCHAR(128) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. LIVE LEADERBOARD VIEW
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY a.score DESC, a.accuracy DESC, a.total_time ASC) AS rank,
    p.participant_id,
    p.name,
    p.department,
    p.year,
    a.score,
    a.accuracy,
    a.total_time,
    a.completed_at
FROM attempts a
JOIN participants p ON a.participant_id = p.id
WHERE a.status = 'completed';

-- 8. ROW LEVEL SECURITY (RLS)
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE power_up_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to leaderboard view and public registration
CREATE POLICY "Public can view leaderboard attempts" ON attempts
    FOR SELECT USING (status = 'completed');

CREATE POLICY "Public can view public event settings" ON event_settings
    FOR SELECT USING (TRUE);

-- Realtime publication for live leaderboard updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'attempts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE attempts;
  END IF;
END $$;
