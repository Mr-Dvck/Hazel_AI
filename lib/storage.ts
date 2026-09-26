import { ChatMessage, Monster, MemoryItem, UserProfile, GuardianInsight, MonsterStyle } from '@/types';
import { INITIAL_MONSTERS, INITIAL_PROFILE, INITIAL_MEMORIES, INITIAL_GUARDIAN_INSIGHT, getMonstersByStyle } from './constants';

const STORAGE_KEYS = {
  PROFILE: 'hazel_profile_v1',
  MESSAGES: 'hazel_messages_v1',
  MONSTERS: 'hazel_monsters_v1',
  MEMORIES: 'hazel_memories_v1',
  GUARDIAN: 'hazel_guardian_insights_v1',
};

// IndexedDB dual-persistence layer
const DB_NAME = 'hazel_ai_db';
const STORE_NAME = 'hazel_state';

function openDb(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function setIndexedDbItem(key: string, value: any): Promise<void> {
  const db = await openDb();
  if (!db) return;
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(value, key);
  } catch (e) {
    // Non-blocking
  }
}

// Safe localStorage wrapper with IndexedDB mirroring
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (e) {
    console.warn(`Error reading key ${key} from localStorage:`, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Mirror to IndexedDB for resilient multi-layer persistence
    setIndexedDbItem(key, value);
  } catch (e) {
    console.warn(`Error saving key ${key} to localStorage:`, e);
  }
}

export const Storage = {
  getProfile: (): UserProfile => getItem<UserProfile>(STORAGE_KEYS.PROFILE, INITIAL_PROFILE),
  setProfile: (profile: UserProfile): void => setItem(STORAGE_KEYS.PROFILE, profile),
  updateProfile: (updates: Partial<UserProfile>): UserProfile => {
    const current = Storage.getProfile();
    const updated: UserProfile = {
      ...current,
      ...updates,
      lastActive: Date.now(),
    };
    Storage.setProfile(updated);
    return updated;
  },

  syncToServer: async (userId: string = 'hazel_default'): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          profile: Storage.getProfile(),
          monsters: Storage.getMonsters(),
          memories: Storage.getMemories(),
          guardianInsight: Storage.getGuardianInsight(),
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  getMessages: (): ChatMessage[] => getItem<ChatMessage[]>(STORAGE_KEYS.MESSAGES, []),
  setMessages: (messages: ChatMessage[]): void => setItem(STORAGE_KEYS.MESSAGES, messages),
  addMessage: (message: ChatMessage): ChatMessage[] => {
    const current = Storage.getMessages();
    const updated = [...current, message];
    Storage.setMessages(updated);
    return updated;
  },

  getMonsters: (): Monster[] => getItem<Monster[]>(STORAGE_KEYS.MONSTERS, INITIAL_MONSTERS),
  setMonsters: (monsters: Monster[]): void => setItem(STORAGE_KEYS.MONSTERS, monsters),
  unlockMonster: (id: number): Monster[] => {
    const monsters = Storage.getMonsters();
    const updated = monsters.map((m) =>
      m.id === id ? { ...m, unlocked: true, unlockedAt: Date.now() } : m
    );
    Storage.setMonsters(updated);
    return updated;
  },
  setMonsterStyle: (style: MonsterStyle): Monster[] => {
    const currentMonsters = Storage.getMonsters();
    const updated = getMonstersByStyle(style, currentMonsters);
    Storage.setMonsters(updated);
    const profile = Storage.getProfile();
    Storage.setProfile({ ...profile, monsterStyle: style, lastActive: Date.now() });
    return updated;
  },

  getMemories: (): MemoryItem[] => getItem<MemoryItem[]>(STORAGE_KEYS.MEMORIES, INITIAL_MEMORIES),
  setMemories: (memories: MemoryItem[]): void => setItem(STORAGE_KEYS.MEMORIES, memories),
  addMemory: (memory: Omit<MemoryItem, 'id' | 'timestamp'>): MemoryItem[] => {
    const memories = Storage.getMemories();
    const newItem: MemoryItem = {
      ...memory,
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };
    const updated = [newItem, ...memories];
    Storage.setMemories(updated);
    return updated;
  },
  deleteMemory: (id: string): MemoryItem[] => {
    const memories = Storage.getMemories();
    const updated = memories.filter((m) => m.id !== id);
    Storage.setMemories(updated);
    return updated;
  },

  getGuardianInsight: (): GuardianInsight => getItem<GuardianInsight>(STORAGE_KEYS.GUARDIAN, INITIAL_GUARDIAN_INSIGHT),
  setGuardianInsight: (insight: GuardianInsight): void => setItem(STORAGE_KEYS.GUARDIAN, insight),

  clearAllData: (): void => {
    if (typeof window === 'undefined') return;
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.error(e);
    }
  },

  resetToDefault: async (): Promise<void> => {
    if (typeof window === 'undefined') return;
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      const db = await openDb();
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).clear();
      }
    } catch (e) {
      console.error('Error resetting storage to default:', e);
    }
  },
};
