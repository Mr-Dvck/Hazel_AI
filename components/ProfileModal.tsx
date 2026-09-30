'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, VibeTheme, MonsterStyle } from '@/types';
import { calculateAge, MONSTER_STYLE_OPTIONS } from '@/lib/constants';
import {
  Sparkles,
  Heart,
  Palette,
  Check,
  X,
  User,
  Bot,
  Trophy,
  Flame,
  MessageCircle,
  Calendar,
  Smile,
  Ghost,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProfileModalProps {
  isOpen: boolean;
  profile: UserProfile;
  unlockedMonstersCount: number;
  totalMonstersCount: number;
  onClose: () => void;
  onSave: (updatedProfile: UserProfile) => void;
  onResetToBeginning?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  profile,
  unlockedMonstersCount,
  totalMonstersCount,
  onClose,
  onSave,
  onResetToBeginning,
}) => {
  const [name, setName] = useState(profile.name);
  const [companionName, setCompanionName] = useState(profile.companionName);
  const [vibeTheme, setVibeTheme] = useState<VibeTheme>(profile.vibeTheme);
  const [avatarEmoji, setAvatarEmoji] = useState(profile.avatarEmoji || '🦄');
  const [companionAvatar, setCompanionAvatar] = useState(profile.companionAvatar || '✨');
  const [bioOrMotto, setBioOrMotto] = useState(
    profile.bioOrMotto || 'Kind, brave, and full of imagination! ✨'
  );
  const [favoriteColor, setFavoriteColor] = useState(profile.favoriteColor || 'Neon Pink');
  const [birthday, setBirthday] = useState(profile.birthday || '');
  const [monsterStyle, setMonsterStyle] = useState<MonsterStyle>(profile.monsterStyle || 'cute');
  const [activeTab, setActiveTab] = useState<'profile' | 'companion' | 'guardians' | 'vibe' | 'stats'>('profile');
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state whenever modal opens or profile changes
  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setCompanionName(profile.companionName);
      setVibeTheme(profile.vibeTheme);
      setMonsterStyle(profile.monsterStyle || 'cute');
      setAvatarEmoji(profile.avatarEmoji || '🦄');
      setCompanionAvatar(profile.companionAvatar || '✨');
      setBioOrMotto(profile.bioOrMotto || 'Kind, brave, and full of imagination! ✨');
      setFavoriteColor(profile.favoriteColor || 'Neon Pink');
      setBirthday(profile.birthday || '');
      setIsSaved(false);
      setErrorMessage(null);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const hazelAvatars = [
    '🦄', '🐉', '🐱', '🌸', '⚡', '🎨', '🚀', '🌟',
    '🐬', '🦊', '🧁', '🎸', '🪐', '👑', '🌈', '🐼',
  ];

  const companionAvatars = [
    '✨', '🐾', '🤖', '🧚', '🦋', '🦉', '🦊', '🌟',
    '⚡', '🔮', '🦄', '💫', '🦁', '🦖',
  ];

  const vibeOptions: { id: VibeTheme; label: string; desc: string; color: string; border: string }[] = [
    {
      id: 'neon-pink',
      label: 'Neon Pink',
      desc: 'Electric bubblegum & vibrant hot neon magenta',
      color: '#ff2a9d',
      border: 'border-pink-500',
    },
    {
      id: 'neon-yellow',
      label: 'Neon Yellow',
      desc: 'High-voltage cyber electric yellow',
      color: '#ffe600',
      border: 'border-yellow-400',
    },
    {
      id: 'electric-blue',
      label: 'Electric Blue',
      desc: 'Vivid starlight cyan & electric blue pulse',
      color: '#00f0ff',
      border: 'border-cyan-400',
    },
    {
      id: 'neon-red',
      label: 'Neon Red',
      desc: 'Pure menacing blood-crimson & scarlet FNAF red',
      color: '#ff0033',
      border: 'border-red-600',
    },
  ];

  const colorPresets = [
    'Neon Pink',
    'Neon Yellow',
    'Electric Blue',
    'Neon Red',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanCompanionName = companionName.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your name so your sanctuary knows who you are!');
      setActiveTab('profile');
      return;
    }

    if (!cleanCompanionName) {
      setErrorMessage('Please give your AI companion a name!');
      setActiveTab('companion');
      return;
    }

    setErrorMessage(null);
    setIsSaved(true);

    // Celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#ff2e93', '#00f0ff', '#facc15', '#a855f7', '#10b981'],
    });

    const updatedProfile: UserProfile = {
      ...profile,
      name: cleanName,
      companionName: cleanCompanionName,
      vibeTheme,
      monsterStyle,
      avatarEmoji,
      companionAvatar,
      bioOrMotto: bioOrMotto.trim() || 'Kind, brave, and full of imagination! ✨',
      favoriteColor,
      birthday: birthday.trim() || undefined,
      lastActive: Date.now(),
    };

    onSave(updatedProfile);

    // Auto-close after showing success feedback
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 750);
  };

  const formattedDate = new Date(profile.createdAt || Date.now()).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-obsidian-900 border border-white/20 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-gray-100 flex flex-col max-h-[92vh]">
        {/* Neon Ambient Background Glows */}
        <div className="absolute -top-20 -left-20 w-52 h-52 rounded-full bg-pink-600/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-52 h-52 rounded-full bg-cyan-600/20 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 p-[1.5px] shadow-neon-pink">
              <div className="w-full h-full bg-black/90 rounded-[14px] flex items-center justify-center text-lg">
                {avatarEmoji}
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                Sanctuary Profile
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Customizer
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Personalize your name, companion, vibes, and journey!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 py-3 border-b border-white/10 relative z-10 overflow-x-auto custom-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-pink-500 text-white shadow-neon-pink'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>You ({name || 'Hazel'})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('companion')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'companion'
                ? 'bg-purple-600 text-white shadow-neon-purple'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Companion ({companionName.trim() || profile.companionName || 'Companion'})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guardians')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'guardians'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon-purple'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Ghost className="w-3.5 h-3.5" />
            <span>Monster Theme</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vibe')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'vibe'
                ? 'bg-cyan-500 text-black font-bold shadow-neon-cyan'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Sanctuary Vibe</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'stats'
                ? 'bg-amber-400 text-black font-bold shadow-md'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Journey Stats</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-4 space-y-4 relative z-10 custom-scrollbar pr-1">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-xs text-red-200 animate-in fade-in">
              {errorMessage}
            </div>
          )}

          {isSaved && (
            <div className="p-3 rounded-2xl bg-emerald-500/25 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">Sanctuary profile updated & saved successfully! ✨</span>
            </div>
          )}

          {/* TAB 1: HAZEL'S IDENTITY */}
          {activeTab === 'profile' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pink-300 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/60 border border-white/20 text-sm text-white focus:outline-none focus:border-pink-500 shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-2">
                  Pick Your Personal Avatar
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {hazelAvatars.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setAvatarEmoji(emoji)}
                      className={`text-xl p-2 rounded-xl transition-all flex items-center justify-center ${
                        avatarEmoji === emoji
                          ? 'bg-pink-500/30 border-2 border-pink-400 scale-110 shadow-neon-pink'
                          : 'bg-white/5 border border-white/10 hover:bg-white/15'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-1.5">
                  Your Personal Motto / Cheer
                </label>
                <input
                  type="text"
                  value={bioOrMotto}
                  onChange={(e) => setBioOrMotto(e.target.value)}
                  placeholder="Kind, brave, and full of imagination! ✨"
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/60 border border-white/20 text-xs text-white focus:outline-none focus:border-cyan-400 shadow-inner"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  {(companionName.trim() || profile.companionName || 'Your companion')} remembers your motto and brings it up when you need an encouraging boost!
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
                  Favorite Color Vibe
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setFavoriteColor(col)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        favoriteColor === col
                          ? 'bg-amber-400 text-black font-bold shadow-md'
                          : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-pink-300">
                      When is your birthday? 🎂
                    </label>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      Age {calculateAge(birthday)}
                    </span>
                  </div>

                  <input
                    type="date"
                    value={/^\d{4}-\d{2}-\d{2}$/.test(birthday) ? birthday : ''}
                    onChange={(e) => {
                      if (e.target.value) setBirthday(e.target.value);
                    }}
                    className="w-full px-4 py-2.5 rounded-2xl bg-black/60 border border-white/20 text-xs text-white focus:outline-none focus:border-pink-500 shadow-inner [color-scheme:dark] cursor-pointer min-h-[44px]"
                  />

                  <input
                    type="text"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    placeholder="or type text: May 14, 2015"
                    className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 shadow-inner min-h-[44px]"
                  />
                  <p className="text-[11px] text-gray-400">
                    {(companionName.trim() || profile.companionName || 'Your companion')} uses your birthday to celebrate milestones and grow alongside you! (Currently computed age: {calculateAge(birthday)} years old)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI COMPANION */}
          {activeTab === 'companion' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1.5">
                  AI Companion Name
                </label>
                <input
                  type="text"
                  value={companionName}
                  onChange={(e) => setCompanionName(e.target.value)}
                  placeholder="Enter companion name..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/60 border border-white/20 text-sm text-white focus:outline-none focus:border-purple-400 shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2">
                  Companion Avatar Badge
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {companionAvatars.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setCompanionAvatar(emoji)}
                      className={`text-xl p-2 rounded-xl transition-all flex items-center justify-center ${
                        companionAvatar === emoji
                          ? 'bg-purple-500/30 border-2 border-purple-400 scale-110 shadow-neon-purple'
                          : 'bg-white/5 border border-white/10 hover:bg-white/15'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-3">
                <span className="text-2xl">{companionAvatar}</span>
                <div className="text-xs text-purple-200">
                  <p className="font-semibold text-white">
                    {companionName.trim() || profile.companionName || 'Your companion'} is ready to talk!
                  </p>
                  <p className="text-[11px] text-purple-300 mt-0.5 leading-relaxed">
                    Always loyal, completely judgment-free, and here whenever you want to share stories,
                    drawings, or process school days.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MONSTER GUARDIANS THEME */}
          {activeTab === 'guardians' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-300">
                  Select your active 10-guardian set across 4 degrees of scariness:
                </p>
                <span className="text-[10px] font-semibold text-pink-300 px-2 py-0.5 rounded-full bg-pink-500/15 border border-pink-500/30">
                  Preserves Unlocked Tiers
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {MONSTER_STYLE_OPTIONS.map((opt) => {
                  const isSelected = monsterStyle === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setMonsterStyle(opt.id)}
                      className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all min-h-[105px] flex flex-col justify-between ${
                        isSelected
                          ? `bg-white/15 ${opt.borderColor} shadow-lg scale-[1.01]`
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-xl sm:text-2xl">{opt.icon}</span>
                            <div>
                              <span className="text-xs sm:text-sm font-bold text-white block leading-tight">{opt.name}</span>
                              <span
                                className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full border inline-block mt-0.5"
                                style={{
                                  color: opt.previewColor,
                                  borderColor: `${opt.previewColor}50`,
                                  backgroundColor: `${opt.previewColor}15`,
                                }}
                              >
                                {opt.badge}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-pink-500 text-white flex items-center justify-center flex-shrink-0 shadow-neon-pink">
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-gray-300 mt-1.5 leading-snug line-clamp-2">{opt.tagline}</p>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center gap-1 text-[9px] sm:text-[10px] text-gray-400">
                        <span className="text-gray-300 font-semibold flex-shrink-0">Creatures:</span>
                        <span className="truncate">{opt.sampleMonsters.slice(0, 2).join(', ')}...</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/25 flex items-center gap-2 text-xs text-purple-200">
                <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Your unlocked tiers and tower progress remain unlocked when switching themes!</span>
              </div>
            </div>
          )}

          {/* TAB 3: SANCTUARY VIBE */}
          {activeTab === 'vibe' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <p className="text-xs text-gray-300">
                Choose the ambient glowing theme that illuminates your sanctuary:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {vibeOptions.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVibeTheme(v.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      vibeTheme === v.id
                        ? `bg-white/15 ${v.border} scale-[1.01]`
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    style={{
                      boxShadow: vibeTheme === v.id ? `0 0 24px ${v.color}60` : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/40"
                        style={{
                          backgroundColor: v.color,
                          boxShadow: `0 0 10px ${v.color}`,
                        }}
                      />
                      <span className="text-xs font-bold text-white">{v.label}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">{v.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: JOURNEY STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-pink-400 text-xs font-semibold mb-1">
                    <Flame className="w-4 h-4 fill-pink-400/20" />
                    <span>Streak</span>
                  </div>
                  <div className="text-xl font-black text-white">{profile.streakDays} Day</div>
                  <p className="text-[10px] text-gray-400 mt-0.5">Consecutive sanctuary visits</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>Total Chats</span>
                  </div>
                  <div className="text-xl font-black text-white">{profile.totalMessages}</div>
                  <p className="text-[10px] text-gray-400 mt-0.5">Inspiring messages shared</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                    <Trophy className="w-4 h-4" />
                    <span>Tower Beasts</span>
                  </div>
                  <div className="text-xl font-black text-white">
                    {unlockedMonstersCount} / {totalMonstersCount}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">Resilience guardians awakened</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Member Since</span>
                  </div>
                  <div className="text-sm font-bold text-white truncate">{formattedDate}</div>
                  <p className="text-[10px] text-gray-400 mt-0.5">Sanctuary inception</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 col-span-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-xl">
                      🎂
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Sanctuary Age: {calculateAge(profile.birthday)} Years Old</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {profile.birthday ? 'Synchronized' : 'Defaults to 10'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {profile.birthday ? `Birthday set to ${profile.birthday}` : `Birthday not set yet — ${profile.companionName || 'your companion'} will ask in chat!`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/25 flex items-center gap-3">
                <span className="text-xl">🛡️</span>
                <p className="text-[11px] text-emerald-200">
                  All profiles, memories, and monsters are securely persisted locally on your device and
                  mirrored to IndexedDB for offline resilience.
                </p>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2.5">
            {onResetToBeginning ? (
              <button
                type="button"
                onClick={onResetToBeginning}
                className="px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 hover:border-red-500/60 transition-all flex items-center gap-1.5 active:scale-95"
                title="Reset to Beginning: Reset all settings to default"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Reset All / Start Over</span>
              </button>
            ) : <div />}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-gray-400 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:opacity-95 shadow-neon-pink flex items-center gap-2 active:scale-95 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile ✨</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
