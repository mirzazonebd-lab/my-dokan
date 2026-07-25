import { NextResponse } from 'next/server';
import { requireSmsAuthorization } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    await requireSmsAuthorization(request);
    const { data, error } = await supabaseAdmin.from('sms_logs').select('id,order_id,recipient_phone,message_type,status,created_by,created_at,updated_at').order('created_at', { ascending: false }).limit(100);
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    if (error instanceof Response) return new NextResponse(error.body, { status: error.status, headers: { 'content-type': 'application/json' } });
    return NextResponse.json({ error: 'Unable to retrieve SMS logs' }, { status: 500 });
  }
}
