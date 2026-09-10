import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

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
