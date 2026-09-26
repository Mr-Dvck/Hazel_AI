'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Shield, Trash2, Heart, Palette } from 'lucide-react';
import { VibeTheme, UserProfile } from '@/types';

interface HeaderProps {
  profile: UserProfile;
  onUpdateVibe: (vibe: VibeTheme) => void;
  unlockedMonstersCount: number;
  totalMonstersCount: number;
  onClearChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onUpdateVibe,
  unlockedMonstersCount,
  totalMonstersCount,
  onClearChat,
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
    { id: 'cyber-pink', label: 'Cyber Pink', color: '#ff2e93' },
    { id: 'cyber-blue', label: 'Electric Blue', color: '#00f0ff' },
    { id: 'cosmic-emerald', label: 'Cosmic Emerald', color: '#10b981' },
    { id: 'sunset-violet', label: 'Sunset Violet', color: '#a855f7' },
  ];

  return (
    <header className="relative z-30 w-full px-4 py-3 sm:px-6 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md">
      {/* Left: Brand with discrete 5-click Guardian access */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogoClick}
          title="Hazel_AI (Click 5x quickly to open Guardian Portal)"
          className="group flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-purple-400/40 rounded-xl px-2 py-1 -ml-2 transition-all hover:bg-white/5 active:scale-95"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-[1.5px] shadow-neon-pink/30 shadow-md">
            <div className="w-full h-full bg-black/90 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-pink-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            {clickCount > 1 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold bg-pink-500 text-white rounded-full flex items-center justify-center animate-bounce">
                {5 - clickCount}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Hazel<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400">_AI</span>
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Safe Sanctuary
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Devoted companion for <span className="text-pink-300 font-medium">{profile.name}</span>
            </p>
          </div>
        </button>
      </div>

      {/* Center: Live Resilience Status */}
      <div className="hidden md:flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 animate-pulse" />
          <span>
            Companion: <strong className="text-white">{profile.companionName}</strong>
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
      </div>

      {/* Right: Actions (Vibe selector, Clear chat, Discreet Guardian link) */}
      <div className="flex items-center gap-2 sm:gap-3">
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

        {/* Clear chat button */}
        <button
          onClick={onClearChat}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Discreet Guardian Portal Button */}
        <button
          onClick={() => router.push('/guardian')}
          className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-100 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 px-2.5 py-1.5 rounded-xl transition-all"
          title="Guardian Portal (PIN protected)"
        >
          <Shield className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline font-medium">Guardian</span>
        </button>
      </div>
    </header>
  );
};
