'use client';

import React, { useState } from 'react';
import { MemoryItem, MemoryCategory, UserProfile } from '@/types';
import { Bookmark, Plus, Heart, Zap, Sparkles, Anchor, Trash2, X } from 'lucide-react';

interface MemoryBankProps {
  memories: MemoryItem[];
  onAddMemory: (memory: Omit<MemoryItem, 'id' | 'timestamp'>) => void;
  onDeleteMemory: (id: string) => void;
  onUpdateMemory?: (memory: MemoryItem) => void;
  profile?: UserProfile;
}

export const MemoryBank: React.FC<MemoryBankProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
  onUpdateMemory,
  profile,
}) => {
  const [activeTab, setActiveTab] = useState<MemoryCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('favorites');

  // Edit / Elaborate Memory State
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDetail, setEditDetail] = useState('');
  const [editCategory, setEditCategory] = useState<MemoryCategory>('favorites');

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

  const handleOpenEdit = (m: MemoryItem) => {
    setEditingMemory(m);
    setEditTitle(m.title);
    setEditDetail(m.detail);
    setEditCategory(m.category);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemory || !editTitle.trim() || !editDetail.trim()) return;

    const catObj = categories.find((c) => c.id === editCategory);
    if (onUpdateMemory) {
      onUpdateMemory({
        ...editingMemory,
        category: editCategory,
        title: editTitle.trim(),
        detail: editDetail.trim(),
        color: catObj?.color || editingMemory.color,
      });
    }
    setEditingMemory(null);
  };

  const handleDeleteFromEdit = () => {
    if (editingMemory) {
      onDeleteMemory(editingMemory.id);
      setEditingMemory(null);
    }
  };

  return (
    <aside className="w-full h-full flex flex-col bg-black/75 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-black/80 ring-1 ring-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
            <h2 className="text-sm font-bold tracking-wide text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              Memory Bank
            </h2>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            What {profile?.companionName || 'I'} Remember About {profile?.name || 'Hazel'}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 active:scale-95 transition-all shadow-[0_0_14px_rgba(0,240,255,0.25)] hover:shadow-[0_0_20px_rgba(0,240,255,0.45)]"
          title="Add a new memory or passion"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Memory</span>
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
          <div className="h-48 flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-white/5 border border-dashed border-white/10">
            <Bookmark className="w-7 h-7 text-gray-500 mb-2" />
            <p className="text-xs text-gray-300 font-semibold">No memories pinned yet</p>
            <p className="text-[11px] text-gray-400 mt-1 max-w-[220px] leading-relaxed">
              Your memory bank starts fresh! Type your passions or click below to add one.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-3.5 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 text-xs font-semibold active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Your First Memory</span>
            </button>
          </div>
        ) : (
          filteredMemories.map((m) => {
            const cat = categories.find((c) => c.id === m.category);
            const Icon = cat ? cat.icon : Heart;

            return (
              <div
                key={m.id}
                onClick={() => handleOpenEdit(m)}
                className="group relative rounded-2xl p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-[0_0_18px_rgba(0,240,255,0.25)]"
                title="Click to view, expand, or edit this memory"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="p-1.5 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: cat?.bg || 'rgba(255,255,255,0.1)' }}
                    >
                      <Icon className="w-3 h-3" style={{ color: cat?.color || '#fff' }} />
                    </div>
                    <span className="text-xs font-bold text-white tracking-tight group-hover:text-cyan-200 transition-colors">
                      {m.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="opacity-0 group-hover:opacity-100 text-[10px] text-cyan-400/80 font-medium mr-1 transition-opacity hidden sm:inline">
                      Edit ✏️
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMemory(m.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/10 transition-all"
                      title="Remove Memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mt-2 pl-0.5 line-clamp-3 group-hover:line-clamp-none transition-all">
                  {m.detail}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Edit / Elaborate Memory Modal */}
      {editingMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-obsidian-900 border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl">
            <button
              onClick={() => setEditingMemory(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-cyan-400" />
              Edit &amp; Elaborate Memory
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Add more details, expand your thoughts, or update what {profile?.companionName || 'your companion'} remembers!
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setEditCategory(c.id)}
                      className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                        editCategory === c.id
                          ? 'bg-white/15 border-white/40 text-white shadow-sm'
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
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Memory Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Creative Passion, Cozy Comfort..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Details &amp; Elaboration
                </label>
                <textarea
                  value={editDetail}
                  onChange={(e) => setEditDetail(e.target.value)}
                  placeholder="Expand on this memory, write what you love about it, or share new ideas..."
                  rows={5}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-none shadow-inner"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleDeleteFromEdit}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 flex items-center gap-1.5 transition-all"
                  title="Delete this memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingMemory(null)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 shadow-neon-cyan/40 shadow-sm active:scale-95 transition-all"
                  >
                    Save Changes ✨
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

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
              Add New Memory
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Remember something special about {profile?.name || 'Hazel'} forever.
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
                  placeholder="e.g. Loves drawing dragons, strawberry smoothies..."
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
                  Save to Memory Bank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};
