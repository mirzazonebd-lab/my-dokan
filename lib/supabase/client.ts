import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
);

if (!isSupabaseConfigured) {
  if (typeof window === 'undefined') {
    console.warn(
      '⚠️  Supabase credentials not configured. Using local admin fallback.\n' +
      'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    );
  }
}

const fallbackAuth = {
  getSession: async () => ({ data: { session: null }, error: null }),
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } }),
  signUp: async () => ({ data: { user: null }, error: null }),
  signInWithPassword: async () => ({ data: { session: null }, error: null }),
  signOut: async () => ({ error: null }),
};

const fallbackQuery = () => ({
  select: () => ({
    eq: () => ({
      single: async () => ({ data: null, error: null }),
      maybeSingle: async () => ({ data: null, error: null }),
      order: () => ({ limit: async () => ({ data: [], error: null }) }),
    }),
    order: () => ({ limit: async () => ({ data: [], error: null }) }),
    maybeSingle: async () => ({ data: null, error: null }),
    single: async () => ({ data: null, error: null }),
  }),
  insert: () => ({
    select: () => ({ single: async () => ({ data: null, error: null }) }),
    single: async () => ({ data: null, error: null }),
  }),
  update: () => ({
    eq: () => ({
      select: () => ({ single: async () => ({ data: null, error: null }) }),
      single: async () => ({ data: null, error: null }),
    }),
  }),
  delete: () => ({
    eq: async () => ({ error: null }),
  }),
});

export const supabase = isSupabaseConfigured ? createClient(url, key) : ({ auth: fallbackAuth, from: fallbackQuery } as any);
