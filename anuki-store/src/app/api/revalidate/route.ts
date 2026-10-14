import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || 'anuki_secret_revalidate_token';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');
  const tag = searchParams.get('tag');

  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path, now: Date.now() });
  }

  if (tag) {
    (revalidateTag as any)(tag, 'max');
    return NextResponse.json({ revalidated: true, tag, now: Date.now() });
  }

  return NextResponse.json({ message: 'Missing path or tag query parameter' }, { status: 400 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { secret, path, tag } = body;

    if (secret !== REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path, now: Date.now() });
    }

    if (tag) {
      (revalidateTag as any)(tag, 'max');
      return NextResponse.json({ revalidated: true, tag, now: Date.now() });
    }

    return NextResponse.json({ message: 'Missing path or tag in request body' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error revalidating', error: error?.message }, { status: 500 });
  }
}
