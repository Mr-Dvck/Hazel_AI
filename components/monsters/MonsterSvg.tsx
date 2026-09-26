'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { MonsterStyle } from '@/types';

interface MonsterSvgProps {
  id: number;
  unlocked: boolean;
  className?: string;
  size?: number;
  style?: MonsterStyle;
  monsterStyle?: MonsterStyle;
}

export const MonsterSvg: React.FC<MonsterSvgProps> = ({
  id,
  unlocked,
  className = '',
  size = 64,
  style,
  monsterStyle,
}) => {
  const activeStyle: MonsterStyle = monsterStyle || style || 'cute';

  if (!unlocked) {
    return (
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-black/60 border border-white/10 overflow-hidden shadow-inner ${className}`}
        style={{ width: size, height: size }}
      >
        {/* Mysterious locked silhouette */}
        <div className="absolute inset-0 flex items-center justify-center opacity-25 filter blur-[1px]">
          {renderSilhouette(id, activeStyle)}
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
      {renderMonster(id, activeStyle)}
    </div>
  );
};

function renderMonster(id: number, style: MonsterStyle) {
  switch (style) {
    case 'spooky':
      return renderSpookyMonster(id);
    case 'gothic':
      return renderGothicMonster(id);
    case 'nightmare':
      return renderNightmareMonster(id);
    case 'cute':
    default:
      return renderCuteMonster(id);
  }
}

// -------------------------------------------------------------
// LEVEL 1: COZY & CUTE MONSTERS
// -------------------------------------------------------------
function renderCuteMonster(id: number) {
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
          <g className="animate-float">
            <path
              d="M 28 65 C 18 65 14 55 20 45 C 16 35 28 25 38 30 C 44 20 62 20 68 30 C 78 25 88 35 84 45 C 92 55 86 65 76 65 Z"
              fill="url(#puffletGrad)"
              stroke="#a78bfa"
              strokeWidth="2.5"
            />
            <circle cx="42" cy="46" r="3.5" fill="#312e81" />
            <circle cx="62" cy="46" r="3.5" fill="#312e81" />
            <circle cx="43" cy="45" r="1.2" fill="#ffffff" />
            <circle cx="63" cy="45" r="1.2" fill="#ffffff" />
            <circle cx="34" cy="51" r="5" fill="url(#rosyCheek)" />
            <circle cx="70" cy="51" r="5" fill="url(#rosyCheek)" />
            <path d="M 49 51 Q 52 56 55 51" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" fill="none" />
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
            <circle cx="50" cy="58" r="24" fill="url(#sproutGrad)" stroke="#059669" strokeWidth="2.5" />
            <path d="M 50 35 C 42 22 30 26 36 38 C 42 42 48 37 50 35 Z" fill="url(#leafGrad)" stroke="#047857" strokeWidth="2" />
            <path d="M 50 35 C 58 20 72 24 66 38 C 60 42 52 37 50 35 Z" fill="url(#leafGrad)" stroke="#047857" strokeWidth="2" />
            <circle cx="50" cy="35" r="3" fill="#34d399" />
            <circle cx="43" cy="56" r="3.5" fill="#064e3b" />
            <circle cx="59" cy="56" r="3.5" fill="#064e3b" />
            <circle cx="44" cy="55" r="1.3" fill="#d1fae5" />
            <circle cx="60" cy="55" r="1.3" fill="#d1fae5" />
            <circle cx="51" cy="64" r="2.2" fill="#064e3b" />
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
            <polygon
              points="50,15 59,38 84,39 63,54 71,78 50,63 29,78 37,54 16,39 41,38"
              fill="url(#starGrad)"
              stroke="#ca8a04"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="45" cy="48" r="3.5" fill="#713f12" />
            <circle cx="55" cy="48" r="3.5" fill="#713f12" />
            <circle cx="46" cy="47" r="1.4" fill="#ffffff" />
            <circle cx="56" cy="47" r="1.4" fill="#ffffff" />
            <path d="M 47 54 Q 50 58 53 54" stroke="#713f12" strokeWidth="2" strokeLinecap="round" fill="none" />
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
            <path d="M 38 32 C 34 22 28 24 32 36" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="30" cy="23" r="3.5" fill="#a5f3fc" />
            <path d="M 62 32 C 66 22 72 24 68 36" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="70" cy="23" r="3.5" fill="#a5f3fc" />
            <path
              d="M 24 66 C 22 42 36 32 50 32 C 64 32 78 42 76 66 C 72 72 66 67 60 71 C 54 67 46 67 40 71 C 34 67 28 72 24 66 Z"
              fill="url(#jellyGrad)"
              stroke="#0891b2"
              strokeWidth="2.5"
            />
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
            <polygon points="12,38 32,45 28,68 18,52" fill="url(#wingGrad)" stroke="#c084fc" strokeWidth="1.5" />
            <polygon points="88,38 68,45 72,68 82,52" fill="url(#wingGrad)" stroke="#c084fc" strokeWidth="1.5" />
            <ellipse cx="50" cy="55" rx="16" ry="18" fill="url(#batGrad)" stroke="#6b21a8" strokeWidth="2.5" />
            <polygon points="40,40 44,22 48,38" fill="#c084fc" stroke="#6b21a8" strokeWidth="2" />
            <polygon points="60,40 56,22 52,38" fill="#c084fc" stroke="#6b21a8" strokeWidth="2" />
            <circle cx="44" cy="52" r="3.5" fill="#fdf4ff" />
            <circle cx="56" cy="52" r="3.5" fill="#fdf4ff" />
            <circle cx="44" cy="52" r="2" fill="#581c87" />
            <circle cx="56" cy="52" r="2" fill="#581c87" />
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
            <path d="M 28 48 C 14 36 12 55 26 62 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
            <path d="M 72 48 C 86 36 88 55 74 62 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
            <circle cx="50" cy="52" r="22" fill="url(#zephyrGrad)" stroke="#0284c7" strokeWidth="2.5" />
            <path d="M 48 30 C 50 20 58 24 54 32" stroke="#0284c7" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <ellipse cx="44" cy="50" rx="3.5" ry="4" fill="#0c4a6e" />
            <ellipse cx="56" cy="50" rx="3.5" ry="4" fill="#0c4a6e" />
            <circle cx="45" cy="49" r="1.3" fill="#ffffff" />
            <circle cx="57" cy="49" r="1.3" fill="#ffffff" />
            <circle cx="36" cy="55" r="3" fill="#bae6fd" />
            <circle cx="64" cy="55" r="3" fill="#bae6fd" />
            <path d="M 47 57 Q 50 61 53 57" stroke="#0c4a6e" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      );

    case 7:
      // Pyra: Fireplace ember creature
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
            <path d="M 38 42 C 32 20 25 22 34 35 Z" fill="url(#fireGrad)" stroke="#c2410c" strokeWidth="2" />
            <path d="M 62 42 C 68 20 75 22 66 35 Z" fill="url(#fireGrad)" stroke="#c2410c" strokeWidth="2" />
            <circle cx="50" cy="55" r="22" fill="url(#fireGrad)" stroke="#c2410c" strokeWidth="2.5" />
            <ellipse cx="43" cy="53" rx="3.5" ry="4.5" fill="#431407" />
            <ellipse cx="57" cy="53" rx="3.5" ry="4.5" fill="#431407" />
            <circle cx="44" cy="51" r="1.5" fill="#fef08a" />
            <circle cx="58" cy="51" r="1.5" fill="#fef08a" />
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
            <path d="M 25 50 C 10 32 18 64 30 58 Z" fill="#9d174d" stroke="#f472b6" strokeWidth="1.5" />
            <path d="M 75 50 C 90 32 82 64 70 58 Z" fill="#9d174d" stroke="#f472b6" strokeWidth="1.5" />
            <polygon points="38,36 34,20 42,32" fill="url(#hornGrad)" stroke="#b45309" strokeWidth="1.5" />
            <polygon points="62,36 66,20 58,32" fill="url(#hornGrad)" stroke="#b45309" strokeWidth="1.5" />
            <circle cx="50" cy="54" r="23" fill="url(#cosmoGrad)" stroke="#9d174d" strokeWidth="2.5" />
            <circle cx="42" cy="52" r="5" fill="#1e1b4b" />
            <circle cx="58" cy="52" r="5" fill="#1e1b4b" />
            <circle cx="43" cy="50" r="2" fill="#67e8f9" />
            <circle cx="59" cy="50" r="2" fill="#67e8f9" />
            <circle cx="41" cy="53" r="1" fill="#f43f5e" />
            <circle cx="57" cy="53" r="1" fill="#f43f5e" />
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
            <polygon points="18,48 30,36 34,60 22,66" fill="url(#shieldGrad)" stroke="#115e59" strokeWidth="2" />
            <polygon points="82,48 70,36 66,60 78,66" fill="url(#shieldGrad)" stroke="#115e59" strokeWidth="2" />
            <circle cx="50" cy="52" r="24" fill="url(#shieldGrad)" stroke="#115e59" strokeWidth="2.5" />
            <path d="M 32 40 Q 50 32 68 40 L 64 45 Q 50 38 36 45 Z" fill="url(#goldPlate)" stroke="#b45309" strokeWidth="1.5" />
            <ellipse cx="43" cy="51" rx="4" ry="2.5" fill="#ccfbf1" />
            <ellipse cx="57" cy="51" rx="4" ry="2.5" fill="#ccfbf1" />
            <circle cx="43" cy="51" r="1.5" fill="#042f2e" />
            <circle cx="57" cy="51" r="1.5" fill="#042f2e" />
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
            <circle cx="50" cy="54" r="32" fill="url(#solarAura)" />
            <polygon points="50,14 43,28 32,18 36,34 50,30 64,34 68,18 57,28" fill="#fef08a" stroke="#b45309" strokeWidth="2" />
            <circle cx="50" cy="14" r="2.5" fill="#ef4444" />
            <circle cx="50" cy="54" r="22" fill="url(#solaraGrad)" stroke="#b45309" strokeWidth="2.5" />
            <circle cx="43" cy="51" r="4.5" fill="#78350f" />
            <circle cx="57" cy="51" r="4.5" fill="#78350f" />
            <circle cx="44" cy="49" r="2" fill="#ffffff" />
            <circle cx="58" cy="49" r="2" fill="#ffffff" />
            <path d="M 46 60 Q 50 64 54 60" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <polygon points="34,55 37,56 38,59 39,56 42,55 39,54 38,51 37,54" fill="#fbbf24" />
            <polygon points="66,55 63,56 62,59 61,56 58,55 61,54 62,51 63,54" fill="#fbbf24" />
          </g>
        </svg>
      );

    default:
      return null;
  }
}

// -------------------------------------------------------------
// LEVEL 2: MISCHIEVOUS & SPOOKY MONSTERS
// -------------------------------------------------------------
function renderSpookyMonster(id: number) {
  switch (id) {
    case 1:
      // Gloomy: Grinning shadow imp
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_14px_rgba(249,115,22,0.7)]">
          <defs>
            <linearGradient id="gloomyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="60%" stopColor="#1f2937" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Curved devilish horns */}
            <path d="M 36 38 C 28 20 22 24 28 36" stroke="#f97316" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 64 38 C 72 20 78 24 72 36" stroke="#f97316" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            {/* Imp round shadow body */}
            <ellipse cx="50" cy="56" rx="22" ry="20" fill="url(#gloomyGrad)" stroke="#f97316" strokeWidth="2" />
            {/* Big glowing lilac eyes */}
            <ellipse cx="42" cy="52" rx="4.5" ry="6" fill="#c084fc" />
            <ellipse cx="58" cy="52" rx="4.5" ry="6" fill="#c084fc" />
            <ellipse cx="42" cy="52" rx="2" ry="4" fill="#3b0764" />
            <ellipse cx="58" cy="52" rx="2" ry="4" fill="#3b0764" />
            <circle cx="43" cy="50" r="1.2" fill="#ffffff" />
            <circle cx="59" cy="50" r="1.2" fill="#ffffff" />
            {/* Mischievous grin with tiny fangs */}
            <path d="M 38 64 Q 50 74 62 64" stroke="#f97316" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <polygon points="43,65 45,69 47,65" fill="#ffffff" />
            <polygon points="53,65 55,69 57,65" fill="#ffffff" />
          </g>
        </svg>
      );

    case 2:
      // Thornbite: Bramble Goblin
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_14px_rgba(132,204,22,0.7)]">
          <defs>
            <linearGradient id="goblinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#4d7c0f" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Long pointed goblin ears */}
            <polygon points="32,48 10,40 28,58" fill="#65a30d" stroke="#365314" strokeWidth="1.5" />
            <polygon points="68,48 90,40 72,58" fill="#65a30d" stroke="#365314" strokeWidth="1.5" />
            {/* Head and thorns */}
            <circle cx="50" cy="54" r="23" fill="url(#goblinGrad)" stroke="#365314" strokeWidth="2.5" />
            <path d="M 44 32 L 40 24 L 48 31" fill="#84cc16" stroke="#365314" strokeWidth="1.5" />
            <path d="M 56 32 L 60 24 L 52 31" fill="#84cc16" stroke="#365314" strokeWidth="1.5" />
            {/* Golden glowing cat eyes */}
            <ellipse cx="42" cy="51" rx="4" ry="5" fill="#facc15" />
            <ellipse cx="58" cy="51" rx="4" ry="5" fill="#facc15" />
            <ellipse cx="42" cy="51" rx="1.5" ry="4" fill="#365314" />
            <ellipse cx="58" cy="51" rx="1.5" ry="4" fill="#365314" />
            {/* Snaggly goblin grin */}
            <path d="M 40 63 Q 50 67 60 63" stroke="#1a2e05" strokeWidth="2" fill="none" strokeLinecap="round" />
            <polygon points="46,65 48,60 50,65" fill="#ffffff" />
            <polygon points="52,62 54,66 56,62" fill="#ffffff" />
          </g>
        </svg>
      );

    case 3:
      // Will-o-Wisp: Lantern Sprite
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_18px_rgba(253,224,71,0.8)]">
          <defs>
            <radialGradient id="wispFlame" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fde047" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </radialGradient>
          </defs>
          <g className="animate-float">
            {/* Lantern handle and roof */}
            <path d="M 42 22 C 42 12 58 12 58 22" stroke="#78350f" strokeWidth="2.5" fill="none" />
            <polygon points="32,28 50,18 68,28" fill="#451a03" stroke="#78350f" strokeWidth="2" />
            {/* Lantern cage */}
            <rect x="34" y="28" width="32" height="42" rx="4" fill="#18181b" stroke="#78350f" strokeWidth="2.5" opacity="0.8" />
            {/* Floating burning wisp spirit */}
            <circle cx="50" cy="49" r="13" fill="url(#wispFlame)" />
            <circle cx="46" cy="47" r="2" fill="#451a03" />
            <circle cx="54" cy="47" r="2" fill="#451a03" />
            <circle cx="47" cy="46" r="0.7" fill="#ffffff" />
            <circle cx="55" cy="46" r="0.7" fill="#ffffff" />
            <path d="M 48 53 Q 50 56 52 53" stroke="#451a03" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Bottom rim */}
            <rect x="30" y="70" width="40" height="6" rx="2" fill="#451a03" stroke="#78350f" strokeWidth="1.5" />
          </g>
        </svg>
      );

    case 4:
      // Slimeghoul: Neon Ooze Specter
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_16px_rgba(34,197,94,0.8)]">
          <defs>
            <linearGradient id="oozeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Drippy ooze ghost body */}
            <path
              d="M 26 62 C 22 36 36 26 50 26 C 64 26 78 36 74 62 C 72 74 66 68 62 76 C 56 68 48 78 42 70 C 36 78 30 72 26 62 Z"
              fill="url(#oozeGrad)"
              stroke="#14532d"
              strokeWidth="2.5"
            />
            {/* 3 quirky googly eyes */}
            <circle cx="38" cy="44" r="5" fill="#ffffff" stroke="#14532d" strokeWidth="1.5" />
            <circle cx="39" cy="44" r="2.2" fill="#14532d" />
            <circle cx="52" cy="40" r="6" fill="#ffffff" stroke="#14532d" strokeWidth="1.5" />
            <circle cx="53" cy="40" r="2.8" fill="#14532d" />
            <circle cx="64" cy="46" r="4.5" fill="#ffffff" stroke="#14532d" strokeWidth="1.5" />
            <circle cx="64" cy="46" r="2" fill="#14532d" />
            {/* Drippy happy mouth */}
            <path d="M 44 56 Q 51 63 58 56" stroke="#14532d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="62" r="1.5" fill="#86efac" />
          </g>
        </svg>
      );

    case 5:
      // Nightshade: Moonlit Bat Familiar
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_16px_rgba(168,85,247,0.8)]">
          <defs>
            <linearGradient id="nightBatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Jagged bat wings */}
            <path d="M 12 40 L 32 46 L 24 64 L 14 52 Z" fill="#6b21a8" stroke="#a855f7" strokeWidth="1.5" />
            <path d="M 88 40 L 68 46 L 76 64 L 86 52 Z" fill="#6b21a8" stroke="#a855f7" strokeWidth="1.5" />
            {/* Body */}
            <ellipse cx="50" cy="54" rx="16" ry="19" fill="url(#nightBatGrad)" stroke="#3b0764" strokeWidth="2.5" />
            {/* Pointy ears */}
            <polygon points="38,38 42,18 48,36" fill="#a855f7" stroke="#3b0764" strokeWidth="2" />
            <polygon points="62,38 58,18 52,36" fill="#a855f7" stroke="#3b0764" strokeWidth="2" />
            {/* Spooky violet crescent eyes */}
            <ellipse cx="44" cy="50" rx="3.5" ry="4.5" fill="#f3e8ff" />
            <ellipse cx="56" cy="50" rx="3.5" ry="4.5" fill="#f3e8ff" />
            <circle cx="44" cy="50" r="2.2" fill="#581c87" />
            <circle cx="56" cy="50" r="2.2" fill="#581c87" />
            {/* Vampire fangs */}
            <path d="M 47 60 Q 50 63 53 60" stroke="#3b0764" strokeWidth="2" fill="none" />
            <polygon points="48,60 49,64 50,60" fill="#ffffff" />
            <polygon points="50,60 51,64 52,60" fill="#ffffff" />
          </g>
        </svg>
      );

    case 6:
      // Phantasma: Sheet Phantom
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_16px_rgba(56,189,248,0.8)]">
          <defs>
            <linearGradient id="phantGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f0f9ff" />
              <stop offset="60%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Ghost flow body */}
            <path
              d="M 28 68 C 22 42 34 24 50 24 C 66 24 78 42 72 68 C 66 74 60 68 54 74 C 48 68 42 74 36 68 Z"
              fill="url(#phantGrad)"
              stroke="#0284c7"
              strokeWidth="2.5"
            />
            {/* Stitched spooky eyes */}
            <circle cx="43" cy="46" r="4.5" fill="#082f49" />
            <circle cx="57" cy="46" r="4.5" fill="#082f49" />
            <circle cx="44" cy="45" r="1.5" fill="#ffffff" />
            <circle cx="58" cy="45" r="1.5" fill="#ffffff" />
            {/* O-shaped spooky open mouth */}
            <ellipse cx="50" cy="56" rx="4" ry="6" fill="#082f49" />
            {/* Rattle chain link */}
            <rect x="42" y="74" width="6" height="10" rx="3" fill="none" stroke="#94a3b8" strokeWidth="2" />
            <rect x="46" y="80" width="6" height="10" rx="3" fill="none" stroke="#94a3b8" strokeWidth="2" />
          </g>
        </svg>
      );

    case 7:
      // Cinderclaw: Campfire Gremlin
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_18px_rgba(251,146,60,0.8)]">
          <defs>
            <linearGradient id="gremlinGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#431407" />
              <stop offset="60%" stopColor="#c2410c" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Flame crown */}
            <path d="M 38 34 L 34 16 L 44 28 Z" fill="#f97316" stroke="#7c2d12" strokeWidth="1.5" />
            <path d="M 50 30 L 50 12 L 56 26 Z" fill="#fde047" stroke="#7c2d12" strokeWidth="1.5" />
            <path d="M 62 34 L 66 16 L 56 28 Z" fill="#f97316" stroke="#7c2d12" strokeWidth="1.5" />
            {/* Body */}
            <circle cx="50" cy="54" r="23" fill="url(#gremlinGrad)" stroke="#7c2d12" strokeWidth="2.5" />
            {/* Glowing ember eyes */}
            <ellipse cx="43" cy="51" rx="4" ry="5" fill="#fef08a" />
            <ellipse cx="57" cy="51" rx="4" ry="5" fill="#fef08a" />
            <circle cx="43" cy="51" r="2" fill="#ea580c" />
            <circle cx="57" cy="51" r="2" fill="#ea580c" />
            {/* Claws */}
            <polygon points="26,62 18,66 28,68" fill="#f97316" />
            <polygon points="74,62 82,66 72,68" fill="#f97316" />
            {/* Playful sneer */}
            <path d="M 46 62 Q 50 66 54 62" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 8:
      // Skellie: Tiny Bone Wyrm
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_16px_rgba(226,232,240,0.8)]">
          <g className="animate-float">
            {/* Coiled bone spine */}
            <path d="M 50 20 C 75 20 80 50 50 55 C 20 60 25 80 55 80" stroke="#cbd5e1" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M 50 20 C 75 20 80 50 50 55 C 20 60 25 80 55 80" stroke="#a855f7" strokeWidth="2" fill="none" strokeDasharray="3 3" />
            {/* Skull head */}
            <circle cx="48" cy="22" r="14" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
            <circle cx="43" cy="20" r="3.5" fill="#1e1b4b" />
            <circle cx="53" cy="20" r="3.5" fill="#1e1b4b" />
            <circle cx="43" cy="20" r="1.5" fill="#a855f7" />
            <circle cx="53" cy="20" r="1.5" fill="#a855f7" />
            <path d="M 45 28 L 47 28 M 49 28 L 51 28" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
            {/* Spine vertebrae ticks */}
            <line x1="68" y1="36" x2="74" y2="36" stroke="#94a3b8" strokeWidth="2" />
            <line x1="65" y1="46" x2="71" y2="46" stroke="#94a3b8" strokeWidth="2" />
            <line x1="32" y1="68" x2="38" y2="68" stroke="#94a3b8" strokeWidth="2" />
          </g>
        </svg>
      );

    case 9:
      // Gargoyle: Stonefang Sentinel
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_18px_rgba(148,163,184,0.8)]">
          <defs>
            <linearGradient id="stoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Stone wings */}
            <polygon points="15,36 32,46 26,68 12,50" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
            <polygon points="85,36 68,46 74,68 88,50" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
            {/* Stone Gargoyle Head */}
            <circle cx="50" cy="54" r="23" fill="url(#stoneGrad)" stroke="#1e293b" strokeWidth="2.5" />
            {/* Stone Horns */}
            <polygon points="38,34 32,18 44,30" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
            <polygon points="62,34 68,18 56,30" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
            {/* Glowing amber eyes */}
            <ellipse cx="43" cy="52" rx="4" ry="3.5" fill="#f59e0b" />
            <ellipse cx="57" cy="52" rx="4" ry="3.5" fill="#f59e0b" />
            <circle cx="43" cy="52" r="1.5" fill="#000000" />
            <circle cx="57" cy="52" r="1.5" fill="#000000" />
            {/* Stone fangs */}
            <path d="M 44 64 Q 50 67 56 64" stroke="#1e293b" strokeWidth="2" fill="none" />
            <polygon points="46,64 48,68 50,64" fill="#ffffff" />
            <polygon points="50,64 52,68 54,64" fill="#ffffff" />
          </g>
        </svg>
      );

    case 10:
      // Grimlord: The Midnight Sovereign
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_24px_rgba(217,70,239,0.9)]">
          <defs>
            <linearGradient id="grimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a044e" />
              <stop offset="50%" stopColor="#701a75" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Hood & shroud */}
            <path
              d="M 22 76 C 18 42 32 24 50 24 C 68 24 82 42 78 76 C 72 82 66 78 60 82 C 54 78 46 82 40 78 C 34 82 28 78 22 76 Z"
              fill="url(#grimGrad)"
              stroke="#d946ef"
              strokeWidth="2.5"
            />
            {/* Amethyst Crown */}
            <polygon points="36,24 43,12 50,20 57,12 64,24" fill="#d946ef" stroke="#f0abfc" strokeWidth="2" />
            <circle cx="50" cy="14" r="2.5" fill="#f43f5e" />
            {/* Dark void face interior */}
            <ellipse cx="50" cy="52" rx="16" ry="18" fill="#09090b" />
            {/* Piercing ethereal magenta eyes */}
            <circle cx="43" cy="50" r="4.5" fill="#f43f5e" />
            <circle cx="57" cy="50" r="4.5" fill="#f43f5e" />
            <circle cx="43" cy="50" r="2" fill="#ffffff" />
            <circle cx="57" cy="50" r="2" fill="#ffffff" />
            {/* Phantom skull jaw grin */}
            <path d="M 44 62 L 46 62 M 48 62 L 50 62 M 52 62 L 54 62 M 56 62 L 56 62" stroke="#d946ef" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      );

    default:
      return null;
  }
}

// -------------------------------------------------------------
// LEVEL 3: GOTHIC & ELDRITCH MONSTERS
// -------------------------------------------------------------
function renderGothicMonster(id: number) {
  switch (id) {
    case 1:
      // Voidling: Abyssal Eyeball Cat
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(168,85,247,0.7)]">
          <defs>
            <linearGradient id="voidCat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2e1065" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Pointed cat ears with inner purple glow */}
            <polygon points="32,40 24,18 42,32" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
            <polygon points="68,40 76,18 58,32" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
            {/* Head */}
            <circle cx="50" cy="54" r="23" fill="url(#voidCat)" stroke="#a855f7" strokeWidth="2" />
            {/* 3 Glowing violet cosmic eyes */}
            <ellipse cx="40" cy="53" rx="4.5" ry="6" fill="#c084fc" />
            <ellipse cx="60" cy="53" rx="4.5" ry="6" fill="#c084fc" />
            <ellipse cx="50" cy="40" rx="4.5" ry="6" fill="#f43f5e" />
            {/* Slit pupils */}
            <line x1="40" y1="49" x2="40" y2="57" stroke="#3b0764" strokeWidth="2" />
            <line x1="60" y1="49" x2="60" y2="57" stroke="#3b0764" strokeWidth="2" />
            <line x1="50" y1="36" x2="50" y2="44" stroke="#4c0519" strokeWidth="2" />
            {/* Whisker tendrils */}
            <path d="M 34 60 Q 20 62 16 58" stroke="#c084fc" strokeWidth="1.5" fill="none" />
            <path d="M 66 60 Q 80 62 84 58" stroke="#c084fc" strokeWidth="1.5" fill="none" />
            {/* Little cat nose */}
            <polygon points="50,61 48,64 52,64" fill="#f43f5e" />
          </g>
        </svg>
      );

    case 2:
      // Briarshade: Gothic Rose Revenant
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_16px_rgba(244,63,94,0.8)]">
          <defs>
            <radialGradient id="roseGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="60%" stopColor="#be123c" />
              <stop offset="100%" stopColor="#4c0519" />
            </radialGradient>
          </defs>
          <g className="animate-float">
            {/* Thorny vines wrapping */}
            <path d="M 30 75 Q 40 40 50 25 Q 60 40 70 75" stroke="#1c1917" strokeWidth="4" fill="none" />
            <polygon points="36,55 30,52 38,50" fill="#f43f5e" />
            <polygon points="64,55 70,52 62,50" fill="#f43f5e" />
            <polygon points="44,38 40,32 46,35" fill="#f43f5e" />
            {/* Black-crimson rose bloom head */}
            <circle cx="50" cy="50" r="22" fill="url(#roseGlow)" stroke="#f43f5e" strokeWidth="2" />
            {/* Rose petal spirals */}
            <path d="M 50 36 C 42 40 42 54 50 56 C 58 58 60 44 50 36 Z" fill="none" stroke="#ffe4e6" strokeWidth="2" />
            {/* Glowing crystal eye in center of rose */}
            <circle cx="50" cy="48" r="3.5" fill="#ffffff" />
            <circle cx="50" cy="48" r="1.5" fill="#9f1239" />
          </g>
        </svg>
      );

    case 3:
      // Luminary: Pale Bone Lantern
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_18px_rgba(147,197,253,0.8)]">
          <g className="animate-float">
            {/* Bone mask face */}
            <path
              d="M 32 30 C 32 18 68 18 68 30 C 72 48 64 74 50 78 C 36 74 28 48 32 30 Z"
              fill="#f8fafc"
              stroke="#64748b"
              strokeWidth="2.5"
            />
            {/* Cold blue eye sockets */}
            <circle cx="43" cy="42" r="5" fill="#0f172a" />
            <circle cx="57" cy="42" r="5" fill="#0f172a" />
            <circle cx="43" cy="42" r="2.5" fill="#38bdf8" />
            <circle cx="57" cy="42" r="2.5" fill="#38bdf8" />
            {/* Cold cyan light flares */}
            <line x1="43" y1="36" x2="43" y2="48" stroke="#e0f2fe" strokeWidth="1" />
            <line x1="57" y1="36" x2="57" y2="48" stroke="#e0f2fe" strokeWidth="1" />
            {/* Hollow nasal bone cavity */}
            <polygon points="50,50 48,54 52,54" fill="#0f172a" />
            {/* Stitched teeth */}
            <line x1="44" y1="64" x2="56" y2="64" stroke="#64748b" strokeWidth="2" />
            <line x1="47" y1="61" x2="47" y2="67" stroke="#64748b" strokeWidth="2" />
            <line x1="50" y1="61" x2="50" y2="67" stroke="#64748b" strokeWidth="2" />
            <line x1="53" y1="61" x2="53" y2="67" stroke="#64748b" strokeWidth="2" />
          </g>
        </svg>
      );

    case 4:
      // Oculoth: Tentacled Void-Watcher
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(99,102,241,0.8)]">
          <defs>
            <radialGradient id="voidCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#4338ca" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
          </defs>
          <g className="animate-float">
            {/* Writhing tentacles */}
            <path d="M 32 60 Q 18 72 20 86" stroke="#4338ca" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 44 64 Q 38 80 42 90" stroke="#4338ca" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 56 64 Q 62 80 58 90" stroke="#4338ca" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 68 60 Q 82 72 80 86" stroke="#4338ca" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Central orb */}
            <circle cx="50" cy="46" r="22" fill="url(#voidCore)" stroke="#6366f1" strokeWidth="2.5" />
            {/* Giant omniscient cosmic eye */}
            <ellipse cx="50" cy="46" rx="14" ry="9" fill="#e0e7ff" />
            <circle cx="50" cy="46" r="6" fill="#312e81" />
            <circle cx="50" cy="46" r="3" fill="#a5b4fc" />
            <circle cx="51" cy="44" r="1.2" fill="#ffffff" />
            {/* Mini satellite eyes */}
            <circle cx="34" cy="30" r="4" fill="#a5b4fc" stroke="#312e81" strokeWidth="1" />
            <circle cx="66" cy="30" r="4" fill="#a5b4fc" stroke="#312e81" strokeWidth="1" />
          </g>
        </svg>
      );

    case 5:
      // Ravencrest: Plague Wing Familiar
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_16px_rgba(129,140,248,0.7)]">
          <g className="animate-float">
            {/* Obsidian raven wings */}
            <path d="M 16 38 L 36 46 L 24 68 L 12 50 Z" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
            <path d="M 84 38 L 64 46 L 76 68 L 88 50 Z" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
            {/* Raven Head and Body */}
            <circle cx="50" cy="50" r="20" fill="#0f172a" stroke="#818cf8" strokeWidth="2" />
            {/* Raven sharp beak */}
            <polygon points="50,52 64,56 50,60" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
            {/* Shrewd violet eye */}
            <circle cx="44" cy="47" r="3.5" fill="#c084fc" />
            <circle cx="44" cy="47" r="1.5" fill="#3b0764" />
            {/* Silver Skull Amulet on neck */}
            <circle cx="50" cy="68" r="4" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
            <circle cx="49" cy="67" r="1" fill="#0f172a" />
            <circle cx="51" cy="67" r="1" fill="#0f172a" />
          </g>
        </svg>
      );

    case 6:
      // Specterfang: Mist Gargoyle Chimera
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_16px_rgba(100,116,139,0.8)]">
          <defs>
            <linearGradient id="mistGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Swirling mist cobwebs */}
            <path d="M 20 70 Q 50 60 80 70" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
            {/* Ram-like chimera horns */}
            <path d="M 36 40 C 24 20 18 36 28 44" stroke="#94a3b8" strokeWidth="3" fill="none" />
            <path d="M 64 40 C 76 20 82 36 72 44" stroke="#94a3b8" strokeWidth="3" fill="none" />
            {/* Head */}
            <circle cx="50" cy="54" r="23" fill="url(#mistGrad)" stroke="#64748b" strokeWidth="2.5" />
            {/* Piercing white mist eyes */}
            <circle cx="43" cy="50" r="4" fill="#ffffff" />
            <circle cx="57" cy="50" r="4" fill="#ffffff" />
            <circle cx="43" cy="50" r="1.5" fill="#475569" />
            <circle cx="57" cy="50" r="1.5" fill="#475569" />
            {/* Saber fangs */}
            <polygon points="44,62 46,70 48,62" fill="#e2e8f0" />
            <polygon points="52,62 54,70 56,62" fill="#e2e8f0" />
          </g>
        </svg>
      );

    case 7:
      // Abyssal Pyre: Blackflame Phoenix
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(192,132,252,0.85)]">
          <defs>
            <linearGradient id="blackflame" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="50%" stopColor="#7e22ce" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Dark flame wings */}
            <path d="M 12 36 Q 30 40 32 60 Q 18 54 12 36 Z" fill="url(#blackflame)" stroke="#c084fc" strokeWidth="1.5" />
            <path d="M 88 36 Q 70 40 68 60 Q 82 54 88 36 Z" fill="url(#blackflame)" stroke="#c084fc" strokeWidth="1.5" />
            {/* Phoenix crest plumage */}
            <path d="M 50 30 Q 42 12 50 10 Q 58 12 50 30 Z" fill="#f43f5e" stroke="#c084fc" strokeWidth="1.5" />
            {/* Body */}
            <ellipse cx="50" cy="54" rx="17" ry="22" fill="url(#blackflame)" stroke="#c084fc" strokeWidth="2.5" />
            {/* Beak & amethyst eyes */}
            <polygon points="50,56 46,60 54,60" fill="#facc15" />
            <circle cx="44" cy="50" r="3" fill="#ffffff" />
            <circle cx="56" cy="50" r="3" fill="#ffffff" />
            <circle cx="44" cy="50" r="1.5" fill="#6b21a8" />
            <circle cx="56" cy="50" r="1.5" fill="#6b21a8" />
          </g>
        </svg>
      );

    case 8:
      // Dreadwyrm: Obsidian Eclipse Drake
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_22px_rgba(236,72,153,0.85)]">
          <defs>
            <linearGradient id="drakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="50%" stopColor="#831843" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Sharp obsidian horns */}
            <polygon points="36,36 28,14 44,28" fill="#ec4899" stroke="#500724" strokeWidth="1.5" />
            <polygon points="64,36 72,14 56,28" fill="#ec4899" stroke="#500724" strokeWidth="1.5" />
            {/* Bat-dragon wings */}
            <polygon points="12,48 30,52 24,72 10,60" fill="#500724" stroke="#ec4899" strokeWidth="1.5" />
            <polygon points="88,48 70,52 76,72 90,60" fill="#500724" stroke="#ec4899" strokeWidth="1.5" />
            {/* Drake Head */}
            <circle cx="50" cy="54" r="23" fill="url(#drakeGrad)" stroke="#ec4899" strokeWidth="2.5" />
            {/* Eclipse glowing pink eyes */}
            <circle cx="42" cy="50" r="4.5" fill="#f43f5e" />
            <circle cx="58" cy="50" r="4.5" fill="#f43f5e" />
            <circle cx="42" cy="50" r="2" fill="#ffffff" />
            <circle cx="58" cy="50" r="2" fill="#ffffff" />
            {/* Snout & breath sparks */}
            <ellipse cx="50" cy="62" rx="7" ry="4" fill="#18181b" />
            <circle cx="48" cy="61" r="1" fill="#ec4899" />
            <circle cx="52" cy="61" r="1" fill="#ec4899" />
          </g>
        </svg>
      );

    case 9:
      // Ironclad: Eldritch Tomb Guardian
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(20,184,166,0.85)]">
          <defs>
            <linearGradient id="ironHelm" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="50%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#042f2e" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Heavy knight iron helm */}
            <rect x="28" y="32" width="44" height="46" rx="8" fill="url(#ironHelm)" stroke="#2dd4bf" strokeWidth="2.5" />
            {/* Iron crest horn */}
            <polygon points="50,14 44,32 56,32" fill="#0d9488" stroke="#2dd4bf" strokeWidth="2" />
            {/* Eldritch T-Visor */}
            <path d="M 36 50 H 64 M 50 50 V 68" stroke="#5eead4" strokeWidth="4" strokeLinecap="round" />
            <path d="M 36 50 H 64 M 50 50 V 68" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            {/* Rivets */}
            <circle cx="34" cy="38" r="1.5" fill="#2dd4bf" />
            <circle cx="66" cy="38" r="1.5" fill="#2dd4bf" />
            <circle cx="34" cy="72" r="1.5" fill="#2dd4bf" />
            <circle cx="66" cy="72" r="1.5" fill="#2dd4bf" />
          </g>
        </svg>
      );

    case 10:
      // Nyx Queen: Sovereign of the Void
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_25px_rgba(244,63,94,0.95)]">
          <defs>
            <radialGradient id="voidHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#881337" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g className="animate-float">
            {/* Void halo aura */}
            <circle cx="50" cy="52" r="36" fill="url(#voidHalo)" />
            {/* Crown of Black Stars */}
            <polygon points="50,10 44,26 30,16 38,32 50,28 62,32 70,16 56,26" fill="#09090b" stroke="#f43f5e" strokeWidth="2" />
            <circle cx="50" cy="10" r="2.5" fill="#f43f5e" />
            <circle cx="30" cy="16" r="2" fill="#f43f5e" />
            <circle cx="70" cy="16" r="2" fill="#f43f5e" />
            {/* Empress Sovereign Face */}
            <circle cx="50" cy="54" r="22" fill="#09090b" stroke="#f43f5e" strokeWidth="2.5" />
            {/* Starry omniscient cosmic eyes */}
            <circle cx="43" cy="50" r="4.5" fill="#f43f5e" />
            <circle cx="57" cy="50" r="4.5" fill="#f43f5e" />
            <polygon points="43,47 44,49 46,50 44,51 43,53 42,51 40,50 42,49" fill="#ffffff" />
            <polygon points="57,47 58,49 60,50 58,51 57,53 56,51 54,50 56,49" fill="#ffffff" />
            {/* Serene sovereign smile */}
            <path d="M 46 62 Q 50 65 54 62" stroke="#f43f5e" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      );

    default:
      return null;
  }
}

// -------------------------------------------------------------
// LEVEL 4: NIGHTMARE CYBER-GRIMM / SHADOW TITANS
// -------------------------------------------------------------
function renderNightmareMonster(id: number) {
  switch (id) {
    case 1:
      // Razorbyte: Glitch Cyber-Hound
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_16px_rgba(239,68,68,0.85)]">
          <defs>
            <linearGradient id="houndArmor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#450a0a" />
              <stop offset="60%" stopColor="#1c1917" />
              <stop offset="100%" stopColor="#0c0a09" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Angular cyber ears */}
            <polygon points="36,36 30,16 44,28" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
            <polygon points="64,36 70,16 56,28" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
            {/* Wolf head chassis */}
            <polygon points="50,74 24,46 36,34 64,34 76,46" fill="url(#houndArmor)" stroke="#ef4444" strokeWidth="2.5" />
            {/* Glowing red optic visor strip */}
            <polygon points="32,48 68,48 64,54 36,54" fill="#ef4444" />
            <line x1="32" y1="51" x2="68" y2="51" stroke="#ffffff" strokeWidth="1.5" />
            {/* Chrome titanium teeth */}
            <polygon points="40,64 43,70 46,64" fill="#e2e8f0" />
            <polygon points="54,64 57,70 60,64" fill="#e2e8f0" />
            <polygon points="47,64 50,68 53,64" fill="#e2e8f0" />
          </g>
        </svg>
      );

    case 2:
      // Cryptovore: Nanite Wraith Reaper
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_18px_rgba(220,38,38,0.85)]">
          <g className="animate-float">
            {/* Plasma Scythe on back */}
            <path d="M 20 20 Q 50 10 65 30" stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round" />
            <line x1="20" y1="20" x2="40" y2="80" stroke="#71717a" strokeWidth="2.5" />
            {/* Nanite shroud cloak */}
            <path
              d="M 28 76 C 24 44 34 26 50 26 C 66 26 76 44 72 76 C 64 70 58 76 50 72 C 42 76 36 70 28 76 Z"
              fill="#09090b"
              stroke="#dc2626"
              strokeWidth="2.5"
            />
            {/* Hollow skull face */}
            <ellipse cx="50" cy="50" rx="14" ry="16" fill="#18181b" />
            {/* Glowing crimson optic voids */}
            <circle cx="44" cy="48" r="3.5" fill="#ef4444" />
            <circle cx="56" cy="48" r="3.5" fill="#ef4444" />
            <circle cx="44" cy="48" r="1.5" fill="#ffffff" />
            <circle cx="56" cy="48" r="1.5" fill="#ffffff" />
          </g>
        </svg>
      );

    case 3:
      // Neon-Wraith: Subroutine Phantom
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_18px_rgba(6,182,212,0.85)]">
          <g className="animate-float">
            {/* Digitized circuit lines */}
            <path d="M 20 50 H 35 L 42 60 H 58 L 65 50 H 80" stroke="#06b6d4" strokeWidth="2" fill="none" />
            {/* Cyber phantom body */}
            <path
              d="M 26 68 C 22 36 34 24 50 24 C 66 24 78 36 74 68 C 66 74 58 68 50 74 C 42 68 34 74 26 68 Z"
              fill="#083344"
              stroke="#22d3ee"
              strokeWidth="2.5"
            />
            {/* Grid visor */}
            <rect x="36" y="44" width="28" height="10" rx="3" fill="#0e7490" stroke="#67e8f9" strokeWidth="1.5" />
            <circle cx="44" cy="49" r="2" fill="#ffffff" />
            <circle cx="56" cy="49" r="2" fill="#ffffff" />
            {/* Circuit nodes */}
            <circle cx="20" cy="50" r="2.5" fill="#22d3ee" />
            <circle cx="80" cy="50" r="2.5" fill="#22d3ee" />
          </g>
        </svg>
      );

    case 4:
      // Toxicron: Hazard Core Leviathan
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_18px_rgba(16,185,129,0.85)]">
          <defs>
            <linearGradient id="toxicCore" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Hazard exhaust tubes */}
            <rect x="32" y="18" width="8" height="18" rx="3" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
            <rect x="60" y="18" width="8" height="18" rx="3" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
            {/* Heavy armored mech skull */}
            <rect x="25" y="32" width="50" height="46" rx="10" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" />
            {/* Hazard Core Reactor in chest */}
            <circle cx="50" cy="55" r="14" fill="url(#toxicCore)" stroke="#6ee7b7" strokeWidth="2" />
            <polygon points="50,47 55,57 45,57" fill="#042f2e" />
            {/* Cyber eyes */}
            <rect x="34" y="40" width="8" height="4" fill="#a7f3d0" />
            <rect x="58" y="40" width="8" height="4" fill="#a7f3d0" />
          </g>
        </svg>
      );

    case 5:
      // Cyber-Stalker: Infrared Radar Gargoyle
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_18px_rgba(245,158,11,0.85)]">
          <g className="animate-float">
            {/* Angular stealth drone wings */}
            <polygon points="10,38 32,46 22,66 6,52" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
            <polygon points="90,38 68,46 78,66 94,52" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
            {/* Central sensor chassis */}
            <polygon points="50,28 32,46 38,70 62,70 68,46" fill="#27272a" stroke="#f59e0b" strokeWidth="2.5" />
            {/* Sweeping infrared radar eye */}
            <circle cx="50" cy="50" r="9" fill="#78350f" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="50" cy="50" r="4" fill="#ef4444" />
            <circle cx="51" cy="49" r="1.5" fill="#ffffff" />
          </g>
        </svg>
      );

    case 6:
      // Voidsinger: Neural Pulse Siren
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_18px_rgba(236,72,153,0.85)]">
          <g className="animate-float">
            {/* Acoustic rib fins */}
            <path d="M 24 38 Q 14 50 24 62" stroke="#ec4899" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 18 32 Q 6 50 18 68" stroke="#ec4899" strokeWidth="2" strokeDasharray="3 3" fill="none" />
            <path d="M 76 38 Q 86 50 76 62" stroke="#ec4899" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 82 32 Q 94 50 82 68" stroke="#ec4899" strokeWidth="2" strokeDasharray="3 3" fill="none" />
            {/* Head pod */}
            <ellipse cx="50" cy="50" rx="18" ry="24" fill="#0f172a" stroke="#f472b6" strokeWidth="2.5" />
            {/* Frequency wave visor */}
            <path d="M 38 48 L 44 42 L 50 54 L 56 42 L 62 48" stroke="#ec4899" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 7:
      // Hellhound: Infernal Core Cerberus
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(234,88,12,0.9)]">
          <g className="animate-float">
            {/* Left head */}
            <polygon points="26,38 18,24 32,30" fill="#7c2d12" stroke="#ea580c" strokeWidth="1.5" />
            <ellipse cx="28" cy="46" rx="9" ry="12" fill="#1c1917" stroke="#ea580c" strokeWidth="1.5" />
            <circle cx="27" cy="44" r="2" fill="#facc15" />
            {/* Right head */}
            <polygon points="74,38 82,24 68,30" fill="#7c2d12" stroke="#ea580c" strokeWidth="1.5" />
            <ellipse cx="72" cy="46" rx="9" ry="12" fill="#1c1917" stroke="#ea580c" strokeWidth="1.5" />
            <circle cx="73" cy="44" r="2" fill="#facc15" />
            {/* Center alpha head */}
            <polygon points="42,32 38,14 48,26" fill="#9a3412" stroke="#ea580c" strokeWidth="2" />
            <polygon points="58,32 62,14 52,26" fill="#9a3412" stroke="#ea580c" strokeWidth="2" />
            <ellipse cx="50" cy="52" rx="14" ry="18" fill="#292524" stroke="#ea580c" strokeWidth="2.5" />
            <circle cx="45" cy="48" r="3" fill="#f97316" />
            <circle cx="55" cy="48" r="3" fill="#f97316" />
            <circle cx="45" cy="48" r="1.5" fill="#fef08a" />
            <circle cx="55" cy="48" r="1.5" fill="#fef08a" />
            {/* Jaws */}
            <polygon points="45,62 47,66 49,62" fill="#ffffff" />
            <polygon points="51,62 53,66 55,62" fill="#ffffff" />
          </g>
        </svg>
      );

    case 8:
      // Oblivion: Chrome Bone Dragon
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_22px_rgba(225,29,72,0.9)]">
          <g className="animate-float">
            {/* Chrome laser wings */}
            <polygon points="10,40 32,46 20,70 4,56" fill="#3f3f46" stroke="#e11d48" strokeWidth="2" />
            <line x1="12" y1="46" x2="30" y2="50" stroke="#f43f5e" strokeWidth="2" />
            <polygon points="90,40 68,46 80,70 96,56" fill="#3f3f46" stroke="#e11d48" strokeWidth="2" />
            <line x1="88" y1="46" x2="70" y2="50" stroke="#f43f5e" strokeWidth="2" />
            {/* Robotic dragon skull */}
            <polygon points="50,78 30,50 36,32 64,32 70,50" fill="#18181b" stroke="#e11d48" strokeWidth="2.5" />
            {/* Laser dragon horns */}
            <polygon points="36,32 26,12 44,26" fill="#881337" stroke="#e11d48" strokeWidth="2" />
            <polygon points="64,32 74,12 56,26" fill="#881337" stroke="#e11d48" strokeWidth="2" />
            {/* Crimson neon visor */}
            <polygon points="36,46 64,46 60,52 40,52" fill="#f43f5e" />
            <line x1="38" y1="49" x2="62" y2="49" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        </svg>
      );

    case 9:
      // Iron Juggernaut: Heavy Armor Dreadnought
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_22px_rgba(99,102,241,0.9)]">
          <defs>
            <linearGradient id="juggerPlate" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#312e81" />
              <stop offset="50%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
          </defs>
          <g className="animate-float">
            {/* Heavy shoulder fortress plates */}
            <polygon points="12,42 30,32 34,64 16,70" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
            <polygon points="88,42 70,32 66,64 84,70" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
            {/* Dreadnought Head Chassis */}
            <rect x="28" y="28" width="44" height="48" rx="8" fill="url(#juggerPlate)" stroke="#6366f1" strokeWidth="2.5" />
            {/* Horizontal blast visor */}
            <rect x="36" y="44" width="28" height="6" rx="2" fill="#818cf8" stroke="#ffffff" strokeWidth="1" />
            {/* Reinforced armor grille */}
            <line x1="38" y1="58" x2="62" y2="58" stroke="#6366f1" strokeWidth="2" />
            <line x1="38" y1="64" x2="62" y2="64" stroke="#6366f1" strokeWidth="2" />
          </g>
        </svg>
      );

    case 10:
      // Kronos: Apex Cyber-Reaper / Shadow Titan
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_26px_rgba(185,28,28,0.95)]">
          <defs>
            <radialGradient id="kronosAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#b91c1c" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#450a0a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g className="animate-float">
            {/* Titan plasma aura */}
            <circle cx="50" cy="52" r="38" fill="url(#kronosAura)" />
            {/* Titanic blade wings */}
            <polygon points="6,34 32,44 24,76 2,54" fill="#18181b" stroke="#dc2626" strokeWidth="2.5" />
            <polygon points="94,34 68,44 76,76 98,54" fill="#18181b" stroke="#dc2626" strokeWidth="2.5" />
            {/* Halo Horns */}
            <polygon points="50,10 42,26 30,16 38,32 50,28 62,32 70,16 58,26" fill="#09090b" stroke="#ef4444" strokeWidth="2" />
            {/* Apex Titan Face Chassis */}
            <polygon points="50,78 28,48 36,32 64,32 72,48" fill="#09090b" stroke="#ef4444" strokeWidth="2.5" />
            {/* Omniscient dual ruby optics */}
            <polygon points="38,46 62,46 58,52 42,52" fill="#ef4444" />
            <line x1="40" y1="49" x2="60" y2="49" stroke="#ffffff" strokeWidth="2" />
            {/* Cyber breath exhausts */}
            <circle cx="45" cy="62" r="2" fill="#ef4444" />
            <circle cx="55" cy="62" r="2" fill="#ef4444" />
          </g>
        </svg>
      );

    default:
      return null;
  }
}

// -------------------------------------------------------------
// SILHOUETTES WHEN LOCKED
// -------------------------------------------------------------
function renderSilhouette(id: number, style: MonsterStyle = 'cute') {
  const fill = '#374151';
  const stroke = '#4b5563';

  if (style === 'nightmare') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
        <polygon points="50,15 25,40 32,80 68,80 75,40" fill={fill} stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }

  if (style === 'gothic') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
        <polygon points="50,12 40,28 26,20 34,42 50,38 66,42 74,20 60,28" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <circle cx="50" cy="54" r="23" fill={fill} stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }

  if (style === 'spooky') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
        <path d="M 36 38 C 28 20 22 24 28 36" stroke={stroke} strokeWidth="3" fill="none" />
        <path d="M 64 38 C 72 20 78 24 72 36" stroke={stroke} strokeWidth="3" fill="none" />
        <circle cx="50" cy="54" r="23" fill={fill} stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }

  // Cute default silhouettes
  switch (id) {
    case 1:
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
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <circle cx="50" cy="58" r="24" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M 50 35 C 42 22 30 26 36 38 C 42 42 48 37 50 35 Z" fill={fill} />
          <path d="M 50 35 C 58 20 72 24 66 38 C 60 42 52 37 50 35 Z" fill={fill} />
        </svg>
      );
    case 3:
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
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <circle cx="50" cy="52" r="24" fill={fill} stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 5:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <polygon points="12,38 32,45 28,68 18,52" fill={fill} />
          <polygon points="88,38 68,45 72,68 82,52" fill={fill} />
          <ellipse cx="50" cy="55" rx="16" ry="18" fill={fill} stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 6:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <circle cx="50" cy="52" r="22" fill={fill} stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 7:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <circle cx="50" cy="55" r="22" fill={fill} stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 8:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <circle cx="50" cy="54" r="23" fill={fill} stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 9:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <circle cx="50" cy="52" r="24" fill={fill} stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 10:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <circle cx="50" cy="54" r="32" fill={fill} opacity="0.4" />
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
