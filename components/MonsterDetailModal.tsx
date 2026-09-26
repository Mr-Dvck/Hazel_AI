'use client';

import React from 'react';
import { Monster } from '@/types';
import { MonsterSvg } from './monsters/MonsterSvg';
import { X, Sparkles, Lock, CheckCircle2, Quote } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MonsterDetailModalProps {
  monster: Monster | null;
  onClose: () => void;
}

export const MonsterDetailModal: React.FC<MonsterDetailModalProps> = ({
  monster,
  onClose,
}) => {
  if (!monster) return null;

  const triggerCheer = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: [monster.color, '#ffffff', '#f472b6', '#38bdf8'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-obsidian-900 border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden"
        style={{
          boxShadow: monster.unlocked
            ? `0 0 50px -10px ${monster.glowColor}`
            : 'none',
        }}
      >
        {/* Glow ambient background */}
        {monster.unlocked && (
          <div
            className="absolute -top-20 -right-20 w-52 h-52 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: monster.color }}
          />
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Tier Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
            style={{
              backgroundColor: `${monster.color}20`,
              color: monster.color,
              borderColor: `${monster.color}40`,
            }}
          >
            Tier {monster.tier} Guardian
          </span>
          {monster.unlocked ? (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Awakened
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Lock className="w-3.5 h-3.5" /> Locked
            </span>
          )}
        </div>

        {/* Monster Avatar Display */}
        <div className="flex justify-center my-6">
          <div
            className="p-6 rounded-3xl bg-black/50 border border-white/10 relative"
            style={{
              boxShadow: monster.unlocked
                ? `0 0 35px -5px ${monster.glowColor}`
                : 'none',
            }}
          >
            <MonsterSvg id={monster.id} unlocked={monster.unlocked} size={130} />
          </div>
        </div>

        {/* Name & Title */}
        <div className="text-center mb-4">
          <h3 className="text-2xl font-black text-white tracking-tight">
            {monster.name}
          </h3>
          <p className="text-sm text-pink-300 font-medium mt-0.5">
            {monster.title}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-300 text-center leading-relaxed mb-5 px-2">
          {monster.description}
        </p>

        {/* Quote banner */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 mb-5 relative">
          <Quote className="w-4 h-4 text-purple-400/50 absolute top-2.5 left-2.5" />
          <p className="text-xs italic text-purple-200 text-center pl-4 pr-2">
            {monster.quote}
          </p>
        </div>

        {/* Unlock Requirement or Celebrate button */}
        <div className="pt-2">
          {monster.unlocked ? (
            <button
              onClick={triggerCheer}
              className="w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 hover:opacity-95 active:scale-98 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              Celebrate {monster.name}!
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                How to Awaken
              </div>
              <p className="text-xs text-gray-300 mt-1">
                {monster.unlockRequirement}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
