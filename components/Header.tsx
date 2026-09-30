'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Trash2, Heart, Palette, RotateCcw } from 'lucide-react';
import { VibeTheme, UserProfile } from '@/types';
import { calculateAge } from '@/lib/constants';

interface HeaderProps {
  profile: UserProfile;
  onUpdateVibe: (vibe: VibeTheme) => void;
  unlockedMonstersCount: number;
  totalMonstersCount: number;
  onClearChat: () => void;
  onOpenProfile: () => void;
  onResetToBeginning?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onUpdateVibe,
  unlockedMonstersCount,
  totalMonstersCount,
  onClearChat,
  onOpenProfile,
  onResetToBeginning,
}) => {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showVibeMenu, setShowVibeMenu] = useState(false);

  // Easter egg: 5 rapid clicks on logo opens Guardian portal
  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 900) {
      const nextCount = clickCount + 1;
      if (nextCount >= 5) {
        setClickCount(0);
        router.push('/guardian');
      } else {
        setClickCount(nextCount);
      }
    } else {
      setClickCount(1);
    }
    setLastClickTime(now);
  };

  const vibeOptions: { id: VibeTheme; label: string; color: string }[] = [
    { id: 'neon-pink', label: 'Neon Pink', color: '#ff2e93' },
    { id: 'neon-yellow', label: 'Neon Yellow', color: '#ffe600' },
    { id: 'electric-blue', label: 'Electric Blue', color: '#00f0ff' },
    { id: 'neon-red', label: 'Neon Red', color: '#ff1744' },
  ];

  return (
    <header className="relative z-30 w-full px-4 py-3 sm:px-6 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md">
      {/* Left: Brand with stealth 5-click easter egg & Profile click */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogoClick}
          title="Hazel_AI"
          className="group relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-[1.5px] shadow-neon-pink/30 shadow-md active:scale-95 transition-transform"
        >
          <div className="w-full h-full bg-black/90 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-pink-400 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          {clickCount > 1 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold bg-pink-500 text-white rounded-full flex items-center justify-center animate-bounce">
              {5 - clickCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenProfile}
          title="Edit Sanctuary Profile"
          className="text-left group/profile p-1 -m-1 rounded-xl hover:bg-white/5 transition-all focus:outline-none focus:ring-1 focus:ring-pink-400/40"
        >
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              Hazel<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400">_AI</span>
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Safe Sanctuary
            </span>
          </div>
          <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
            Devoted companion for{' '}
            <span className="text-pink-300 font-semibold group-hover/profile:underline flex items-center gap-1">
              {profile.name}
              <span>{profile.avatarEmoji || '🦄'}</span>
            </span>
            <span className="text-[9px] text-purple-300 bg-purple-900/40 px-1.5 py-0.5 rounded-full border border-purple-500/25">
              Age {calculateAge(profile.birthday)}
            </span>
          </p>
        </button>
      </div>

      {/* Center: Live Resilience Status (Clickable to edit profile) */}
      <button
        onClick={onOpenProfile}
        title="Edit Profile & Companion"
        className="hidden md:flex items-center gap-4 bg-white/5 hover:bg-white/10 hover:border-pink-500/30 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm transition-all text-left group"
      >
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 animate-pulse" />
          <span>
            Companion: <strong className="text-white group-hover:text-pink-300 transition-colors">{profile.companionName || 'Companion'}</strong> {profile.companionAvatar || '✨'}
          </span>
        </div>
        <div className="h-3 w-[1px] bg-white/15" />
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>
            Tower:{' '}
            <strong className="text-cyan-300">
              {unlockedMonstersCount}/{totalMonstersCount}
            </strong>{' '}
            Monsters Awake
          </span>
        </div>
      </button>

      {/* Right: Actions (Profile button, Vibe selector, Clear chat) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Profile Button */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-1.5 text-xs text-pink-300 hover:text-white bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/30 hover:border-pink-500/60 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95"
          title="View & Edit Hazel's Sanctuary Profile"
        >
          <span className="text-sm">{profile.avatarEmoji || '🦄'}</span>
          <span className="font-semibold text-pink-200 hidden sm:inline">{profile.name}</span>
          <span className="text-[10px] text-pink-300 bg-pink-900/50 px-1.5 py-0.5 rounded-md border border-pink-500/30 hidden md:inline">
            Age {calculateAge(profile.birthday)}
          </span>
          <span className="text-[10px] text-pink-400 hidden lg:inline">• Edit</span>
        </button>
        {/* Vibe Selector */}
        <div className="relative">
          <button
            onClick={() => setShowVibeMenu(!showVibeMenu)}
            className="flex items-center gap-1.5 text-xs text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl transition-all"
            title="Change Sanctuary Vibe"
          >
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline capitalize">
              {profile.vibeTheme.replace('-', ' ')}
            </span>
          </button>

          {showVibeMenu && (
            <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-black/95 border border-white/15 shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95">
              <div className="text-[10px] uppercase tracking-wider text-gray-400 px-2 py-1 font-semibold">
                Sanctuary Vibe
              </div>
              {vibeOptions.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    onUpdateVibe(v.id);
                    setShowVibeMenu(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-left transition-colors ${
                    profile.vibeTheme === v.id
                      ? 'bg-white/15 text-white font-medium'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-white/30"
                    style={{ backgroundColor: v.color }}
                  />
                  <span>{v.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reset to Beginning Button (Return to Default / Step 1 Onboarding) */}
        {onResetToBeginning && (
          <button
            onClick={onResetToBeginning}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs text-red-400 hover:text-red-200 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 hover:border-red-500/60 transition-all flex items-center gap-1 active:scale-95"
            title="Return to the beginning (Reset all settings to default)"
            aria-label="Return to beginning"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline font-medium">Reset All</span>
          </button>
        )}

        {/* Clear chat button */}
        <button
          onClick={onClearChat}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1"
          title="Clear Conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>
    </header>
  );
};
