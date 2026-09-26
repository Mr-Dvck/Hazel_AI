'use client';

import React, { useState } from 'react';
import { UserProfile, VibeTheme, MemoryItem } from '@/types';
import { Sparkles, Heart, Palette, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (
    updatedProfile: Partial<UserProfile>,
    initialMemories: Omit<MemoryItem, 'id' | 'timestamp'>[]
  ) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('Hazel');
  const [companionName, setCompanionName] = useState('Sparky');
  const [vibeTheme, setVibeTheme] = useState<VibeTheme>('cyber-pink');
  const [favorite1, setFavorite1] = useState('Drawing cute dragons and reading mystery books');
  const [favorite2, setFavorite2] = useState('Hot cocoa with marshmallows on cozy rainy days');
  const [favorite3, setFavorite3] = useState('My plushies and designing secret kingdoms');

  if (!isOpen) return null;

  const vibeOptions: { id: VibeTheme; label: string; desc: string; color: string; border: string }[] = [
    {
      id: 'cyber-pink',
      label: 'Neon Cyber-Pink',
      desc: 'Warm electric magenta & glowing neon violet',
      color: '#ff2e93',
      border: 'border-pink-500',
    },
    {
      id: 'cyber-blue',
      label: 'Electric Cyber-Blue',
      desc: 'Deep oceanic cyan & starlit cobalt',
      color: '#00f0ff',
      border: 'border-cyan-400',
    },
    {
      id: 'cosmic-emerald',
      label: 'Cosmic Emerald',
      desc: 'Lush magical forest greens & sparkling mint',
      color: '#10b981',
      border: 'border-emerald-400',
    },
    {
      id: 'sunset-violet',
      label: 'Sunset Violet',
      desc: 'Golden ember sunsets & twilight amethyst',
      color: '#a855f7',
      border: 'border-purple-400',
    },
  ];

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#ff2e93', '#00f0ff', '#facc15', '#a855f7'],
    });

    const memories: Omit<MemoryItem, 'id' | 'timestamp'>[] = [
      {
        category: 'favorites',
        title: 'Creative Passion',
        detail: favorite1 || 'Loves drawing and reading',
        color: '#f472b6',
      },
      {
        category: 'safeHarbor',
        title: 'Cozy Comfort',
        detail: favorite2 || 'Hot cocoa and cozy quiet time',
        color: '#a855f7',
      },
      {
        category: 'dreams',
        title: 'Secret World & Projects',
        detail: favorite3 || 'Inventing secret kingdoms and creature designs',
        color: '#fbbf24',
      },
    ];

    onComplete(
      {
        name: name.trim() || 'Hazel',
        companionName: companionName.trim() || 'Sparky',
        vibeTheme,
        isOnboarded: true,
      },
      memories
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-obsidian-900 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Neon Ambient Header Glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-pink-600/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-cyan-600/20 blur-3xl pointer-events-none" />

        {/* Stepper Dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === s
                  ? 'w-8 bg-gradient-to-r from-pink-500 to-cyan-400'
                  : step > s
                  ? 'w-2 bg-emerald-400'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Names */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-pink-400 fill-pink-400/30" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Welcome to Hazel_AI
              </h2>
              <p className="text-xs text-gray-300 mt-1 max-w-sm mx-auto">
                A warm, 100% judgment-free private sanctuary built just for you.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  What should I call you?
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Hazel"
                  className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/20 text-sm text-white focus:outline-none focus:border-pink-500 shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  What would you like to name your AI Companion?
                </label>
                <input
                  type="text"
                  value={companionName}
                  onChange={(e) => setCompanionName(e.target.value)}
                  placeholder="Sparky (or Lumina, Pip, Astra...)"
                  className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/20 text-sm text-white focus:outline-none focus:border-cyan-400 shadow-inner"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:opacity-95 flex items-center justify-center gap-2 shadow-neon-pink"
            >
              <span>Next: Pick Your Sanctuary Vibe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Sanctuary Vibe */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                <Palette className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Pick Your Sanctuary Vibe
              </h2>
              <p className="text-xs text-gray-300 mt-1">
                Choose the ambient glowing theme that makes you feel most inspired and relaxed.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {vibeOptions.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVibeTheme(v.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    vibeTheme === v.id
                      ? `bg-white/15 ${v.border} shadow-lg scale-[1.02]`
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-white/40"
                      style={{ backgroundColor: v.color }}
                    />
                    <span className="text-xs font-bold text-white">{v.label}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">{v.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-5 rounded-2xl text-xs font-semibold text-gray-400 bg-white/5 hover:bg-white/10"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-pink-500 hover:opacity-95 flex items-center justify-center gap-2 shadow-neon-cyan"
              >
                <span>Next: 3 Things You Love</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Tell me 3 things you love */}
        {step === 3 && (
          <form onSubmit={handleFinish} className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Tell Me 3 Things You Love
              </h2>
              <p className="text-xs text-gray-300 mt-1">
                This populates your Memory Bank so I will always remember what makes you shine!
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-pink-300 mb-1">
                  1. A creative passion or hobby you adore
                </label>
                <input
                  type="text"
                  value={favorite1}
                  onChange={(e) => setFavorite1(e.target.value)}
                  placeholder="e.g. Drawing imaginary dragons, reading fantasy books..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-black/60 border border-white/20 text-xs text-white focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-purple-300 mb-1">
                  2. A cozy comfort that relaxes you
                </label>
                <input
                  type="text"
                  value={favorite2}
                  onChange={(e) => setFavorite2(e.target.value)}
                  placeholder="e.g. Hot cocoa with tiny marshmallows, warm blanket..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-black/60 border border-white/20 text-xs text-white focus:outline-none focus:border-purple-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-300 mb-1">
                  3. A secret dream or fun project
                </label>
                <input
                  type="text"
                  value={favorite3}
                  onChange={(e) => setFavorite3(e.target.value)}
                  placeholder="e.g. Designing a video game, building a treehouse..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-black/60 border border-white/20 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center gap-3">
              <span className="text-xl">☁️</span>
              <p className="text-[11px] text-purple-200">
                Completing this awakens your Tier 1 Monster:{' '}
                <strong className="text-white">Pufflet (Cozy Cloud Puff)</strong>!
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-5 rounded-2xl text-xs font-semibold text-gray-400 bg-white/5 hover:bg-white/10"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-pink-400 via-amber-300 to-cyan-300 hover:opacity-95 flex items-center justify-center gap-2 shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>Enter Sanctuary & Awaken Pufflet</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
