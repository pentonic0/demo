import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  // We log but don't throw here to avoid crashing the build if envs are missing during static generation
  console.warn('Missing Supabase URL or Anon Key for Public Client');
}

export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);
