-- =========================================================================
-- ⚙️ MECH-MANIA 2026: SUPABASE ONE-CLICK LEADERBOARD SETUP
-- Run this in your Supabase Project -> SQL Editor -> Run
-- This creates all required tables, disables RLS for smooth operation,
-- and creates the leaderboard view so every player's score is permanently saved!
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    register_number VARCHAR(64) UNIQUE NOT NULL,
    department VARCHAR(128) NOT NULL,
    year VARCHAR(32) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_participants_reg_num ON participants(register_number);
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);

-- 2. ATTEMPTS TABLE (Scores, Progress, Timers)
CREATE TABLE IF NOT EXISTS attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL DEFAULT 'in_progress',
    score INTEGER NOT NULL DEFAULT 0,
    accuracy NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    total_time NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
    best_streak INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    current_level INTEGER NOT NULL DEFAULT 1 CHECK (current_level BETWEEN 1 AND 6),
    current_question_index INTEGER NOT NULL DEFAULT 0,
    question_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    remaining_lives INTEGER NOT NULL DEFAULT 3,
    power_ups JSONB NOT NULL DEFAULT '{"fiftyFifty": 1, "timeFreeze": 1, "doubleXP": 1, "shield": 1}'::jsonb,
    active_shield BOOLEAN NOT NULL DEFAULT FALSE,
    active_double_xp BOOLEAN NOT NULL DEFAULT FALSE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    CONSTRAINT one_attempt_per_participant UNIQUE (participant_id)
);

CREATE INDEX IF NOT EXISTS idx_attempts_leaderboard ON attempts(score DESC, total_time ASC);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON attempts(status);

-- 3. ANSWERS LOG TABLE
CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    question_id VARCHAR(64) NOT NULL,
    selected_answer INTEGER NOT NULL,
    is_correct BOOLEAN NOT NULL,
    points_earned INTEGER NOT NULL,
    response_time NUMERIC(6, 2) NOT NULL,
    answered_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. POWER-UP USAGE AUDIT TABLE
CREATE TABLE IF NOT EXISTS power_up_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    power_up_type VARCHAR(64) NOT NULL,
    used_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LIVE LEADERBOARD VIEW (Shows every student who has played or completed)
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
    COALESCE(a.completed_at, a.started_at) AS completed_at
FROM attempts a
JOIN participants p ON a.participant_id = p.id
WHERE a.status = 'completed' OR a.score > 0 OR a.current_question_index > 0;

-- 6. DISABLE RLS FOR ZERO-PERMISSION ERRORS
ALTER TABLE participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE power_up_usage DISABLE ROW LEVEL SECURITY;

-- 7. GRANT FULL PERMISSIONS
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
