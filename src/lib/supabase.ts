import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/** The browser uses only Supabase's publishable key. RLS is the security boundary. */
export const supabase = url && publishableKey ? createClient(url, publishableKey, {
  auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
}) : null;

export const isBackendConfigured = Boolean(supabase);
