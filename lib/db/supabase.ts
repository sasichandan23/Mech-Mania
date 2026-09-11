import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://axjoavcwyqbtukfayalq.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4am9hdmN3eXFidHVrZmF5YWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNDI1NTcsImV4cCI6MjEwNDYxODU1N30.ZQLEWsZMJ3a_435EO_83YYNB5DQHdPNU2KiZjM6epNs";

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4am9hdmN3eXFidHVrZmF5YWxxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTA0MjU1NywiZXhwIjoyMTA0NjE4NTU3fQ.jMvhNCwN88OKQ0HWWmM_uOtfQtbKea8872owB5G93h0";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseUrl.startsWith("http") && 
  (supabaseAnonKey || supabaseServiceKey)
);

// Public client for browser / Realtime subscriptions
export const supabasePublic = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-authoritative client with elevated service privileges (for scoring & attempts)
export const supabaseServer = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;
