import { NextRequest, NextResponse } from 'next/server';
import { BridgeStorage } from '@/lib/bridge-storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const state = BridgeStorage.getState();
    const notes = state.notes;
    const replies = state.replies;

    const unreadNotesCount = notes.filter((n) => !n.read).length;
    const pendingRepliesCount = replies.filter((r) => !r.deliveredToHazel).length;

    return NextResponse.json({
      success: true,
      status: 'active',
      summary: {
        totalNotes: notes.length,
        unreadNotes: unreadNotesCount,
        totalReplies: replies.length,
        pendingReplies: pendingRepliesCount,
        lastUpdated: state.lastUpdated,
      },
      latestNote: notes[0] || null,
      latestReply: replies[0] || null,
      notes: notes.slice(0, 20),
      replies: replies.slice(0, 20),
    });
  } catch (error: any) {
    console.error('Error in /api/bridge GET:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get bridge status' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pin = searchParams.get('pin');
    const expectedPin = process.env.GUARDIAN_PIN || '1234';

    if (pin !== expectedPin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized PIN' },
        { status: 401 }
      );
    }

    BridgeStorage.clearAll();
    return NextResponse.json({
      success: true,
      message: 'Bridge notes and replies cleared',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Clear failed' },
      { status: 500 }
    );
  }
}
