import { NextRequest, NextResponse } from 'next/server';
import { GuardianInsight, ChatMessage } from '@/types';
import { INITIAL_GUARDIAN_INSIGHT } from '@/lib/constants';
import {
  synthesizeGuardianInsight,
  saveGuardianInsightToDisk,
  getGuardianInsightFromDisk,
} from '@/lib/guardian-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, pin, messages = [] } = body;

    const expectedPin = process.env.GUARDIAN_PIN || '1234';

    if (pin !== expectedPin) {
      return NextResponse.json(
        { success: false, error: 'Incorrect 4-digit security PIN' },
        { status: 401 }
      );
    }

    if (action === 'verify_pin') {
      return NextResponse.json({ success: true, authorized: true });
    }

    if (action === 'analyze') {
      const updatedInsight = synthesizeGuardianInsight(messages as ChatMessage[]);
      saveGuardianInsightToDisk(updatedInsight, 'hazel_default');
      return NextResponse.json({ success: true, insight: updatedInsight });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    console.error('Guardian API error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const diskInsight = getGuardianInsightFromDisk('hazel_default');
  if (diskInsight) {
    return NextResponse.json({
      success: true,
      insight: diskInsight,
    });
  }
  return NextResponse.json({
    success: true,
    insight: INITIAL_GUARDIAN_INSIGHT,
  });
}
