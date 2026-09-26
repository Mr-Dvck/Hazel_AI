'use client';

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  ChatMessage,
  Monster,
  MemoryItem,
  VibeTheme,
} from '@/types';
import { Storage } from '@/lib/storage';
import { calculateAge, detectBirthdayFromText } from '@/lib/constants';
import { DynamicNeonBackground } from '@/components/DynamicNeonBackground';
import { Header } from '@/components/Header';
import { MonsterTower } from '@/components/MonsterTower';
import { ChatStage } from '@/components/ChatStage';
import { MemoryBank } from '@/components/MemoryBank';
import { OnboardingModal } from '@/components/OnboardingModal';
import { MonsterDetailModal } from '@/components/MonsterDetailModal';
import { ProfileModal } from '@/components/ProfileModal';
import confetti from 'canvas-confetti';
import { Trophy, MessageSquare, Bookmark } from 'lucide-react';

export default function HomePage() {
  const [profile, setProfile] = useState<UserProfile>(Storage.getProfile());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [monsters, setMonsters] = useState<Monster[]>(Storage.getMonsters());
  const [memories, setMemories] = useState<MemoryItem[]>(Storage.getMemories());

  const [streamingMessage, setStreamingMessage] = useState<ChatMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Mobile active tab ('tower' | 'chat' | 'memory')
  const [mobileTab, setMobileTab] = useState<'tower' | 'chat' | 'memory'>('chat');

  // Load state on mount
  useEffect(() => {
    const loadedProfile = Storage.getProfile();
    const loadedMessages = Storage.getMessages();
    let loadedMonsters = Storage.getMonsters();
    if (loadedProfile.monsterStyle) {
      loadedMonsters = Storage.setMonsterStyle(loadedProfile.monsterStyle);
    }
    const loadedMemories = Storage.getMemories();

    setProfile(loadedProfile);
    setMessages(loadedMessages);
    setMonsters(loadedMonsters);
    setMemories(loadedMemories);

    if (!loadedProfile.isOnboarded) {
      setShowOnboarding(true);
    }
  }, []);

  // Update Vibe Theme
  const handleUpdateVibe = (newVibe: VibeTheme) => {
    const updated = { ...profile, vibeTheme: newVibe };
    setProfile(updated);
    Storage.setProfile(updated);
  };

  // Save/Update Profile Handler (Name, companion, avatar, motto, vibe, monsterStyle)
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    Storage.setProfile(updatedProfile);
    if (updatedProfile.monsterStyle) {
      const updatedMonsters = Storage.setMonsterStyle(updatedProfile.monsterStyle);
      setMonsters(updatedMonsters);
    }
    Storage.syncToServer();
  };

  // Background guardian safety evaluation pass (non-intrusive, silent)
  const runBackgroundGuardianEvaluation = async (msgs: ChatMessage[]) => {
    try {
      const res = await fetch('/api/guardian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze', pin: '1234', messages: msgs }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.insight) {
          Storage.setGuardianInsight(data.insight);
          Storage.syncToServer();
        }
      }
    } catch (e) {
      // Non-blocking silent background pass
    }
  };

  // Periodic poll for warm glowing notes from Tim & Mom's Guardian Desk
  useEffect(() => {
    const pollBridgeReplies = async () => {
      try {
        const res = await fetch('/api/bridge/reply?poll=1&markDelivered=true');
        if (res.ok) {
          const data = await res.json();
          if (data.replies && data.replies.length > 0) {
            setMessages((prev) => {
              const existingIds = new Set(prev.map((m) => m.id));
              const newItems: ChatMessage[] = data.replies
                .filter((r: any) => !existingIds.has(r.id))
                .map((r: any) => ({
                  id: r.id,
                  role: 'assistant' as const,
                  content: r.message,
                  timestamp: r.timestamp,
                  bridgeReply: r,
                }));
              if (newItems.length === 0) return prev;
              const next = [...prev, ...newItems];
              Storage.setMessages(next);

              // Celebration confetti for receiving loving reassurance from Dad & Mom!
              confetti({
                particleCount: 80,
                spread: 75,
                origin: { y: 0.6 },
                colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981'],
              });
              return next;
            });
          }
        }
      } catch (err) {
        // Non-blocking
      }
    };

    const interval = setInterval(pollBridgeReplies, 3000);
    return () => clearInterval(interval);
  }, []);

  // Dispatch note from Hazel to Tim's desk
  const handleDispatchBridgeNote = async (text: string) => {
    try {
      const res = await fetch('/api/bridge/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          senderName: profile.name || 'Hazel',
          mood: 'sharing',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const noteMsg: ChatMessage = {
          id: `msg-${Date.now()}-bridge-sent`,
          role: 'user',
          content: `💌 Note to Tim's Computer: "${text}"`,
          timestamp: Date.now(),
          bridgeNote: data.note,
        };
        const updated = [...messages, noteMsg];
        setMessages(updated);
        Storage.setMessages(updated);
        return true;
      }
    } catch (err) {
      console.error('Failed to dispatch bridge note:', err);
    }
    return false;
  };

  // Complete Onboarding
  const handleCompleteOnboarding = (
    updatedFields: Partial<UserProfile>,
    initialMemories: Omit<MemoryItem, 'id' | 'timestamp'>[]
  ) => {
    const updatedProfile: UserProfile = {
      ...profile,
      ...updatedFields,
      isOnboarded: true,
      lastActive: Date.now(),
    };
    setProfile(updatedProfile);
    Storage.setProfile(updatedProfile);

    // Apply selected monster style and unlock Tier 1 of that style
    const selectedStyle = updatedFields.monsterStyle || 'spooky';
    Storage.setMonsterStyle(selectedStyle);
    const updatedMonsters = Storage.unlockMonster(1);
    setMonsters(updatedMonsters);

    // Add initial memories
    let currentMems = Storage.getMemories();
    initialMemories.forEach((mem) => {
      currentMems = Storage.addMemory(mem);
    });
    setMemories(currentMems);

    // Celebration: Confetti directly into main interface (no popup modal)
    confetti({
      particleCount: 90,
      spread: 85,
      origin: { y: 0.5 },
      colors: ['#a78bfa', '#ff2e93', '#00f0ff', '#facc15', '#ef4444'],
    });

    // Directly enter main sanctuary interface without automatic monster reveal celebration modal
    setShowOnboarding(false);
  };

  // Check for newly unlocked monsters based on message count
  const checkMonsterUnlocks = (currentMessageCount: number, currentMonsters: Monster[]) => {
    let newlyUnlocked: Monster | null = null;
    const updatedList = currentMonsters.map((m) => {
      if (!m.unlocked && currentMessageCount >= m.requiredMessages) {
        newlyUnlocked = { ...m, unlocked: true, unlockedAt: Date.now() };
        return newlyUnlocked;
      }
      return m;
    });

    if (newlyUnlocked) {
      setMonsters(updatedList);
      Storage.setMonsters(updatedList);

      // Trigger celebration
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: [(newlyUnlocked as Monster).color, '#ff2e93', '#00f0ff', '#fde047'],
      });

      setSelectedMonster(newlyUnlocked);
    }
  };

  // Send message and stream response
  const handleSendMessage = async (text: string, images: string[] = []) => {
    if ((!text.trim() && images.length === 0) || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      images: images.length > 0 ? images : undefined,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    Storage.setMessages(nextMessages);

    // Check if message text mentions birthday
    const birthdayMention = detectBirthdayFromText(text);
    const nextMsgCount = profile.totalMessages + 1;
    let updatedProf: UserProfile = { ...profile, totalMessages: nextMsgCount, lastActive: Date.now() };

    if (birthdayMention) {
      const alreadySaved = memories.some(
        (m) => m.category === 'favorites' && m.title.toLowerCase().includes('birthday')
      );
      if (!alreadySaved) {
        const newMemory = {
          category: 'favorites' as const,
          title: 'Birthday Celebration 🎂',
          detail: `Hazel's birthday: ${birthdayMention}! A special milestone to celebrate every year.`,
          color: '#f59e0b',
        };
        const updatedMems = Storage.addMemory(newMemory);
        setMemories(updatedMems);
      }
      if (!profile.birthday || profile.birthday !== birthdayMention) {
        updatedProf.birthday = birthdayMention;
      }
    }

    setProfile(updatedProf);
    Storage.setProfile(updatedProf);

    // Check unlocks
    checkMonsterUnlocks(nextMsgCount, monsters);

    // Run non-intrusive background guardian evaluation pass
    runBackgroundGuardianEvaluation(nextMessages);

    setIsLoading(true);

    const assistantMsgId = `msg-${Date.now()}-assistant`;
    setStreamingMessage({
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages,
          images: images,
          profile: updatedProf,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to start chat stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedContent = '';
      let accumulatedThinking = '';
      let modelUsed = '';
      let guardianTag: any = undefined;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const payload = trimmed.slice(6);
          if (payload === '[DONE]') continue;

          try {
            const data = JSON.parse(payload);
            if (data.type === 'meta') {
              modelUsed = data.model;
              if (data.guardianAlert?.tag !== 'safe') {
                guardianTag = data.guardianAlert.tag;
              }
              if (data.detectedBirthday) {
                const bday = data.detectedBirthday;
                const alreadySaved = Storage.getMemories().some(
                  (m) => m.category === 'favorites' && m.title.toLowerCase().includes('birthday')
                );
                if (!alreadySaved) {
                  const newMemory = {
                    category: 'favorites' as const,
                    title: 'Birthday Celebration 🎂',
                    detail: `Hazel's birthday: ${bday}! A special milestone to celebrate every year.`,
                    color: '#f59e0b',
                  };
                  const updatedMems = Storage.addMemory(newMemory);
                  setMemories(updatedMems);
                }
                const curProf = Storage.getProfile();
                if (!curProf.birthday || curProf.birthday !== bday) {
                  const updatedWithBday = {
                    ...curProf,
                    birthday: bday,
                    lastActive: Date.now(),
                  };
                  setProfile(updatedWithBday);
                  Storage.setProfile(updatedWithBday);
                  Storage.syncToServer();
                }
              }
            } else if (data.type === 'thinking') {
              accumulatedThinking += data.chunk;
            } else if (data.type === 'content') {
              accumulatedContent += data.chunk;
            }

            setStreamingMessage({
              id: assistantMsgId,
              role: 'assistant',
              content: accumulatedContent,
              thinking: accumulatedThinking || undefined,
              modelUsed: modelUsed || undefined,
              timestamp: Date.now(),
              isStreaming: true,
            });
          } catch (e) {
            // Ignore parse errors on partial frames
          }
        }
      }

      // Finalize assistant message
      const finalAssistantMessage: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: accumulatedContent || "I'm always here for you, Hazel!",
        thinking: accumulatedThinking || undefined,
        modelUsed: modelUsed || undefined,
        guardianTag: guardianTag,
        timestamp: Date.now(),
        isStreaming: false,
      };

      const finalMessages = [...nextMessages, finalAssistantMessage];
      setMessages(finalMessages);
      Storage.setMessages(finalMessages);
      setStreamingMessage(null);
    } catch (error) {
      console.error('Chat stream error:', error);
      const errorMessage: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: `I'm right here with you, Hazel! Whatever happened today, you are completely safe and worthy. Take a gentle breath. Let's make something creative or talk about your favorite things! 💖`,
        timestamp: Date.now(),
        isStreaming: false,
      };
      const finalMessages = [...nextMessages, errorMessage];
      setMessages(finalMessages);
      Storage.setMessages(finalMessages);
      setStreamingMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear Chat Handler
  const handleClearChat = () => {
    if (window.confirm('Would you like to clear the current chat history? Your memories and unlocked monsters will be safely preserved.')) {
      setMessages([]);
      Storage.setMessages([]);
    }
  };

  // Add Memory Handler
  const handleAddMemory = (memory: Omit<MemoryItem, 'id' | 'timestamp'>) => {
    const updated = Storage.addMemory(memory);
    setMemories(updated);
  };

  // Delete Memory Handler
  const handleDeleteMemory = (id: string) => {
    const updated = Storage.deleteMemory(id);
    setMemories(updated);
  };

  const unlockedCount = monsters.filter((m) => m.unlocked).length;

  return (
    <div className="relative h-[100dvh] min-h-[100dvh] flex flex-col overflow-hidden text-gray-100 pb-[env(safe-area-inset-bottom)]">
      {/* Dynamic Background */}
      <DynamicNeonBackground theme={profile.vibeTheme} />

      {/* Main Header */}
      <Header
        profile={profile}
        onUpdateVibe={handleUpdateVibe}
        unlockedMonstersCount={unlockedCount}
        totalMonstersCount={monsters.length}
        onClearChat={handleClearChat}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      {/* Mobile Tab Switcher (Large touch targets & glowing thumb-accessible tabs) */}
      <div className="md:hidden relative z-20 flex items-center justify-around border-b border-white/10 bg-black/80 backdrop-blur-lg px-2 py-1.5 shadow-lg">
        <button
          onClick={() => setMobileTab('tower')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl min-h-[44px] text-xs font-bold transition-all ${
            mobileTab === 'tower'
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Tower ({unlockedCount})</span>
        </button>

        <button
          onClick={() => setMobileTab('chat')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl min-h-[44px] text-xs font-bold transition-all mx-1.5 ${
            mobileTab === 'chat'
              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-[0_0_15px_rgba(255,46,147,0.3)]'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-pink-400" />
          <span>Chat Stage</span>
        </button>

        <button
          onClick={() => setMobileTab('memory')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl min-h-[44px] text-xs font-bold transition-all ${
            mobileTab === 'memory'
              ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Bookmark className="w-4 h-4 text-cyan-400" />
          <span>Memories ({memories.length})</span>
        </button>
      </div>

      {/* 3-Column Sleek Neon Layout Stage */}
      <main className="relative z-10 flex-1 w-full max-w-[1700px] mx-auto p-2 sm:p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 md:gap-5 min-h-0 overflow-hidden">
        {/* Left Column: Monster Milestone Tower */}
        <div
          className={`md:col-span-3 lg:col-span-3 h-[calc(100dvh-130px)] md:h-[calc(100vh-100px)] ${
            mobileTab === 'tower' ? 'block' : 'hidden md:block'
          }`}
        >
          <MonsterTower
            monsters={monsters}
            totalMessages={profile.totalMessages}
            onSelectMonster={(m) => setSelectedMonster(m)}
          />
        </div>

        {/* Center Column: Main Chat Stage */}
        <div
          className={`md:col-span-6 lg:col-span-6 h-[calc(100dvh-130px)] md:h-[calc(100vh-100px)] ${
            mobileTab === 'chat' ? 'block' : 'hidden md:block'
          }`}
        >
          <ChatStage
            messages={messages}
            streamingMessage={streamingMessage}
            profile={profile}
            onSendMessage={handleSendMessage}
            onDispatchBridgeNote={handleDispatchBridgeNote}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column: Persistent Memory Bank */}
        <div
          className={`md:col-span-3 lg:col-span-3 h-[calc(100dvh-130px)] md:h-[calc(100vh-100px)] ${
            mobileTab === 'memory' ? 'block' : 'hidden md:block'
          }`}
        >
          <MemoryBank
            memories={memories}
            onAddMemory={handleAddMemory}
            onDeleteMemory={handleDeleteMemory}
          />
        </div>
      </main>

      {/* Onboarding Setup Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleCompleteOnboarding}
      />

      {/* Profile Edit & Customization Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        profile={profile}
        unlockedMonstersCount={unlockedCount}
        totalMonstersCount={monsters.length}
        onClose={() => setShowProfileModal(false)}
        onSave={handleSaveProfile}
      />

      {/* Monster Details & Celebration Modal */}
      <MonsterDetailModal
        monster={selectedMonster}
        onClose={() => setSelectedMonster(null)}
      />
    </div>
  );
}
