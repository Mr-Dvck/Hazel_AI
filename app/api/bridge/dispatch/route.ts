import { NextRequest, NextResponse } from 'next/server';
import { BridgeStorage } from '@/lib/bridge-storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, mood = 'open', category = 'feeling', senderName = 'Hazel' } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { success: false, error: 'Note text cannot be empty' },
        { status: 400 }
      );
    }

    const note = BridgeStorage.addNote({
      sender: 'hazel',
      senderName,
      text,
      category,
      mood,
    });

    return NextResponse.json({
      success: true,
      note,
      message: "Note dispatched to Tim's computer successfully!",
    });
  } catch (error: any) {
    console.error('Error in /api/bridge/dispatch POST:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to dispatch note' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const markReadId = searchParams.get('markRead');

    if (markReadId) {
      BridgeStorage.markNoteRead(markReadId);
    }

    const notes = BridgeStorage.getNotes({ unreadOnly, limit });

    return NextResponse.json({
      success: true,
      notes,
      total: notes.length,
    });
  } catch (error: any) {
    console.error('Error in /api/bridge/dispatch GET:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}
