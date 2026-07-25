import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { parseTwilioWebhook, verifyTwilioWebhookSignature } from '@/lib/twilio';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  const raw = await request.text();
  const params = parseTwilioWebhook(raw);
  if (!verifyTwilioWebhookSignature(request, params)) return NextResponse.json({ error: 'Forbidden: Invalid webhook signature' }, { status: 403 });
  const log = new URL(request.url).searchParams.get('log');
  if (log && params.MessageStatus) {
    const messageStatus = params.MessageStatus.toLowerCase();
    const status = messageStatus === 'delivered' ? 'delivered' : ['failed', 'undelivered'].includes(messageStatus) ? 'failed' : 'sent';
    await supabaseAdmin.from('sms_logs').update({ status, provider_response: { status: messageStatus, sid: params.MessageSid } }).eq('id', log);
  }
  return new NextResponse(null, { status: 204 });
}
