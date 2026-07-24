import crypto from 'crypto';
import { supabase, } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';

function equal(a: string | null, b: string | undefined) {
  if (!a || !b || a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function requireSmsAuthorization(request: Request) {
  if (!process.env.SYSTEM_API_KEY) throw new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
  const systemKey = request.headers.get('x-system-key');
  if (!equal(systemKey, process.env.SYSTEM_API_KEY)) throw new Response(JSON.stringify({ error: 'Unauthorized: Invalid system key' }), { status: 401 });
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) throw new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
  if (profile?.role !== 'admin') throw new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), { status: 403 });
  return data.user;
}
