import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), 'data');
const SYNC_FILE = path.join(DATA_DIR, 'sync_state.json');

// In-memory / server state cache for active sessions
const serverStateCache = new Map<string, any>();

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // Non-fatal
  }
}

function loadDiskCache() {
  try {
    ensureDataDir();
    if (fs.existsSync(SYNC_FILE)) {
      const raw = fs.readFileSync(SYNC_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        Object.entries(parsed).forEach(([uid, val]) => {
          serverStateCache.set(uid, val);
        });
      }
    }
  } catch (err) {
    // Non-fatal
  }
}

function saveDiskCache() {
  try {
    ensureDataDir();
    const obj: Record<string, any> = {};
    serverStateCache.forEach((v, k) => {
      obj[k] = v;
    });
    fs.writeFileSync(SYNC_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    // Non-fatal
  }
}

// Initial load
loadDiskCache();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = 'hazel_default', profile, monsters, memories, guardianInsight, messages } = body;

    const payload = {
      profile,
      monsters,
      memories,
      guardianInsight,
      messages,
      syncedAt: Date.now(),
    };

    serverStateCache.set(userId, payload);
    saveDiskCache();

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

  if (!serverStateCache.has(userId)) {
    loadDiskCache();
  }

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
