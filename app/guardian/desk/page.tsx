'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Laptop,
  Heart,
  Send,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Shield,
  Smile,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  MessageSquare,
  Bookmark,
} from 'lucide-react';
import { BridgeNote, BridgeReply, GuardianInsight } from '@/types';
import { Storage } from '@/lib/storage';

const DEFAULT_REASSURANCE_STATEMENTS = [
  { id: '1', text: "You are safe, deeply loved, and wonderful just as you are.", type: 'love' },
  { id: '2', text: "I'm right downstairs if you want a warm cuddle or hot cocoa.", type: 'safe_harbor' },
  { id: '3', text: "Whatever happened at school today, you are not alone. We will handle it together.", type: 'courage' },
  { id: '4', text: "I'm so proud of your creative courage and kind heart today.", type: 'courage' },
  { id: '5', text: "Take all the quiet sanctuary time you need sweetie. I love you to the moon and back.", type: 'love' },
];

export default function GuardianDeskPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<BridgeNote[]>([]);
  const [replies, setReplies] = useState<BridgeReply[]>([]);
  const [insight, setInsight] = useState<GuardianInsight | null>(null);
  const [selectedNote, setSelectedNote] = useState<BridgeNote | null>(null);
  const [replySender, setReplySender] = useState<'Tim (Dad)' | 'Mom' | 'Tim & Mom'>('Tim (Dad)');
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [reassuranceStatements, setReassuranceStatements] = useState(DEFAULT_REASSURANCE_STATEMENTS);
  const [newStatementInput, setNewStatementInput] = useState('');
  const [showAddStatement, setShowAddStatement] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBridgeData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch Notes
      const notesRes = await fetch('/api/bridge/dispatch?limit=50');
      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setNotes(notesData.notes || []);
        if (notesData.notes?.length > 0 && !selectedNote) {
          setSelectedNote(notesData.notes[0]);
        }
      }

      // 2. Fetch Replies
      const repliesRes = await fetch('/api/bridge/reply?all=true');
      if (repliesRes.ok) {
        const repliesData = await repliesRes.json();
        setReplies(repliesData.replies || []);
      }

      // 3. Load Guardian Insight (Local or Sync endpoint)
      let curInsight = Storage.getGuardianInsight();
      if (!curInsight) {
        try {
          const syncRes = await fetch('/api/sync?userId=hazel_default');
          if (syncRes.ok) {
            const syncData = await syncRes.json();
            if (syncData.found && syncData.data?.guardianInsight) {
              curInsight = syncData.data.guardianInsight;
            }
          }
        } catch {
          // ignore
        }
      }
      setInsight(curInsight);
    } catch (err) {
      console.error('Failed to fetch bridge data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBridgeData();
    const interval = setInterval(fetchBridgeData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || isSendingReply) return;

    setIsSendingReply(true);
    setStatusMessage('');

    try {
      const res = await fetch('/api/bridge/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: replySender,
          message: replyText.trim(),
          noteId: selectedNote?.id,
          reassuranceType: 'love',
        }),
      });

      if (res.ok) {
        setStatusMessage('✨ Reassuring note sent straight to Hazel\'s screen!');
        setReplyText('');
        fetchBridgeData();
        setTimeout(() => setStatusMessage(''), 4000);
      } else {
        const data = await res.json();
        setStatusMessage(`Error: ${data.error || 'Failed to send'}`);
      }
    } catch (err) {
      setStatusMessage('Connection error sending reply.');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleAddStatement = () => {
    if (!newStatementInput.trim()) return;
    const newItem = {
      id: `stmt-${Date.now()}`,
      text: newStatementInput.trim(),
      type: 'custom',
    };
    setReassuranceStatements([...reassuranceStatements, newItem]);
    setNewStatementInput('');
    setShowAddStatement(false);
  };

  const handleDeleteStatement = (id: string) => {
    setReassuranceStatements(reassuranceStatements.filter((s) => s.id !== id));
  };

  const unreadNotesCount = notes.filter((n) => !n.read).length;
  const mood = insight?.emotionalWeather.currentMood || 'Resilient';
  const bullyingSev = insight?.bullyingSafetyAlert.severity || 'Safe';

  return (
    <main className="min-h-screen w-full bg-[#07080f] text-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/guardian')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Return to Guardian Portal"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-pink-500/40 shadow-neon-pink flex-shrink-0 bg-black/90">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/guardian_desk_logo.png" alt="Guardian Desk Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Hazel Guardian Desk
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Desk Queue
                </span>
                {unreadNotesCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500 text-white font-bold">
                    {unreadNotesCount} New Note{unreadNotesCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">
                Two-way reassurance bridge between Hazel's Sanctuary and Tim & Mom's computer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/')}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Hazel Sanctuary
            </button>
            <button
              onClick={fetchBridgeData}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Status Radar Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Emotional Weather */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
                <Smile className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Current Mood</p>
                <h4 className="text-sm font-bold text-white">{mood}</h4>
              </div>
            </div>
            <span className="text-xs font-mono text-pink-300 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">
              Score: {insight?.emotionalWeather.score || 80}/100
            </span>
          </div>

          {/* Card 2: Bullying Safety Alert */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Safety Status</p>
                <h4 className="text-sm font-bold text-white">{bullyingSev} Severity</h4>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              bullyingSev === 'Critical' ? 'bg-red-500/20 text-red-300' :
              bullyingSev === 'Moderate' ? 'bg-amber-500/20 text-amber-300' :
              'bg-emerald-500/20 text-emerald-300'
            }`}>
              {insight?.bullyingSafetyAlert.headline || 'Sanctuary Active'}
            </span>
          </div>

          {/* Card 3: Notes & Replies Stats */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-300">
                <Heart className="w-5 h-5 fill-pink-500/30" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Bridge Notes</p>
                <h4 className="text-sm font-bold text-white">
                  {notes.length} Dispatched • {replies.length} Replies
                </h4>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              Active Sync
            </span>
          </div>
        </div>

        {/* Live Companion Session Summary Banner */}
        <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/25 shadow-md flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                Live Companion Session Summary
              </p>
              <span className="text-[10px] text-gray-400 font-medium">
                Real-Time Sanctuary Sync
              </span>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed">
              {insight?.sessionSummary ||
                insight?.bullyingSafetyAlert.summary ||
                "Hazel is in her creative sanctuary. Her companion is validating her emotions, celebrating her artwork, and keeping a watchful eye on school social dynamics."}
            </p>
          </div>
        </div>

        {/* Main Content: Left Column (Inbox & Details) + Right Column (Reply Composer & Statement Manager) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Inbox of Dispatched Notes (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-black/60 border border-white/10 p-5 flex flex-col h-[650px] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Dispatched Notes ({notes.length})
                </h3>
              </div>
              <span className="text-[11px] text-gray-400">Auto-refreshing</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
              {notes.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <Heart className="w-10 h-10 text-pink-500/40 mb-2" />
                  <p className="text-xs text-gray-400">No notes dispatched from Hazel yet.</p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    When Hazel taps "Send Note to Tim's computer", it appears instantly here!
                  </p>
                </div>
              ) : (
                notes.map((note) => {
                  const isSelected = selectedNote?.id === note.id;
                  return (
                    <div
                      key={note.id}
                      onClick={() => setSelectedNote(note)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-950/70 border-pink-500 shadow-neon-pink/30'
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                          <span>💌 {note.senderName || 'Hazel'}</span>
                          {note.replied && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Replied
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed">
                        "{note.text}"
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Note Inspector + Two-Way Reply Composer + Statement Manager (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Box 1: Selected Note & Two-Way Reassurance Reply Composer */}
            <div className="rounded-3xl bg-black/60 border border-white/10 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Quick Reassurance Composer
                  </h3>
                </div>
                {/* Sender Selector */}
                <div className="flex items-center gap-1.5 bg-black/80 p-1 rounded-xl border border-white/15">
                  {(['Tim (Dad)', 'Mom', 'Tim & Mom'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setReplySender(s)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        replySender === s
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Note Banner */}
              {selectedNote && (
                <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30">
                  <div className="text-[10px] text-pink-300 font-bold uppercase tracking-wider mb-1">
                    Replying to Hazel's Note:
                  </div>
                  <p className="text-xs text-gray-100 italic">
                    "{selectedNote.text}"
                  </p>
                </div>
              )}

              {/* Reassurance Statement Quick Buttons */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    One-Tap Reassurance Statements:
                  </span>
                  <button
                    onClick={() => setShowAddStatement(!showAddStatement)}
                    className="text-[10px] text-pink-300 hover:text-pink-200 flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add New</span>
                  </button>
                </div>

                {showAddStatement && (
                  <div className="mb-3 p-3 rounded-2xl bg-black/80 border border-white/15 flex gap-2">
                    <input
                      type="text"
                      value={newStatementInput}
                      onChange={(e) => setNewStatementInput(e.target.value)}
                      placeholder="e.g. You are courageous and never alone..."
                      className="flex-1 bg-transparent border-0 text-xs text-white placeholder-gray-500 focus:outline-none"
                    />
                    <button
                      onClick={handleAddStatement}
                      className="px-3 py-1 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white"
                    >
                      Save
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
                  {reassuranceStatements.map((stmt) => (
                    <div
                      key={stmt.id}
                      className="group flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-pink-500/15 border border-white/10 hover:border-pink-500/40 text-left transition-all"
                    >
                      <button
                        onClick={() => setReplyText(stmt.text)}
                        className="flex-1 text-xs text-gray-200 group-hover:text-pink-100 text-left line-clamp-2"
                      >
                        "{stmt.text}"
                      </button>
                      {stmt.type === 'custom' && (
                        <button
                          onClick={() => handleDeleteStatement(stmt.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Reply Textarea & Dispatch */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Write a warm, reassuring note as ${replySender} to Hazel's screen...`}
                  rows={3}
                  className="w-full p-3.5 rounded-2xl bg-black/80 border border-white/15 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/80 resize-none shadow-inner"
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-medium">
                    {statusMessage}
                  </span>

                  <button
                    type="submit"
                    disabled={!replyText.trim() || isSendingReply}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-neon-pink disabled:opacity-40 transition-all flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSendingReply ? 'Sending to Screen...' : 'Send Note to Hazel\'s Screen'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Box 2: Previous Sent Replies Feed */}
            <div className="rounded-3xl bg-black/60 border border-white/10 p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Recent Warm Notes Sent to Hazel ({replies.length})
                </h4>
                <span className="text-[11px] text-gray-400">Delivered directly to her screen</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {replies.length === 0 ? (
                  <p className="text-xs text-gray-500 py-3 text-center">No replies sent yet.</p>
                ) : (
                  replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/30 to-purple-950/30 border border-amber-500/20 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1 text-[10px] text-amber-300 font-semibold">
                        <span>💖 {reply.sender}</span>
                        <span>{new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-gray-200 italic">"{reply.message}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
