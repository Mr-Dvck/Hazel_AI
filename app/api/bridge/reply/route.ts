import { NextRequest, NextResponse } from 'next/server';
import { BridgeStorage } from '@/lib/bridge-storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sender = body.sender || 'Tim';
    const message = (body.message ?? body.content ?? body.text ?? '').toString().trim();
    const noteId = body.noteId;
    const reassuranceType = body.reassuranceType || 'love';

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Reply message or content cannot be empty' },
        { status: 400 }
      );
    }

    const reply = BridgeStorage.addReply({
      sender,
      message,
      content: message,
      noteId,
      reassuranceType,
    });

    return NextResponse.json({
      success: true,
      reply,
      message: "Warm note sent to Hazel's screen!",
    });
  } catch (error: any) {
    console.error('Error in /api/bridge/reply POST:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to send reply' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const poll = searchParams.get('poll') === '1' || searchParams.get('poll') === 'true';
    const markDelivered = searchParams.get('markDelivered') !== 'false';
    const markReadId = searchParams.get('markRead');

    if (markReadId) {
      BridgeStorage.markReplyRead(markReadId);
    }

    if (poll) {
      // Return new replies awaiting delivery to Hazel's chat screen
      const replies = BridgeStorage.getUndeliveredReplies(markDelivered);
      const allReplies = BridgeStorage.getAllReplies();
      const pending = allReplies.filter((r) => !r.deliveredToHazel);
      const delivered = allReplies.filter((r) => r.deliveredToHazel);
      return NextResponse.json({
        success: true,
        replies,
        pending,
        delivered,
        count: replies.length,
        total: allReplies.length,
        pendingCount: pending.length,
        deliveredCount: delivered.length,
      });
    }

    // Return all pending and delivered notes with clean JSON
    const allReplies = BridgeStorage.getAllReplies();
    const pending = allReplies.filter((r) => !r.deliveredToHazel);
    const delivered = allReplies.filter((r) => r.deliveredToHazel);

    return NextResponse.json({
      success: true,
      replies: allReplies,
      pending,
      delivered,
      total: allReplies.length,
      pendingCount: pending.length,
      deliveredCount: delivered.length,
    });
  } catch (error: any) {
    console.error('Error in /api/bridge/reply GET:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}
