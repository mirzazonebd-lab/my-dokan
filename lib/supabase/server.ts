import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';
export const isSupabaseAdminConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_ROLE_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
);

if (!isSupabaseAdminConfigured) {
  console.warn(
    '⚠️  Supabase admin credentials not configured. Using local admin fallback.\n' +
    'Set SUPABASE_SERVICE_ROLE_KEY in .env.local for admin operations'
  );
}

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

export const supabaseAdmin = isSupabaseAdminConfigured ? createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
}) : ({ from: fallbackQuery } as any);
