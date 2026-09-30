import fs from 'fs';
import path from 'path';
import { BridgeNote, BridgeReply, BridgeState } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const STATE_FILE = path.join(DATA_DIR, 'bridge_state.json');

// In-memory cache for fast responsive API calls
let inMemoryState: BridgeState | null = null;

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('Failed to create data dir:', err);
  }
}

function loadState(): BridgeState {
  if (inMemoryState) return inMemoryState;

  ensureDataDir();
  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = fs.readFileSync(STATE_FILE, 'utf-8');
      inMemoryState = JSON.parse(raw);
      if (inMemoryState) return inMemoryState;
    }
  } catch (err) {
    console.warn('Could not read bridge_state.json, initializing clean state:', err);
  }

  inMemoryState = {
    notes: [],
    replies: [],
    lastUpdated: Date.now(),
  };
  return inMemoryState;
}

function saveState(state: BridgeState): void {
  inMemoryState = state;
  ensureDataDir();
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write bridge_state.json:', err);
  }
}

export const BridgeStorage = {
  getState(): BridgeState {
    return loadState();
  },

  getNotes(options: { unreadOnly?: boolean; limit?: number } = {}): BridgeNote[] {
    const state = loadState();
    let notes = [...state.notes];
    if (options.unreadOnly) {
      notes = notes.filter((n) => !n.read);
    }
    // Sort descending by timestamp
    notes.sort((a, b) => b.timestamp - a.timestamp);
    if (options.limit && options.limit > 0) {
      notes = notes.slice(0, options.limit);
    }
    return notes;
  },

  addNote(data: {
    sender?: 'hazel' | 'tim' | 'mom';
    senderName?: string;
    text: string;
    category?: 'feeling' | 'comfort' | 'alert' | 'general' | 'artwork';
    mood?: string;
  }): BridgeNote {
    const state = loadState();
    const newNote: BridgeNote = {
      id: `bn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: data.sender || 'hazel',
      senderName: data.senderName || 'Hazel',
      recipient: 'tim_computer',
      text: data.text.trim(),
      category: data.category || 'feeling',
      mood: data.mood || 'vulnerable',
      timestamp: Date.now(),
      read: false,
      replied: false,
    };

    state.notes.unshift(newNote);
    state.lastUpdated = Date.now();
    saveState(state);
    return newNote;
  },

  markNoteRead(id: string): boolean {
    const state = loadState();
    const note = state.notes.find((n) => n.id === id);
    if (note) {
      note.read = true;
      state.lastUpdated = Date.now();
      saveState(state);
      return true;
    }
    return false;
  },

  addReply(data: {
    sender: 'Tim' | 'Mom' | 'Tim & Mom' | string;
    message?: string;
    content?: string;
    noteId?: string;
    reassuranceType?: 'love' | 'courage' | 'safe_harbor' | 'custom' | string;
  }): BridgeReply {
    const state = loadState();

    if (data.noteId) {
      const targetNote = state.notes.find((n) => n.id === data.noteId);
      if (targetNote) {
        targetNote.replied = true;
        targetNote.read = true;
      }
    }

    const text = (data.message || data.content || '').trim();

    const newReply: BridgeReply = {
      id: `br-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      noteId: data.noteId,
      sender: data.sender || 'Tim',
      recipient: 'Hazel',
      message: text,
      content: text,
      timestamp: Date.now(),
      deliveredToHazel: false,
      readByHazel: false,
      reassuranceType: data.reassuranceType || 'love',
    };

    state.replies.unshift(newReply);
    state.lastUpdated = Date.now();
    saveState(state);
    return newReply;
  },

  getUndeliveredReplies(markDelivered: boolean = true): BridgeReply[] {
    const state = loadState();
    const pending = state.replies.filter((r) => !r.deliveredToHazel);

    if (markDelivered && pending.length > 0) {
      pending.forEach((r) => {
        r.deliveredToHazel = true;
      });
      state.lastUpdated = Date.now();
      saveState(state);
    }

    return pending;
  },

  getAllReplies(limit: number = 50): BridgeReply[] {
    const state = loadState();
    const replies = [...state.replies];
    replies.sort((a, b) => b.timestamp - a.timestamp);
    return replies.slice(0, limit);
  },

  markReplyRead(id: string): boolean {
    const state = loadState();
    const reply = state.replies.find((r) => r.id === id);
    if (reply) {
      reply.readByHazel = true;
      state.lastUpdated = Date.now();
      saveState(state);
      return true;
    }
    return false;
  },

  clearAll(): void {
    const clean: BridgeState = {
      notes: [],
      replies: [],
      lastUpdated: Date.now(),
    };
    saveState(clean);
  },
};
