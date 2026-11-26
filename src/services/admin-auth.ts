import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function isAdmin(user: User | null | undefined): boolean {
  return user?.app_metadata?.role === 'admin';
}

export async function getAdminUser(): Promise<User | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !isAdmin(data.user)) return null;
  return data.user;
}

export async function signInAdmin(email: string, password: string): Promise<void> {
  if (!supabase) throw new Error('Admin sign-in is unavailable until Supabase is connected.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!isAdmin(data.user)) {
    await supabase.auth.signOut();
    throw new Error('This account does not have administrator access.');
  }
}
