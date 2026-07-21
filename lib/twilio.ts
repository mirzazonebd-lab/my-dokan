import twilio from 'twilio';

export function verifyTwilioWebhookSignature(request: Request, params: Record<string, string>) {
  return twilio.validateRequest(process.env.TWILIO_WEBHOOK_AUTH_TOKEN || process.env.TWILIO_AUTH_TOKEN!, request.headers.get('x-twilio-signature') || '', request.url, params);
}

export function parseTwilioWebhook(raw: string) { return Object.fromEntries(new URLSearchParams(raw)); }
