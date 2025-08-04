import { createClient } from '@supabase/supabase-js';

export function createSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
  const supabaseKey = process.env.SUPABASE_KEY || 'YOUR_SUPABASE_ANON_KEY';
  return createClient(supabaseUrl, supabaseKey);
}

export const supabase = createSupabaseClient();
