import { NextResponse } from 'next/server';
import { requireSmsAuthorization } from '@/lib/auth';
import { getAllSettingsFromDB, updateSettingInDB } from '@/lib/supabase/db';
import { supabaseAdmin } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const settings = await getAllSettingsFromDB();
    const result: any = {};
    settings.forEach((s: any) => {
      result[s.setting_key] = s.setting_value;
    });
    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireSmsAuthorization(request);
    const body = await request.json();

    if (!body.key || body.value === undefined) {
      return NextResponse.json(
        { error: 'Key and value required' },
        { status: 400 }
      );
    }

    const setting = await updateSettingInDB(body.key, body.value, user.id);
    return NextResponse.json({ data: setting });
  } catch (error: any) {
    if (error instanceof Response) {
      return new NextResponse(error.body, {
        status: error.status,
        headers: { 'content-type': 'application/json' },
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
