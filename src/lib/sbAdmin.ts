import { createClient } from '@supabase/supabase-js';

// This file should ONLY be used on the server.
// The SUPABASE_SERVICE_ROLE_KEY is a secret and should never be exposed to the browser.
if (typeof window !== 'undefined') {
  throw new Error('supabaseAdmin should only be used on the server.');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase URL or Service Role Key for Admin Client');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export { supabaseAdmin };
