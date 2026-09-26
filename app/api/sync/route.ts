import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// In-memory / server state cache for active sessions
const serverStateCache = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = 'hazel_default', profile, monsters, memories, guardianInsight } = body;

    const payload = {
      profile,
      monsters,
      memories,
      guardianInsight,
      syncedAt: Date.now(),
    };

    serverStateCache.set(userId, payload);

    return NextResponse.json({
      success: true,
      syncedAt: payload.syncedAt,
      message: 'State synchronized successfully across devices',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Sync failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || 'hazel_default';

  const cached = serverStateCache.get(userId);
  if (!cached) {
    return NextResponse.json({
      success: true,
      found: false,
      message: 'No server-side snapshot found for this user',
    });
  }

  return NextResponse.json({
    success: true,
    found: true,
    data: cached,
  });
}
