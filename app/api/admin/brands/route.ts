import { NextResponse } from 'next/server';
import { requireSmsAuthorization } from '@/lib/auth';
import {
  getBrandsFromDB,
  createBrandInDB,
  updateBrandInDB,
  deleteBrandInDB,
} from '@/lib/supabase/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const brands = await getBrandsFromDB();
    return NextResponse.json({ data: brands });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireSmsAuthorization(request);
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: 'Brand name required' },
        { status: 400 }
      );
    }

    const brand = await createBrandInDB({
      name: body.name,
      slug: body.slug,
      logo: body.logo || '/placeholder.png',
      country: body.country || null,
      description: body.description || null,
      is_korean: body.is_korean || false,
      featured: body.featured || false,
    });

    return NextResponse.json({ data: brand }, { status: 201 });
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
        { error: 'Brand ID required' },
        { status: 400 }
      );
    }

    const brand = await updateBrandInDB(body.id, body.updates);
    return NextResponse.json({ data: brand });
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
        { error: 'Brand ID required' },
        { status: 400 }
      );
    }

    await deleteBrandInDB(id);
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
