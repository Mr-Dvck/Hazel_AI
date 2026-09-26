import { NextRequest, NextResponse } from 'next/server';
import { BridgeStorage } from '@/lib/bridge-storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sender = 'Tim',
      message,
      noteId,
      reassuranceType = 'love',
    } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Reply message cannot be empty' },
        { status: 400 }
      );
    }

    const reply = BridgeStorage.addReply({
      sender,
      message,
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
    const getAll = searchParams.get('all') === 'true';

    if (markReadId) {
      BridgeStorage.markReplyRead(markReadId);
    }

    if (poll) {
      // Return new replies awaiting delivery to Hazel's chat screen
      const replies = BridgeStorage.getUndeliveredReplies(markDelivered);
      return NextResponse.json({
        success: true,
        replies,
        count: replies.length,
      });
    }

    if (getAll) {
      const replies = BridgeStorage.getAllReplies();
      return NextResponse.json({
        success: true,
        replies,
        total: replies.length,
      });
    }

    // Default: return undelivered replies without marking delivered unless requested
    const replies = BridgeStorage.getUndeliveredReplies(markDelivered);
    return NextResponse.json({
      success: true,
      replies,
      count: replies.length,
    });
  } catch (error: any) {
    console.error('Error in /api/bridge/reply GET:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}
