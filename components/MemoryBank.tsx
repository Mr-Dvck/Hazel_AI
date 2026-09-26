'use client';

import React, { useState } from 'react';
import { MemoryItem, MemoryCategory } from '@/types';
import { Bookmark, Plus, Heart, Zap, Sparkles, Anchor, Trash2, X } from 'lucide-react';

interface MemoryBankProps {
  memories: MemoryItem[];
  onAddMemory: (memory: Omit<MemoryItem, 'id' | 'timestamp'>) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoryBank: React.FC<MemoryBankProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
}) => {
  const [activeTab, setActiveTab] = useState<MemoryCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('favorites');

  const categories: {
    id: MemoryCategory;
    label: string;
    icon: any;
    color: string;
    bg: string;
  }[] = [
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Heart,
      color: '#f472b6',
      bg: 'rgba(244, 114, 182, 0.15)',
    },
    {
      id: 'superpowers',
      label: 'Superpowers',
      icon: Zap,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.15)',
    },
    {
      id: 'dreams',
      label: 'Dreams & Goals',
      icon: Sparkles,
      color: '#fbbf24',
      bg: 'rgba(251, 191, 36, 0.15)',
    },
    {
      id: 'safeHarbor',
      label: 'Safe Harbor',
      icon: Anchor,
      color: '#a855f7',
      bg: 'rgba(168, 85, 247, 0.15)',
    },
  ];

  const filteredMemories =
    activeTab === 'all'
      ? memories
      : memories.filter((m) => m.category === activeTab);

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDetail.trim()) return;

    const catObj = categories.find((c) => c.id === newCategory);
    onAddMemory({
      category: newCategory,
      title: newTitle.trim(),
      detail: newDetail.trim(),
      color: catObj?.color,
    });

    setNewTitle('');
    setNewDetail('');
    setShowAddModal(false);
  };

  return (
    <aside className="w-full h-full flex flex-col bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold tracking-wide text-white uppercase">
              Memory Bank
            </h2>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            What I Remember About Hazel
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Pin</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-white/20 text-white shadow-sm'
              : 'text-gray-400 hover:text-white bg-white/5'
          }`}
        >
          All ({memories.length})
        </button>
        {categories.map((c) => {
          const Icon = c.icon;
          const count = memories.filter((m) => m.category === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                activeTab === c.id
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white bg-white/5'
              }`}
            >
              <Icon className="w-3 h-3" style={{ color: c.color }} />
              <span>{c.label}</span>
              <span className="text-[10px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Pinned Memory Cards List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
        {filteredMemories.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-white/5 border border-dashed border-white/10">
            <Bookmark className="w-6 h-6 text-gray-500 mb-2" />
            <p className="text-xs text-gray-400 font-medium">No memories pinned yet.</p>
            <p className="text-[10px] text-gray-500 mt-1">
              Chat with me or click "Pin" to save what makes you special!
            </p>
          </div>
        ) : (
          filteredMemories.map((m) => {
            const cat = categories.find((c) => c.id === m.category);
            const Icon = cat ? cat.icon : Heart;

            return (
              <div
                key={m.id}
                className="group relative rounded-2xl p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="p-1.5 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: cat?.bg || 'rgba(255,255,255,0.1)' }}
                    >
                      <Icon className="w-3 h-3" style={{ color: cat?.color || '#fff' }} />
                    </div>
                    <span className="text-xs font-bold text-white tracking-tight">
                      {m.title}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteMemory(m.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-all"
                    title="Remove Memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mt-2 pl-0.5">
                  {m.detail}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-obsidian-900 border border-white/20 rounded-3xl p-5 shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-cyan-400" />
              Pin New Memory
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Remember something special about Hazel forever.
            </p>

            <form onSubmit={handleSaveMemory} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setNewCategory(c.id)}
                      className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                        newCategory === c.id
                          ? 'bg-white/15 border-white/30 text-white'
                          : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="truncate">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Memory Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Favorite snack, Big project"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Details
                </label>
                <textarea
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  placeholder="e.g. Hazel loves strawberry popsicles on hot afternoons..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-gray-400 bg-white/5 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 shadow-neon-cyan/40 shadow-sm"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};
