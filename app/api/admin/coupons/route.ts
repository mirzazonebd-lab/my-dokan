import { NextResponse } from 'next/server';
import { requireSmsAuthorization } from '@/lib/auth';
import {
  getCouponsFromDB,
  createCouponInDB,
  updateCouponInDB,
  deleteCouponInDB,
} from '@/lib/supabase/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await requireSmsAuthorization(request);
    const coupons = await getCouponsFromDB();
    return NextResponse.json({ data: coupons });
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

export async function POST(request: Request) {
  try {
    await requireSmsAuthorization(request);
    const body = await request.json();

    if (!body.code || !body.discount_type || !body.discount_value) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const coupon = await createCouponInDB({
      code: body.code.toUpperCase(),
      discount_type: body.discount_type,
      discount_value: body.discount_value,
      min_order_value: body.min_order_value || null,
      max_uses: body.max_uses || null,
      expires_at: body.expires_at || null,
      active: true,
    });

    return NextResponse.json({ data: coupon }, { status: 201 });
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

export async function PATCH(request: Request) {
  try {
    await requireSmsAuthorization(request);
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Coupon ID required' },
        { status: 400 }
      );
    }

    const coupon = await updateCouponInDB(body.id, body.updates);
    return NextResponse.json({ data: coupon });
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

export async function DELETE(request: Request) {
  try {
    await requireSmsAuthorization(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Coupon ID required' },
        { status: 400 }
      );
    }

    await deleteCouponInDB(id);
    return NextResponse.json({ success: true });
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
