'use client';

import React from 'react';
import { Monster } from '@/types';
import { MonsterSvg } from './monsters/MonsterSvg';
import { Trophy, Sparkles, ChevronRight, Lock } from 'lucide-react';

interface MonsterTowerProps {
  monsters: Monster[];
  totalMessages: number;
  onSelectMonster: (monster: Monster) => void;
}

export const MonsterTower: React.FC<MonsterTowerProps> = ({
  monsters,
  totalMessages,
  onSelectMonster,
}) => {
  const unlockedCount = monsters.filter((m) => m.unlocked).length;
  const nextLocked = monsters.find((m) => !m.unlocked);

  const progressPct = Math.round((unlockedCount / monsters.length) * 100);

  return (
    <aside className="w-full h-full flex flex-col bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl overflow-hidden">
      {/* Tower Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold tracking-wide text-white uppercase">
              Resilience Tower
            </h2>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            10 Collectible Growth Guardians
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-amber-300">
            {unlockedCount}/10
          </span>
          <p className="text-[10px] text-gray-400">Awakened</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="my-3">
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 transition-all duration-700 shadow-neon-pink"
            style={{ width: `${Math.max(10, progressPct)}%` }}
          />
        </div>
        {nextLocked ? (
          <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400">
            <span>Next: <strong className="text-pink-300">{nextLocked.name}</strong></span>
            <span>{Math.max(0, nextLocked.requiredMessages - totalMessages)} chats away</span>
          </div>
        ) : (
          <div className="text-[10px] text-amber-300 text-center mt-1 font-semibold">
            ✨ Supreme Tower Complete! ✨
          </div>
        )}
      </div>

      {/* Stacked Monster List (Scrollable, Top Tier 10 to Tier 1) */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
        {/* Render descending so Solara Tier 10 is at the top of the tower! */}
        {[...monsters].reverse().map((monster) => {
          const isNext = nextLocked?.id === monster.id;

          return (
            <button
              key={monster.id}
              onClick={() => onSelectMonster(monster)}
              className={`w-full group relative text-left rounded-2xl p-2.5 transition-all duration-300 border ${
                monster.unlocked
                  ? 'bg-white/5 hover:bg-white/10 border-white/15 hover:border-white/30 shadow-lg'
                  : isNext
                  ? 'bg-purple-950/20 border-purple-500/30 hover:border-purple-500/50'
                  : 'bg-black/30 border-white/5 opacity-60 hover:opacity-80'
              }`}
            >
              {/* Active glow backing when unlocked */}
              {monster.unlocked && (
                <div
                  className="absolute inset-0 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: monster.color }}
                />
              )}

              <div className="relative flex items-center gap-3">
                {/* Custom SVG Monster */}
                <div className="flex-shrink-0">
                  <MonsterSvg
                    id={monster.id}
                    unlocked={monster.unlocked}
                    style={monster.style}
                    size={46}
                  />
                </div>

                {/* Monster Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{
                        backgroundColor: monster.unlocked
                          ? `${monster.color}25`
                          : '#374151',
                        color: monster.unlocked ? monster.color : '#9ca3af',
                      }}
                    >
                      Tier {monster.tier}
                    </span>
                    <span
                      className={`text-xs font-bold truncate ${
                        monster.unlocked ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {monster.name}
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-400 truncate mt-0.5">
                    {monster.title}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="flex-shrink-0">
                  {monster.unlocked ? (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:scale-125 transition-transform" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-gray-500" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
