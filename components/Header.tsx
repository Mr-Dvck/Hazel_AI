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

  // Dynamic theme configuration for fully harmonized header elements & backlights
  const getThemeConfig = () => {
    switch (profile.vibeTheme) {
      case 'neon-red':
      case 'sunset-violet':
        return {
          primaryHex: '#ff0033',
          accentHex: '#dc2626',
          heartClass: 'text-red-500 fill-red-500 drop-shadow-[0_0_10px_rgba(255,0,51,0.9)]',
          statusHover: 'hover:border-red-500/70 hover:shadow-[0_0_28px_rgba(255,0,51,0.6)]',
          statusShadow: 'shadow-[0_0_18px_rgba(255,0,51,0.25)]',
          statusTextHighlight: 'group-hover:text-red-300',
          vibeBtnStyle: 'text-red-100 border-red-500/60 bg-red-950/60 hover:bg-red-900/70 shadow-[0_0_20px_rgba(255,0,51,0.5)] hover:shadow-[0_0_28px_rgba(255,0,51,0.8)]',
          profilePill: 'text-red-100 hover:text-white bg-red-950/80 hover:bg-red-900/90 border-red-500/70 hover:border-red-400 shadow-[0_0_24px_rgba(255,0,51,0.65)] hover:shadow-[0_0_36px_rgba(255,0,51,0.95)]',
          logoGlow: 'shadow-[0_0_24px_rgba(255,0,51,0.6)] group-hover:shadow-[0_0_36px_rgba(255,0,51,0.9)]',
          logoGradient: 'from-red-600 via-rose-600 to-amber-600',
          logoIcon: 'text-red-400',
        };
      case 'electric-blue':
      case 'cyber-blue':
        return {
          primaryHex: '#00f0ff',
          accentHex: '#00b4ff',
          heartClass: 'text-cyan-400 fill-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.9)]',
          statusHover: 'hover:border-cyan-400/70 hover:shadow-[0_0_28px_rgba(0,240,255,0.6)]',
          statusShadow: 'shadow-[0_0_18px_rgba(0,240,255,0.25)]',
          statusTextHighlight: 'group-hover:text-cyan-300',
          vibeBtnStyle: 'text-cyan-100 border-cyan-400/60 bg-cyan-950/60 hover:bg-cyan-900/70 shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:shadow-[0_0_28px_rgba(0,240,255,0.8)]',
          profilePill: 'text-cyan-100 hover:text-white bg-cyan-950/80 hover:bg-cyan-900/90 border-cyan-400/70 hover:border-cyan-300 shadow-[0_0_24px_rgba(0,240,255,0.65)] hover:shadow-[0_0_36px_rgba(0,240,255,0.95)]',
          logoGlow: 'shadow-[0_0_24px_rgba(0,240,255,0.6)] group-hover:shadow-[0_0_36px_rgba(0,240,255,0.9)]',
          logoGradient: 'from-cyan-500 via-blue-600 to-indigo-500',
          logoIcon: 'text-cyan-400',
        };
      case 'neon-yellow':
      case 'cosmic-emerald':
        return {
          primaryHex: '#ffe600',
          accentHex: '#eab308',
          heartClass: 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(255,230,0,0.9)]',
          statusHover: 'hover:border-yellow-400/70 hover:shadow-[0_0_28px_rgba(255,230,0,0.6)]',
          statusShadow: 'shadow-[0_0_18px_rgba(255,230,0,0.25)]',
          statusTextHighlight: 'group-hover:text-yellow-300',
          vibeBtnStyle: 'text-yellow-100 border-yellow-400/60 bg-yellow-950/60 hover:bg-yellow-900/70 shadow-[0_0_20px_rgba(255,230,0,0.5)] hover:shadow-[0_0_28px_rgba(255,230,0,0.8)]',
          profilePill: 'text-yellow-100 hover:text-white bg-yellow-950/80 hover:bg-yellow-900/90 border-yellow-400/70 hover:border-yellow-300 shadow-[0_0_24px_rgba(255,230,0,0.65)] hover:shadow-[0_0_36px_rgba(255,230,0,0.95)]',
          logoGlow: 'shadow-[0_0_24px_rgba(255,230,0,0.6)] group-hover:shadow-[0_0_36px_rgba(255,230,0,0.85)]',
          logoGradient: 'from-yellow-400 via-amber-500 to-orange-500',
          logoIcon: 'text-yellow-400',
        };
      case 'neon-pink':
      case 'cyber-pink':
      default:
        return {
          primaryHex: '#ff2a9d',
          accentHex: '#ff1493',
          heartClass: 'text-pink-400 fill-pink-400 drop-shadow-[0_0_10px_rgba(255,42,157,0.9)]',
          statusHover: 'hover:border-pink-500/70 hover:shadow-[0_0_28px_rgba(255,42,157,0.6)]',
          statusShadow: 'shadow-[0_0_18px_rgba(255,42,157,0.25)]',
          statusTextHighlight: 'group-hover:text-pink-300',
          vibeBtnStyle: 'text-pink-100 border-pink-500/60 bg-pink-950/60 hover:bg-pink-900/70 shadow-[0_0_20px_rgba(255,42,157,0.5)] hover:shadow-[0_0_28px_rgba(255,42,157,0.8)]',
          profilePill: 'text-pink-100 hover:text-white bg-pink-950/80 hover:bg-pink-900/90 border-pink-500/70 hover:border-pink-400 shadow-[0_0_24px_rgba(255,42,157,0.65)] hover:shadow-[0_0_36px_rgba(255,42,157,0.95)]',
          logoGlow: 'shadow-[0_0_24px_rgba(255,42,157,0.6)] group-hover:shadow-[0_0_36px_rgba(255,42,157,0.9)]',
          logoGradient: 'from-purple-600 via-pink-500 to-cyan-400',
          logoIcon: 'text-pink-400',
        };
    }
  };

  const themeCfg = getThemeConfig();

  return (
    <header className="relative z-30 w-full px-4 py-2 sm:px-6 flex items-center justify-between border-b border-white/10 bg-black/60 backdrop-blur-xl">
      {/* Zone 1 (Left): Brand logo with dynamic aura & stealth 5-click Guardian easter egg */}
      <div className="flex-1 flex items-center justify-start min-w-0">
        <button
          onClick={handleLogoClick}
          title="Hazel_AI"
          className="group flex items-center gap-3 p-1 -m-1 rounded-xl hover:bg-white/5 transition-all focus:outline-none text-left active:scale-[0.98]"
        >
          <div className={`relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr ${themeCfg.logoGradient} p-[1.5px] ${themeCfg.logoGlow} transition-all flex-shrink-0`}>
            <div className="w-full h-full bg-black/90 rounded-[10px] flex items-center justify-center">
              <Sparkles className={`w-4 h-4 ${themeCfg.logoIcon} group-hover:rotate-12 transition-transform duration-300`} />
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

      {/* Zone 2 (Center Command Cluster): Status + Actions closely grouped in a unified glowing cyber dock */}
      <div className="flex-shrink-0 flex items-center justify-end md:justify-center">
        <div className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-full bg-white/[0.04] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          {/* Resilience Status (Clickable to edit profile) */}
          <button
            onClick={onOpenProfile}
            title="Edit Profile & Companion"
            className={`hidden md:flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/15 rounded-full px-3.5 py-1.5 backdrop-blur-md transition-all text-left group ${themeCfg.statusShadow} ${themeCfg.statusHover}`}
          >
            <div className="flex items-center gap-1.5 text-xs text-gray-300">
              <Heart className={`w-3.5 h-3.5 animate-pulse ${themeCfg.heartClass}`} />
              <span>
                <span className="hidden xl:inline">Companion: </span>
                <strong className={`text-white ${themeCfg.statusTextHighlight} transition-colors`}>
                  {profile.companionName || 'Companion'}
                </strong>{' '}
                {profile.companionAvatar || '✨'}
              </span>
            </div>
            <div className="h-3 w-[1px] bg-white/20" />
            <div className="flex items-center gap-1.5 text-xs text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span>
                <span className="hidden xl:inline">Tower: </span>
                <strong className="text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
                  {unlockedMonstersCount}/{totalMonstersCount}
                </strong>{' '}
                <span className="hidden lg:inline">Monsters </span>Awake
              </span>
            </div>
          </button>

          {/* Divider between status and actions on desktop */}
          <div className="hidden md:block h-4 w-[1px] bg-white/20 mx-0.5" />

          {/* Actions: Profile, Vibe, Reset */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Sleek Profile Pill */}
            <button
              onClick={onOpenProfile}
              className={`flex items-center gap-1.5 text-xs font-semibold border px-3 py-1.5 rounded-full transition-all active:scale-95 flex-shrink-0 ${themeCfg.profilePill}`}
              title={`Sanctuary Profile: ${profile.name || 'Hazel'}`}
            >
              <span className="text-sm leading-none flex-shrink-0">{profile.avatarEmoji || '🦄'}</span>
              <span className="max-w-[85px] sm:max-w-[120px] truncate">{profile.name || 'Hazel'}</span>
            </button>

            {/* Vibe Selector */}
            <div className="relative">
              <button
                onClick={() => setShowVibeMenu(!showVibeMenu)}
                className={`flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded-full transition-all flex-shrink-0 ${themeCfg.vibeBtnStyle}`}
                title="Change Sanctuary Vibe"
              >
                <Palette
                  className="w-3.5 h-3.5 drop-shadow-sm"
                  style={{ color: themeCfg.primaryHex }}
                />
                <span className="hidden sm:inline capitalize font-medium">
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

            {/* Clean Icon Button for Chat Reset */}
            <button
              onClick={onClearChat}
              className="w-8 h-8 rounded-full text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/35 transition-all flex items-center justify-center active:scale-95 shadow-[0_0_12px_rgba(255,255,255,0.1)] hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] flex-shrink-0"
              title="Clear Chat (Reset All available in Profile)"
              aria-label="Clear Chat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Zone 3 (Right): Symmetrical flex-1 balancer on desktop so Zone 2 is perfectly centered */}
      <div className="hidden md:flex flex-1 min-w-0 justify-end" aria-hidden="true" />
    </header>
  );
};

