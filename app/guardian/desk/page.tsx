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
  MessageSquare,
} from 'lucide-react';
import { BridgeNote, BridgeReply, GuardianInsight } from '@/types';
import { Storage } from '@/lib/storage';

export default function GuardianDeskPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<BridgeNote[]>([]);
  const [replies, setReplies] = useState<BridgeReply[]>([]);
  const [insight, setInsight] = useState<GuardianInsight | null>(null);
  const [selectedNote, setSelectedNote] = useState<BridgeNote | null>(null);
  const [replySender, setReplySender] = useState<'Tim' | 'Mom' | 'Tim & Mom'>('Tim');
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
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

      // 3. Load Guardian Insight directly from server sync endpoint
      try {
        const syncRes = await fetch('/api/sync?userId=hazel_default');
        if (syncRes.ok) {
          const syncData = await syncRes.json();
          if (syncData.found && syncData.data?.guardianInsight) {
            setInsight(syncData.data.guardianInsight);
            Storage.setGuardianInsight(syncData.data.guardianInsight);
          }
        }
      } catch {
        const local = Storage.getGuardianInsight();
        if (local) setInsight(local);
      }
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
          content: replyText.trim(),
          noteId: selectedNote?.id,
          reassuranceType: 'love',
        }),
      });

      if (res.ok) {
        setStatusMessage("✨ Note sent successfully to Hazel's screen!");
        setReplyText('');
        fetchBridgeData();
        setTimeout(() => setStatusMessage(''), 5000);
      } else {
        const errJson = await res.json().catch(() => ({}));
        setStatusMessage(errJson.error || 'Failed to deliver note. Check connection.');
      }
    } catch (err: any) {
      setStatusMessage(`Error delivering note: ${err?.message || 'Network error'}`);
    } finally {
      setIsSendingReply(false);
    }
  };

  const resilienceScore = insight?.emotionalWeather?.score || 80;

  return (
    <main className="min-h-screen bg-[#07080f] text-white p-4 sm:p-6 lg:p-8 font-sans selection:bg-pink-500 selection:text-white">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => router.push('/')}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sanctuary</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-pink-400" />
                <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400">
                  Hazel Guardian Desk
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Bridge Active
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Two-Way Reassurance Bridge • Tim & Mom's Dedicated Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => router.push('/guardian')}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Guardian Intel</span>
            </button>
            <button
              onClick={fetchBridgeData}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh Bridge'}</span>
            </button>
          </div>
        </header>

        {/* Compact Quick Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
                <Smile className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Emotional Weather</p>
                <h4 className="text-sm font-bold text-white">
                  {insight?.emotionalWeather?.currentMood || 'Resilient'} (Score: {resilienceScore}/100)
                </h4>
              </div>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
              resilienceScore >= 75
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : resilienceScore >= 50
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-red-500/20 text-red-300 border-red-500/30'
            }`}>
              {insight?.emotionalWeather?.trend === 'needs_boost' ? 'Needs Tender Care' : 'Stable'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Safety Scanner</p>
                <h4 className="text-sm font-bold text-white">
                  {insight?.bullyingSafetyAlert?.severity || 'Safe'} • {insight?.bullyingSafetyAlert?.headline || 'Sanctuary Active'}
                </h4>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
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

        {/* EXPANDED PROMINENT SECTION: How Hazel Is Actually Doing */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-pink-950/40 to-black/90 border border-pink-500/40 shadow-neon-pink/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-pink-500/20 text-pink-300 shadow-neon-pink/30">
                <Sparkles className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
                  <span>✨ HOW HAZEL IS ACTUALLY DOING</span>
                  <span className="text-[10px] font-semibold text-pink-300 px-2 py-0.5 rounded-full bg-pink-500/15 border border-pink-500/30">
                    Real-Time AI Synthesis
                  </span>
                </h2>
                <p className="text-xs text-gray-400">
                  Unvarnished emotional well-being assessment synthesized from real chat conversations
                </p>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 font-mono">
              Last updated: {insight?.lastUpdated ? new Date(insight.lastUpdated).toLocaleTimeString() : 'Just now'}
            </span>
          </div>

          <div className="space-y-4">
            {/* Top Row: 3 Wide Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Current Mood, Energy & Resilience Gauge */}
                <div className="p-4 rounded-2xl bg-[#181428] border border-purple-500/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                      <Smile className="w-4 h-4 text-purple-400" />
                      <span>Current Mood & Resilience Gauge</span>
                    </div>
                    <h3 className="text-base font-black text-white leading-snug">
                      {insight?.howHazelIsDoing?.currentMoodAndEnergy || insight?.emotionalWeather?.currentMood || 'Thoughtful & Calm'}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-purple-500/20">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-400">Resilience Index:</span>
                      <strong className="text-pink-300 font-mono text-sm">{resilienceScore} / 100</strong>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          resilienceScore >= 75
                            ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                            : resilienceScore >= 50
                            ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                            : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                        }`}
                        style={{ width: `${Math.max(5, Math.min(100, resilienceScore))}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                      {insight?.emotionalWeather?.description || 'Hazel displays strong innate resilience.'}
                    </p>
                  </div>
                </div>

                {/* Card 2: What's Weighing On Her (Spacious, full text, never truncated) */}
                <div className="p-4 rounded-2xl bg-[#241a15] border border-amber-500/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>What's Weighing On Her</span>
                    </div>
                    <span className="text-[10px] text-gray-400 mb-2 block">
                      (Full unvarnished context • Never truncated)
                    </span>
                    <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {insight?.howHazelIsDoing?.whatsWeighingOnHer ||
                        insight?.bullyingSafetyAlert?.summary ||
                        'No heavy emotional burdens or peer friction detected in recent chats.'}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-amber-500/20 text-[11px] text-amber-300/80 font-mono">
                    Severity: {insight?.bullyingSafetyAlert?.severity || 'Safe'}
                  </div>
                </div>

                {/* Card 3: What's Bringing Her Joy (Spacious, full text, never truncated) */}
                <div className="p-4 rounded-2xl bg-[#122329] border border-cyan-500/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1">
                      <Heart className="w-4 h-4 text-cyan-400" />
                      <span>What's Bringing Her Joy</span>
                    </div>
                    <span className="text-[10px] text-gray-400 mb-2 block">
                      (Creativity, monster lore & happy moments)
                    </span>
                    <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {insight?.howHazelIsDoing?.whatsBringingHerJoy ||
                        insight?.familySentiment?.summary ||
                        'Drawing imaginative creatures, monster lore, and quiet bedtime unwinding.'}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-cyan-500/20 text-[11px] text-cyan-300/80 font-mono">
                    Family Connection: {insight?.familySentiment?.overallStatus || 'Positive'}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Card 4 Banner (Plain-English Executive Well-Being Summary) */}
              <div className="p-4 rounded-2xl bg-[#261222] border border-pink-500/40">
                <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300 uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>Plain-English Executive Well-Being Summary (Synthesized from Recent Chats)</span>
                </div>
                <p className="text-xs text-pink-100 font-medium leading-relaxed">
                  {insight?.howHazelIsDoing?.parentExecutiveSummary ||
                    insight?.sessionSummary ||
                    "Hazel is doing well! She is engaging creatively and feeling safe in her space. Acknowledge her ideas and keep encouraging her imagination."}
                </p>
              </div>
            </div>
          </div>

        {/* Main Content: Left Column (Inbox) + Right Column (Custom Note Composer) */}
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
                  <p className="text-xs text-gray-300 font-medium">No notes dispatched yet.</p>
                  <p className="text-[11px] text-gray-500 mt-1 max-w-xs">
                    When Hazel sends a note to your desk, it will arrive here in real time.
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

            {/* Selected Note Inspector at bottom of left column */}
            {selectedNote && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-[10px] text-pink-300 font-bold uppercase tracking-wider mb-1">
                  Selected Note from Hazel:
                </div>
                <div className="p-3 rounded-2xl bg-black/80 border border-white/10 text-xs text-gray-200">
                  <div className="text-[10px] text-gray-400 mb-1">
                    Sent at {new Date(selectedNote.timestamp).toLocaleTimeString()}
                  </div>
                  "{selectedNote.text}"
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Clean Spacious Custom Note Composer (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl bg-black/60 border border-white/10 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Custom Note Composer for Hazel
                  </h3>
                </div>
                {/* Sender Selector (Tim / Mom / Tim & Mom - ZERO references to Tim as Dad) */}
                <div className="flex items-center gap-1.5 bg-black/80 p-1 rounded-xl border border-white/15">
                  {(['Tim', 'Mom', 'Tim & Mom'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setReplySender(s)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
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

              {/* Custom Reply Textarea & Dispatch */}
              <form onSubmit={handleSendReply} className="space-y-4 pt-1">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-2">
                    Write a genuine, heartfelt note directly to Hazel's screen:
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Write a genuine, heartfelt note as ${replySender} to Hazel's screen...`}
                    rows={6}
                    className="w-full p-4 rounded-2xl bg-black/80 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/80 resize-none shadow-inner leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-medium">
                    {statusMessage}
                  </span>

                  <button
                    type="submit"
                    disabled={!replyText.trim() || isSendingReply}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-neon-pink disabled:opacity-40 transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSendingReply ? 'Sending to Screen...' : "Send Note to Hazel's Screen"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Box 2: Previous Sent Replies Feed */}
            <div className="rounded-3xl bg-black/60 border border-white/10 p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Recent Delivered Notes to Hazel ({replies.length})
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
