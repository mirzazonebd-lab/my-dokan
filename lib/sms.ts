import crypto from 'crypto';
import twilio from 'twilio';
import { supabaseAdmin } from '@/lib/supabase/server';

const TYPES = new Set(['ORDER_CONFIRMATION', 'PAYMENT_SUCCESS', 'SHIPMENT', 'DELIVERY']);
export const maskPhoneNumber = (phone: string) => `${phone.slice(0, 4)}XXXXX${phone.slice(-4)}`;

const normalizePhone = (phone: string) => {
  if (/^01\d{9}$/.test(phone)) return `+88${phone}`;
  if (/^\+8801\d{9}$/.test(phone)) return phone;
  throw new Error('Invalid customer phone number');
};

const render = (template: string, values: Record<string, string>) => template.replace(/\{(\w+)\}/g, (_, key) => values[key] || '');

export async function queueOrderSms(orderId: string, templateKey: string, userId: string) {
  if (!TYPES.has(templateKey)) throw new Error('Invalid template key');
  
  if (!process.env.NEXTAUTH_URL) throw new Error('NEXTAUTH_URL not configured');
  
  const { data: order, error: orderError } = await supabaseAdmin.from('orders').select('id,order_number,total,tracking_url,shipping_address').eq('id', orderId).single();
  if (orderError || !order) throw new Error('Order not found');
  const { count } = await supabaseAdmin.from('sms_queue').select('*', { count: 'exact', head: true }).eq('order_id', orderId).gte('created_at', new Date(Date.now() - 60000).toISOString());
  if ((count || 0) >= 5) { const error: any = new Error('Rate limit exceeded: Max 5 SMS per minute per order'); error.status = 429; throw error; }
  const address = order.shipping_address as { name?: string; phone?: string };
  const phone = normalizePhone(address.phone || '');
  const { data: template, error: templateError } = await supabaseAdmin.from('sms_templates').select('template_text').eq('template_key', templateKey).single();
  if (templateError || !template) throw new Error('SMS template not found');
  const message = render(template.template_text, { customerName: String(address.name || 'Customer').slice(0, 80), orderId: order.order_number, amount: Number(order.total).toFixed(2), trackingUrl: String(order.tracking_url || 'Tracking will be shared soon.').slice(0, 200) });
  const { data: log, error: logError } = await supabaseAdmin.from('sms_logs').insert({ order_id: order.id, recipient_phone: maskPhoneNumber(phone), message_type: templateKey, status: 'pending', created_by: userId }).select().single();
  if (logError || !log) throw logError || new Error('Unable to create SMS log');
  const { error: queueError } = await supabaseAdmin.from('sms_queue').insert({ sms_log_id: log.id, order_id: order.id, template_key: templateKey, status: 'queued' });
  if (queueError) throw queueError;
  const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
  try {
    const callbackUrl = new URL(`/api/sms/webhook?log=${encodeURIComponent(log.id)}`, process.env.NEXTAUTH_URL).toString();
    const response = await client.messages.create({ to: phone, from: process.env.TWILIO_PHONE_NUMBER!, body: message, statusCallback: callbackUrl });
    await supabaseAdmin.from('sms_logs').update({ status: 'sent', provider_response: { sid: response.sid, status: response.status } }).eq('id', log.id);
    await supabaseAdmin.from('sms_queue').update({ status: 'sent' }).eq('sms_log_id', log.id);
  } catch {
    await supabaseAdmin.from('sms_logs').update({ status: 'failed' }).eq('id', log.id);
    throw new Error('SMS provider delivery failed');
  }
  return { id: log.id, recipientPhone: maskPhoneNumber(phone) };
}
