import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || 'anuki_secret_revalidate_token';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');
  const tag = searchParams.get('tag');
  const type = searchParams.get('type') as 'page' | 'layout' | null;

  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const results: any = { revalidated: true, now: Date.now() };

  if (path) {
    const paths = path.split(',').map((p) => p.trim()).filter(Boolean);
    for (const p of paths) {
      if (type) {
        revalidatePath(p, type);
      } else {
        revalidatePath(p);
        if (p === '/') {
          revalidatePath('/', 'layout');
        }
      }
    }
    results.paths = paths;
  }

  if (tag) {
    const tags = tag.split(',').map((t) => t.trim()).filter(Boolean);
    for (const t of tags) {
      (revalidateTag as any)(t, 'max');
    }
    results.tags = tags;
  }

  if (!path && !tag) {
    return NextResponse.json({ message: 'Missing path or tag query parameter' }, { status: 400 });
  }

  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { secret, path, paths, tag, tags, type } = body;

    if (secret !== REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const revalidatedPaths: string[] = [];
    const allPaths: string[] = [];
    if (path) allPaths.push(path);
    if (Array.isArray(paths)) allPaths.push(...paths);

    for (const p of allPaths) {
      if (type) {
        revalidatePath(p, type);
      } else {
        revalidatePath(p);
        if (p === '/') {
          revalidatePath('/', 'layout');
        }
      }
      revalidatedPaths.push(p);
    }

    const revalidatedTags: string[] = [];
    const allTags: string[] = [];
    if (tag) allTags.push(tag);
    if (Array.isArray(tags)) allTags.push(...tags);

    for (const t of allTags) {
      (revalidateTag as any)(t, 'max');
      revalidatedTags.push(t);
    }

    return NextResponse.json({
      revalidated: true,
      paths: revalidatedPaths,
      tags: revalidatedTags,
      now: Date.now()
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error revalidating', error: error?.message }, { status: 500 });
  }
}
