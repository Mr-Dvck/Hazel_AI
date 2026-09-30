'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Heart, Palette, RotateCcw } from 'lucide-react';
import { VibeTheme, UserProfile } from '@/types';

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
    { id: 'neon-pink', label: 'Neon Pink', color: '#ff2a9d' },
    { id: 'neon-yellow', label: 'Neon Yellow', color: '#ffe600' },
    { id: 'electric-blue', label: 'Electric Blue', color: '#00f0ff' },
    { id: 'neon-red', label: 'Neon Red', color: '#ff0033' },
  ];

  // Helper for theme-aware dynamic profile pill backlights
  const getProfilePillStyle = () => {
    switch (profile.vibeTheme) {
      case 'neon-red':
      case 'sunset-violet':
        return 'text-red-200 hover:text-white bg-red-950/70 hover:bg-red-900/80 border-red-500/60 hover:border-red-400 shadow-[0_0_22px_rgba(255,0,51,0.55)] hover:shadow-[0_0_32px_rgba(255,0,51,0.85)]';
      case 'electric-blue':
      case 'cyber-blue':
        return 'text-cyan-200 hover:text-white bg-cyan-950/70 hover:bg-cyan-900/80 border-cyan-400/60 hover:border-cyan-300 shadow-[0_0_22px_rgba(0,240,255,0.55)] hover:shadow-[0_0_32px_rgba(0,240,255,0.85)]';
      case 'neon-yellow':
      case 'cosmic-emerald':
        return 'text-yellow-200 hover:text-white bg-yellow-950/70 hover:bg-yellow-900/80 border-yellow-400/60 hover:border-yellow-300 shadow-[0_0_22px_rgba(255,230,0,0.55)] hover:shadow-[0_0_32px_rgba(255,230,0,0.85)]';
      case 'neon-pink':
      case 'cyber-pink':
      default:
        return 'text-pink-200 hover:text-white bg-pink-950/70 hover:bg-pink-900/80 border-pink-500/60 hover:border-pink-400 shadow-[0_0_22px_rgba(255,42,157,0.55)] hover:shadow-[0_0_32px_rgba(255,42,157,0.85)]';
    }
  };

  const getThemePaletteColor = () => {
    switch (profile.vibeTheme) {
      case 'neon-red':
      case 'sunset-violet':
        return '#ff0033';
      case 'electric-blue':
      case 'cyber-blue':
        return '#00f0ff';
      case 'neon-yellow':
      case 'cosmic-emerald':
        return '#ffe600';
      case 'neon-pink':
      case 'cyber-pink':
      default:
        return '#ff2a9d';
    }
  };

  return (
    <header className="relative z-30 w-full px-4 py-2.5 sm:px-6 flex items-center justify-between border-b border-white/10 bg-black/50 backdrop-blur-xl">
      {/* Left: Punchy brand logo with subtle Sanctuary tag & stealth 5-click Guardian easter egg */}
      <div className="flex items-center min-w-0 md:min-w-[200px] flex-shrink-0">
        <button
          onClick={handleLogoClick}
          title="Hazel_AI"
          className="group flex items-center gap-3 p-1 -m-1 rounded-xl hover:bg-white/5 transition-all focus:outline-none text-left active:scale-[0.98]"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-[1.5px] shadow-[0_0_18px_rgba(255,42,157,0.5)] group-hover:shadow-[0_0_28px_rgba(255,42,157,0.85)] transition-all flex-shrink-0">
            <div className="w-full h-full bg-black/90 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-pink-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            {clickCount > 1 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold bg-pink-500 text-white rounded-full flex items-center justify-center animate-bounce shadow-neon-pink">
                {5 - clickCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
              Hazel<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400">_AI</span>
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.3)] tracking-wide">
              Sanctuary
            </span>
          </div>
        </button>
      </div>

      {/* Center Command Cluster: Live Resilience Status + Action Controls closely grouped */}
      <div className="flex items-center justify-end md:justify-center gap-2 sm:gap-2.5 md:gap-3 flex-1 md:flex-initial mx-auto">
        {/* Center: Live Resilience Status (Clickable to edit profile) */}
        <button
          onClick={onOpenProfile}
          title="Edit Profile & Companion"
          className="hidden md:flex items-center gap-3.5 bg-white/5 hover:bg-white/10 hover:border-pink-500/50 border border-white/15 rounded-full px-4 py-1.5 backdrop-blur-md transition-all text-left group shadow-[0_0_18px_rgba(255,42,157,0.2)] hover:shadow-[0_0_26px_rgba(255,42,157,0.45)]"
        >
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 animate-pulse drop-shadow-[0_0_8px_rgba(255,42,157,0.8)]" />
            <span>
              Companion: <strong className="text-white group-hover:text-pink-300 transition-colors">{profile.companionName || 'Companion'}</strong> {profile.companionAvatar || '✨'}
            </span>
          </div>
          <div className="h-3 w-[1px] bg-white/20" />
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span>
              Tower:{' '}
              <strong className="text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
                {unlockedMonstersCount}/{totalMonstersCount}
              </strong>{' '}
              Monsters Awake
            </span>
          </div>
        </button>

        {/* Subtle connector separator between status and actions on desktop */}
        <div className="hidden md:block h-4 w-[1px] bg-white/20 mx-0.5" />

        {/* Actions (Sleek Profile Pill, Vibe selector, Clean Chat Reset) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Sleek Profile Pill */}
          <button
            onClick={onOpenProfile}
            className={`flex items-center gap-1.5 text-xs font-semibold border px-3 py-1.5 rounded-full transition-all active:scale-95 flex-shrink-0 ${getProfilePillStyle()}`}
            title={`Sanctuary Profile: ${profile.name || 'Hazel'}`}
          >
            <span className="text-sm leading-none flex-shrink-0">{profile.avatarEmoji || '🦄'}</span>
            <span className="max-w-[90px] sm:max-w-[130px] truncate">{profile.name || 'Hazel'}</span>
          </button>

          {/* Vibe Selector */}
          <div className="relative">
            <button
              onClick={() => setShowVibeMenu(!showVibeMenu)}
              className="flex items-center gap-1.5 text-xs text-gray-200 bg-white/10 hover:bg-white/15 hover:border-white/30 border border-white/15 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all shadow-[0_0_16px_rgba(255,255,255,0.12)] hover:shadow-[0_0_22px_rgba(255,255,255,0.25)] flex-shrink-0"
              title="Change Sanctuary Vibe"
            >
              <Palette
                className="w-3.5 h-3.5 drop-shadow-sm"
                style={{ color: getThemePaletteColor() }}
              />
              <span className="hidden sm:inline capitalize">
                {profile.vibeTheme.replace('-', ' ')}
              </span>
            </button>

            {showVibeMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowVibeMenu(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-black/95 border border-white/20 shadow-[0_0_35px_rgba(0,0,0,0.85),0_0_20px_rgba(255,255,255,0.15)] p-2 z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95">
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
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-left transition-all ${
                        profile.vibeTheme === v.id
                          ? 'bg-white/20 text-white font-medium shadow-sm'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/40"
                        style={{
                          backgroundColor: v.color,
                          boxShadow: `0 0 10px ${v.color}`,
                        }}
                      />
                      <span>{v.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Clean Icon Button for Chat Reset (Reset All / Start Over tucked into Profile modal) */}
          <button
            onClick={onClearChat}
            className="p-2 sm:p-2.5 min-w-[36px] min-h-[36px] rounded-xl text-gray-300 hover:text-white bg-white/10 hover:bg-white/15 hover:border-white/30 border border-white/15 transition-all flex items-center justify-center active:scale-95 shadow-[0_0_16px_rgba(255,255,255,0.12)] hover:shadow-[0_0_22px_rgba(255,255,255,0.25)] flex-shrink-0"
            title="Clear Chat (Reset All available in Profile)"
            aria-label="Clear Chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right balance spacer on desktop so the center command cluster remains truly centered */}
      <div className="hidden md:flex min-w-[200px] justify-end" aria-hidden="true" />
    </header>
  );
};

