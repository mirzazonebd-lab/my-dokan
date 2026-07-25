import { NextResponse } from 'next/server';
import { requireSmsAuthorization } from '@/lib/auth';
import {
  getProductsFromDB,
  createProductInDB,
  updateProductInDB,
  deleteProductInDB,
} from '@/lib/supabase/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const products = await getProductsFromDB();
    return NextResponse.json({ data: products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireSmsAuthorization(request);
    const body = await request.json();

    if (!body.name || !body.price || body.stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const product = await createProductInDB({
      name: body.name,
      slug: body.slug,
      price: body.price,
      stock: body.stock,
      description: body.description || null,
      category: body.category || null,
      brand: body.brand || null,
      image: body.image || '/placeholder.png',
      badge: body.badge || null,
      featured: body.featured || false,
      active: true,
    });

    return NextResponse.json({ data: product }, { status: 201 });
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
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const product = await updateProductInDB(body.id, body.updates);
    return NextResponse.json({ data: product });
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
        { error: 'Product ID required' },
        { status: 400 }
      );
    }

    await deleteProductInDB(id);
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
