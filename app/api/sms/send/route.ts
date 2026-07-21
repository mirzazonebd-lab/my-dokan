import { NextResponse } from 'next/server';
import { requireSmsAuthorization } from '@/lib/auth';
import { queueOrderSms } from '@/lib/sms';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    const user = await requireSmsAuthorization(request);
    const body = await request.json();
    if (!/^[0-9a-f-]{36}$/i.test(String(body?.orderId || '')) || !['ORDER_CONFIRMATION','PAYMENT_SUCCESS','SHIPMENT','DELIVERY'].includes(body?.templateKey)) return NextResponse.json({ error: 'Invalid request' }, { status: 422 });
    // phone/message supplied by a browser are deliberately ignored.
    return NextResponse.json({ success: true, data: await queueOrderSms(body.orderId, body.templateKey, user.id) }, { status: 202 });
  } catch (error: any) {
    if (error instanceof Response) return new NextResponse(error.body, { status: error.status, headers: { 'content-type': 'application/json' } });
    return NextResponse.json({ error: error.message || 'Unable to queue SMS' }, { status: error.status || 500 });
  }
}
