'use client';

import React from 'react';
import { Lock } from 'lucide-react';

interface MonsterSvgProps {
  id: number;
  unlocked: boolean;
  className?: string;
  size?: number;
}

export const MonsterSvg: React.FC<MonsterSvgProps> = ({
  id,
  unlocked,
  className = '',
  size = 64,
}) => {
  if (!unlocked) {
    return (
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-black/60 border border-white/10 overflow-hidden shadow-inner ${className}`}
        style={{ width: size, height: size }}
      >
        {/* Mysterious locked silhouette */}
        <div className="absolute inset-0 flex items-center justify-center opacity-25 filter blur-[1px]">
          {renderSilhouette(id)}
        </div>
        {/* Glow lock icon */}
        <div className="relative z-10 flex flex-col items-center justify-center text-gray-400">
          <div className="p-1.5 rounded-full bg-black/80 border border-white/20 shadow-neon-purple/20">
            <Lock className="w-4 h-4 text-purple-400/80 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center transition-transform hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      {renderMonster(id)}
    </div>
  );
};

function renderMonster(id: number) {
  switch (id) {
    case 1:
      // Pufflet: Cozy cloud puff with rosy cheeks
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(167,139,250,0.6)]">
          <defs>
            <linearGradient id="puffletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ede9fe" />
              <stop offset="50%" stopColor="#ddd6fe" />
              <stop offset="100%" stopColor="#c4b5fd" />
            </linearGradient>
            <radialGradient id="rosyCheek" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Cloud body */}
          <g className="animate-float">
            <path
              d="M 28 65 C 18 65 14 55 20 45 C 16 35 28 25 38 30 C 44 20 62 20 68 30 C 78 25 88 35 84 45 C 92 55 86 65 76 65 Z"
              fill="url(#puffletGrad)"
              stroke="#a78bfa"
              strokeWidth="2.5"
            />
            {/* Eyes */}
            <circle cx="42" cy="46" r="3.5" fill="#312e81" />
            <circle cx="62" cy="46" r="3.5" fill="#312e81" />
            <circle cx="43" cy="45" r="1.2" fill="#ffffff" />
            <circle cx="63" cy="45" r="1.2" fill="#ffffff" />
            {/* Rosy Cheeks */}
            <circle cx="34" cy="51" r="5" fill="url(#rosyCheek)" />
            <circle cx="70" cy="51" r="5" fill="url(#rosyCheek)" />
            {/* Happy Smile */}
            <path d="M 49 51 Q 52 56 55 51" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Floating sparkle */}
            <circle cx="78" cy="28" r="2" fill="#f472b6" className="animate-ping" />
          </g>
        </svg>
      );

    case 2:
      // Bramble: Curious mossy sprout
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]">
          <defs>
            <linearGradient id="sproutGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Sprout body/moss ball */}
            <circle cx="50" cy="58" r="24" fill="url(#sproutGrad)" stroke="#059669" strokeWidth="2.5" />
            {/* Sprout leaves on top */}
            <path d="M 50 35 C 42 22 30 26 36 38 C 42 42 48 37 50 35 Z" fill="url(#leafGrad)" stroke="#047857" strokeWidth="2" />
            <path d="M 50 35 C 58 20 72 24 66 38 C 60 42 52 37 50 35 Z" fill="url(#leafGrad)" stroke="#047857" strokeWidth="2" />
            <circle cx="50" cy="35" r="3" fill="#34d399" />
            {/* Dewdrop Eyes */}
            <circle cx="43" cy="56" r="3.5" fill="#064e3b" />
            <circle cx="59" cy="56" r="3.5" fill="#064e3b" />
            <circle cx="44" cy="55" r="1.3" fill="#d1fae5" />
            <circle cx="60" cy="55" r="1.3" fill="#d1fae5" />
            {/* Soft curious mouth :o */}
            <circle cx="51" cy="64" r="2.2" fill="#064e3b" />
            {/* Tiny blush dots */}
            <circle cx="36" cy="60" r="3" fill="#fb7185" opacity="0.6" />
            <circle cx="66" cy="60" r="3" fill="#fb7185" opacity="0.6" />
          </g>
        </svg>
      );

    case 3:
      // Glimmer: Glowing star sprite
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(250,204,21,0.7)]">
          <defs>
            <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* 5-pointed star body */}
            <polygon
              points="50,15 59,38 84,39 63,54 71,78 50,63 29,78 37,54 16,39 41,38"
              fill="url(#starGrad)"
              stroke="#ca8a04"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Cute twinkling eyes */}
            <circle cx="45" cy="48" r="3.5" fill="#713f12" />
            <circle cx="55" cy="48" r="3.5" fill="#713f12" />
            <circle cx="46" cy="47" r="1.4" fill="#ffffff" />
            <circle cx="56" cy="47" r="1.4" fill="#ffffff" />
            {/* Cheerful mouth */}
            <path d="M 47 54 Q 50 58 53 54" stroke="#713f12" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Stardust glow sparkles */}
            <polygon points="50,2 52,8 58,10 52,12 50,18 48,12 42,10 48,8" fill="#ffffff" opacity="0.8" />
          </g>
        </svg>
      );

    case 4:
      // Bumble-Bop: Friendly horned jelly
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_14px_rgba(34,211,238,0.7)]">
          <defs>
            <linearGradient id="jellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Cute mini horn antennae */}
            <path d="M 38 32 C 34 22 28 24 32 36" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="30" cy="23" r="3.5" fill="#a5f3fc" />
            <path d="M 62 32 C 66 22 72 24 68 36" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="70" cy="23" r="3.5" fill="#a5f3fc" />
            {/* Jelly dome body */}
            <path
              d="M 24 66 C 22 42 36 32 50 32 C 64 32 78 42 76 66 C 72 72 66 67 60 71 C 54 67 46 67 40 71 C 34 67 28 72 24 66 Z"
              fill="url(#jellyGrad)"
              stroke="#0891b2"
              strokeWidth="2.5"
            />
            {/* Big bubbly eyes */}
            <circle cx="42" cy="50" r="4" fill="#164e63" />
            <circle cx="58" cy="50" r="4" fill="#164e63" />
            <circle cx="43" cy="49" r="1.5" fill="#ffffff" />
            <circle cx="59" cy="49" r="1.5" fill="#ffffff" />
            <path d="M 47 57 Q 50 62 53 57" stroke="#164e63" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      );

    case 5:
      // Echo: Neon crystal bat
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(192,132,252,0.7)]">
          <defs>
            <linearGradient id="batGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e9d5ff" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>
            <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#4c1d95" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Crystal wings */}
            <polygon points="12,38 32,45 28,68 18,52" fill="url(#wingGrad)" stroke="#c084fc" strokeWidth="1.5" />
            <polygon points="88,38 68,45 72,68 82,52" fill="url(#wingGrad)" stroke="#c084fc" strokeWidth="1.5" />
            {/* Bat body */}
            <ellipse cx="50" cy="55" rx="16" ry="18" fill="url(#batGrad)" stroke="#6b21a8" strokeWidth="2.5" />
            {/* Pointy crystal ears */}
            <polygon points="40,40 44,22 48,38" fill="#c084fc" stroke="#6b21a8" strokeWidth="2" />
            <polygon points="60,40 56,22 52,38" fill="#c084fc" stroke="#6b21a8" strokeWidth="2" />
            {/* Glowing violet eyes */}
            <circle cx="44" cy="52" r="3.5" fill="#fdf4ff" />
            <circle cx="56" cy="52" r="3.5" fill="#fdf4ff" />
            <circle cx="44" cy="52" r="2" fill="#581c87" />
            <circle cx="56" cy="52" r="2" fill="#581c87" />
            {/* Friendly fangs / smile */}
            <path d="M 47 62 Q 50 65 53 62" stroke="#3b0764" strokeWidth="1.5" fill="none" />
            <polygon points="48,62 49,65 50,62" fill="#ffffff" />
            <polygon points="50,62 51,65 52,62" fill="#ffffff" />
          </g>
        </svg>
      );

    case 6:
      // Zephyr: Winged cloud buddy
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(56,189,248,0.7)]">
          <defs>
            <linearGradient id="zephyrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Feather wings */}
            <path d="M 28 48 C 14 36 12 55 26 62 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
            <path d="M 72 48 C 86 36 88 55 74 62 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
            {/* Swirling cloud body */}
            <circle cx="50" cy="52" r="22" fill="url(#zephyrGrad)" stroke="#0284c7" strokeWidth="2.5" />
            {/* Swirling crown curl */}
            <path d="M 48 30 C 50 20 58 24 54 32" stroke="#0284c7" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Bright sky eyes */}
            <ellipse cx="44" cy="50" rx="3.5" ry="4" fill="#0c4a6e" />
            <ellipse cx="56" cy="50" rx="3.5" ry="4" fill="#0c4a6e" />
            <circle cx="45" cy="49" r="1.3" fill="#ffffff" />
            <circle cx="57" cy="49" r="1.3" fill="#ffffff" />
            {/* Wind swirl cheeks */}
            <circle cx="36" cy="55" r="3" fill="#bae6fd" />
            <circle cx="64" cy="55" r="3" fill="#bae6fd" />
            <path d="M 47 57 Q 50 61 53 57" stroke="#0c4a6e" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      );

    case 7:
      // Pyra: Warm fireplace ember creature
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_16px_rgba(251,146,60,0.8)]">
          <defs>
            <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="60%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fde047" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Flame ears */}
            <path d="M 38 42 C 32 20 25 22 34 35 Z" fill="url(#fireGrad)" stroke="#c2410c" strokeWidth="2" />
            <path d="M 62 42 C 68 20 75 22 66 35 Z" fill="url(#fireGrad)" stroke="#c2410c" strokeWidth="2" />
            {/* Cozy ember fox body */}
            <circle cx="50" cy="55" r="22" fill="url(#fireGrad)" stroke="#c2410c" strokeWidth="2.5" />
            {/* Warm ember eyes */}
            <ellipse cx="43" cy="53" rx="3.5" ry="4.5" fill="#431407" />
            <ellipse cx="57" cy="53" rx="3.5" ry="4.5" fill="#431407" />
            <circle cx="44" cy="51" r="1.5" fill="#fef08a" />
            <circle cx="58" cy="51" r="1.5" fill="#fef08a" />
            {/* Fox snout & smile */}
            <polygon points="50,57 48,60 52,60" fill="#431407" />
            <path d="M 47 62 Q 50 64 53 62" stroke="#431407" strokeWidth="1.5" fill="none" />
          </g>
        </svg>
      );

    case 8:
      // Cosmo: Galaxy-eyed mini dragon
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_18px_rgba(236,72,153,0.8)]">
          <defs>
            <linearGradient id="cosmoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="50%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#831843" />
            </linearGradient>
            <linearGradient id="hornGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Tiny cosmic dragon wings */}
            <path d="M 25 50 C 10 32 18 64 30 58 Z" fill="#9d174d" stroke="#f472b6" strokeWidth="1.5" />
            <path d="M 75 50 C 90 32 82 64 70 58 Z" fill="#9d174d" stroke="#f472b6" strokeWidth="1.5" />
            {/* Dragon horns */}
            <polygon points="38,36 34,20 42,32" fill="url(#hornGrad)" stroke="#b45309" strokeWidth="1.5" />
            <polygon points="62,36 66,20 58,32" fill="url(#hornGrad)" stroke="#b45309" strokeWidth="1.5" />
            {/* Dragon head */}
            <circle cx="50" cy="54" r="23" fill="url(#cosmoGrad)" stroke="#9d174d" strokeWidth="2.5" />
            {/* Galaxy sparkling eyes */}
            <circle cx="42" cy="52" r="5" fill="#1e1b4b" />
            <circle cx="58" cy="52" r="5" fill="#1e1b4b" />
            <circle cx="43" cy="50" r="2" fill="#67e8f9" />
            <circle cx="59" cy="50" r="2" fill="#67e8f9" />
            <circle cx="41" cy="53" r="1" fill="#f43f5e" />
            <circle cx="57" cy="53" r="1" fill="#f43f5e" />
            {/* Little dragon snout */}
            <ellipse cx="50" cy="62" rx="7" ry="4" fill="#be185d" />
            <circle cx="48" cy="61" r="1" fill="#831843" />
            <circle cx="52" cy="61" r="1" fill="#831843" />
          </g>
        </svg>
      );

    case 9:
      // Aegis: Armored hug guardian
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_18px_rgba(45,212,191,0.8)]">
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#99f6e4" />
              <stop offset="50%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
            <linearGradient id="goldPlate" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Shield shoulder plates */}
            <polygon points="18,48 30,36 34,60 22,66" fill="url(#shieldGrad)" stroke="#115e59" strokeWidth="2" />
            <polygon points="82,48 70,36 66,60 78,66" fill="url(#shieldGrad)" stroke="#115e59" strokeWidth="2" />
            {/* Guardian Helm & Body */}
            <circle cx="50" cy="52" r="24" fill="url(#shieldGrad)" stroke="#115e59" strokeWidth="2.5" />
            {/* Golden brow crest */}
            <path d="M 32 40 Q 50 32 68 40 L 64 45 Q 50 38 36 45 Z" fill="url(#goldPlate)" stroke="#b45309" strokeWidth="1.5" />
            {/* Calm glowing visor eyes */}
            <ellipse cx="43" cy="51" rx="4" ry="2.5" fill="#ccfbf1" />
            <ellipse cx="57" cy="51" rx="4" ry="2.5" fill="#ccfbf1" />
            <circle cx="43" cy="51" r="1.5" fill="#042f2e" />
            <circle cx="57" cy="51" r="1.5" fill="#042f2e" />
            {/* Unbreakable hug emblem on chest */}
            <path d="M 50 63 L 45 58 C 42 55 46 51 49 53 L 50 54 L 51 53 C 54 51 58 55 55 58 Z" fill="#f43f5e" />
          </g>
        </svg>
      );

    case 10:
      // Solara: Golden crowned sunshine titan
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_22px_rgba(245,158,11,0.9)]">
          <defs>
            <linearGradient id="solaraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="40%" stopColor="#fde047" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <radialGradient id="solarAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g className="animate-float">
            {/* Sun flare burst */}
            <circle cx="50" cy="54" r="32" fill="url(#solarAura)" />
            {/* Crown of Radiance */}
            <polygon points="50,14 43,28 32,18 36,34 50,30 64,34 68,18 57,28" fill="#fef08a" stroke="#b45309" strokeWidth="2" />
            <circle cx="50" cy="14" r="2.5" fill="#ef4444" />
            {/* Sunshine Titan Face */}
            <circle cx="50" cy="54" r="22" fill="url(#solaraGrad)" stroke="#b45309" strokeWidth="2.5" />
            {/* Majestic radiant eyes */}
            <circle cx="43" cy="51" r="4.5" fill="#78350f" />
            <circle cx="57" cy="51" r="4.5" fill="#78350f" />
            <circle cx="44" cy="49" r="2" fill="#ffffff" />
            <circle cx="58" cy="49" r="2" fill="#ffffff" />
            {/* Serene smile */}
            <path d="M 46 60 Q 50 64 54 60" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Golden starlight cheek markings */}
            <polygon points="34,55 37,56 38,59 39,56 42,55 39,54 38,51 37,54" fill="#fbbf24" />
            <polygon points="66,55 63,56 62,59 61,56 58,55 61,54 62,51 63,54" fill="#fbbf24" />
          </g>
        </svg>
      );

    default:
      return null;
  }
}

function renderSilhouette(id: number) {
  const fill = '#4b5563';
  const stroke = '#6b7280';

  switch (id) {
    case 1:
      // Pufflet: cloud puff silhouette
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <path
            d="M 28 65 C 18 65 14 55 20 45 C 16 35 28 25 38 30 C 44 20 62 20 68 30 C 78 25 88 35 84 45 C 92 55 86 65 76 65 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="2"
          />
        </svg>
      );
    case 2:
      // Bramble: moss sprout with leaves silhouette
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <circle cx="50" cy="58" r="24" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M 50 35 C 42 22 30 26 36 38 C 42 42 48 37 50 35 Z" fill={fill} />
          <path d="M 50 35 C 58 20 72 24 66 38 C 60 42 52 37 50 35 Z" fill={fill} />
        </svg>
      );
    case 3:
      // Glimmer: 5-point star sprite silhouette
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <polygon
            points="50,15 59,38 84,39 63,54 71,78 50,63 29,78 37,54 16,39 41,38"
            fill={fill}
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 4:
      // Bumble-Bop: horned jelly dome silhouette
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <path d="M 38 32 C 34 22 28 24 32 36" stroke={stroke} strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="30" cy="23" r="3.5" fill={fill} />
          <path d="M 62 32 C 66 22 72 24 68 36" stroke={stroke} strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="70" cy="23" r="3.5" fill={fill} />
          <path
            d="M 24 66 C 22 42 36 32 50 32 C 64 32 78 42 76 66 C 72 72 66 67 60 71 C 54 67 46 67 40 71 C 34 67 28 72 24 66 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="2"
          />
        </svg>
      );
    case 5:
      // Echo: crystal bat silhouette
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <polygon points="12,38 32,45 28,68 18,52" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <polygon points="88,38 68,45 72,68 82,52" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <ellipse cx="50" cy="55" rx="16" ry="18" fill={fill} stroke={stroke} strokeWidth="2" />
          <polygon points="40,40 44,22 48,38" fill={fill} />
          <polygon points="60,40 56,22 52,38" fill={fill} />
        </svg>
      );
    case 6:
      // Zephyr: winged cloud silhouette
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <path d="M 28 48 C 14 36 12 55 26 62 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path d="M 72 48 C 86 36 88 55 74 62 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <circle cx="50" cy="52" r="22" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M 48 30 C 50 20 58 24 54 32" stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 7:
      // Pyra: ember fox with flame ears silhouette
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <path d="M 38 42 C 32 20 25 22 34 35 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path d="M 62 42 C 68 20 75 22 66 35 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <circle cx="50" cy="55" r="22" fill={fill} stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 8:
      // Cosmo: mini dragon with horns and wings silhouette
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <path d="M 25 50 C 10 32 18 64 30 58 Z" fill={fill} />
          <path d="M 75 50 C 90 32 82 64 70 58 Z" fill={fill} />
          <polygon points="38,36 34,20 42,32" fill={fill} />
          <polygon points="62,36 66,20 58,32" fill={fill} />
          <circle cx="50" cy="54" r="23" fill={fill} stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 9:
      // Aegis: armored guardian helm silhouette
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <polygon points="18,48 30,36 34,60 22,66" fill={fill} />
          <polygon points="82,48 70,36 66,60 78,66" fill={fill} />
          <circle cx="50" cy="52" r="24" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M 32 40 Q 50 32 68 40 L 64 45 Q 50 38 36 45 Z" fill={stroke} />
        </svg>
      );
    case 10:
      // Solara: golden crowned sunshine titan silhouette
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <circle cx="50" cy="54" r="32" fill={fill} opacity="0.4" />
          <polygon points="50,14 43,28 32,18 36,34 50,30 64,34 68,18 57,28" fill={stroke} />
          <circle cx="50" cy="54" r="22" fill={fill} stroke={stroke} strokeWidth="2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
          <circle cx="50" cy="50" r="28" fill={fill} />
        </svg>
      );
  }
}
