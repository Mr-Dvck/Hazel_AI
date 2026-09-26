export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  thinking?: string;
  modelUsed?: string;
  images?: string[]; // base64 or url
  isStreaming?: boolean;
  guardianTag?: 'safe' | 'mild_alert' | 'moderate_alert' | 'critical_alert';
  guardianReason?: string;
}

export interface Monster {
  id: number;
  name: string;
  tier: number;
  title: string;
  description: string;
  unlockRequirement: string;
  requiredMessages: number;
  unlocked: boolean;
  unlockedAt?: number;
  color: string;
  glowColor: string;
  quote: string;
}

export type MemoryCategory = 'favorites' | 'superpowers' | 'dreams' | 'safeHarbor';

export interface MemoryItem {
  id: string;
  category: MemoryCategory;
  title: string;
  detail: string;
  timestamp: number;
  color?: string;
}

export type VibeTheme = 'cyber-pink' | 'cyber-blue' | 'cosmic-emerald' | 'sunset-violet';

export interface UserProfile {
  name: string;
  companionName: string;
  vibeTheme: VibeTheme;
  isOnboarded: boolean;
  streakDays: number;
  totalMessages: number;
  createdAt: number;
  lastActive: number;
  avatarEmoji?: string;
  companionAvatar?: string;
  bioOrMotto?: string;
  favoriteColor?: string;
  birthday?: string;
}

export interface GuardianIncident {
  id: string;
  timestamp: number;
  category: 'bullying' | 'emotional_isolation' | 'school_distress' | 'self_worth';
  severity: 'Mild' | 'Moderate' | 'Critical';
  snippet: string;
  context: string;
}

export interface GuardianInsight {
  lastUpdated: number;
  bullyingSafetyAlert: {
    severity: 'Safe' | 'Mild' | 'Moderate' | 'Critical';
    headline: string;
    summary: string;
    recentTriggers: GuardianIncident[];
  };
  familySentiment: {
    overallStatus: 'Positive' | 'Receptive' | 'Needs Attention';
    summary: string;
    constructiveInsights: string[];
    whatHazelAppreciates: string[];
  };
  emotionalWeather: {
    currentMood: 'Resilient' | 'Joyful' | 'Thoughtful' | 'Anxious' | 'Withdrawn';
    score: number; // 0 - 100 resilience index
    trend: 'improving' | 'steady' | 'needs_boost';
    description: string;
  };
  actionableSuggestions: {
    category: string;
    conversationStarter: string;
    purpose: string;
  }[];
}
