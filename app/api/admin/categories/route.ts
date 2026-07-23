import { NextResponse } from 'next/server';
import { requireSmsAuthorization } from '@/lib/auth';
import {
  getCategoriesFromDB,
  createCategoryInDB,
  updateCategoryInDB,
  deleteCategoryInDB,
} from '@/lib/supabase/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const categories = await getCategoriesFromDB();
    return NextResponse.json({ data: categories });
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
        { error: 'Category name required' },
        { status: 400 }
      );
    }

    const category = await createCategoryInDB({
      name: body.name,
      slug: body.slug,
      description: body.description || null,
      image: body.image || '/placeholder.png',
      icon: body.icon || '🛍️',
    });

    return NextResponse.json({ data: category }, { status: 201 });
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
        { error: 'Category ID required' },
        { status: 400 }
      );
    }

    const category = await updateCategoryInDB(body.id, body.updates);
    return NextResponse.json({ data: category });
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
        { error: 'Category ID required' },
        { status: 400 }
      );
    }

    await deleteCategoryInDB(id);
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
