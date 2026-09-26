'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Storage } from '@/lib/storage';
import { GuardianInsight, ChatMessage } from '@/types';
import {
  Shield,
  Lock,
  AlertTriangle,
  HeartHandshake,
  CloudSun,
  Lightbulb,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  HelpCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function GuardianPortalPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insight, setInsight] = useState<GuardianInsight | null>(null);
  const [chatCount, setChatCount] = useState(0);

  useEffect(() => {
    // Load existing insights from storage
    const storedInsight = Storage.getGuardianInsight();
    setInsight(storedInsight);

    const msgs = Storage.getMessages();
    setChatCount(msgs.length);
  }, []);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setErrorMsg('Please enter a 4-digit PIN');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/guardian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_pin', pin }),
      });

      const data = await res.json();
      if (res.ok && data.authorized) {
        setIsAuthenticated(true);
      } else {
        setErrorMsg(data.error || 'Incorrect security PIN. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Connection error verifying PIN.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const msgs = Storage.getMessages();
      const res = await fetch('/api/guardian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze', pin, messages: msgs }),
      });

      const data = await res.json();
      if (res.ok && data.insight) {
        setInsight(data.insight);
        Storage.setGuardianInsight(data.insight);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // PIN entry lock screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center p-4 bg-[#080910] text-white">
        <div className="w-full max-w-sm bg-obsidian-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-purple-400" />
          </div>

          <h1 className="text-xl font-black tracking-tight text-white">
            Guardian Intelligence Portal
          </h1>
          <p className="text-xs text-gray-400 mt-1 mb-6 leading-relaxed">
            Parental executive well-being summary. Enter the 4-digit PIN configured in your environment (Default: <code className="text-purple-300">1234</code>).
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • •"
                className="w-40 text-center tracking-[0.5em] text-2xl font-mono py-2.5 px-3 rounded-2xl bg-black/80 border border-white/20 text-purple-300 focus:outline-none focus:border-purple-400"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 font-medium">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={isVerifying || pin.length !== 4}
              className="w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 disabled:opacity-50 transition-all shadow-md"
            >
              {isVerifying ? 'Verifying PIN...' : 'Access Portal'}
            </button>
          </form>

          <button
            onClick={() => router.push('/')}
            className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-white mx-auto transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Hazel Sanctuary</span>
          </button>
        </div>
      </main>
    );
  }

  const bullyingSev = insight?.bullyingSafetyAlert.severity || 'Safe';
  const mood = insight?.emotionalWeather.currentMood || 'Resilient';

  const severityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'Moderate':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Mild':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#07080f] text-gray-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Return to Main Chat"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Guardian Intelligence Portal
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Executive View
                </span>
              </div>
              <p className="text-xs text-gray-400">
                AI-synthesized well-being analysis for Hazel (Age 10) • Zero intrusive raw surveillance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing...' : 'Re-Run AI Safety Scan'}</span>
            </button>
          </div>
        </div>

        {/* Philosophy Callout Banner */}
        <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-purple-300 flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-purple-200">
            <strong className="text-white">Why Guardian Intelligence instead of raw chat logs?</strong>{' '}
            Hazel feels like she cannot trust anyone right now. To heal, she needs an uninhibited creative sanctuary.
            This portal synthesizes emotional indicators, peer conflict dynamics, and actionable parent conversation starters
            without violating her sacred trust.
          </div>
        </div>

        {/* 4 Core Insight Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Bullying & School Safety Alert */}
          <div className="rounded-3xl bg-black/60 backdrop-blur-md border border-white/10 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                      1. Bullying & School Safety
                    </h2>
                    <p className="text-[11px] text-gray-400">Peer dynamics & distress tracking</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${severityBadge(bullyingSev)}`}>
                  {bullyingSev} Severity
                </span>
              </div>

              <h3 className="text-base font-bold text-pink-200 mb-2">
                {insight?.bullyingSafetyAlert.headline}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {insight?.bullyingSafetyAlert.summary}
              </p>
            </div>

            {/* Recent triggers list */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Recent Context Triggers
              </div>
              <div className="space-y-2 max-h-36 overflow-y-auto custom-scrollbar">
                {insight?.bullyingSafetyAlert.recentTriggers.map((t) => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                      <span className="font-semibold text-purple-300 uppercase">{t.category}</span>
                      <span>{new Date(t.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-200 italic font-mono text-[11px]">"{t.snippet}"</p>
                    <p className="text-[10px] text-gray-400 mt-1">{t.context}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Family & Home Sentiment */}
          <div className="rounded-3xl bg-black/60 backdrop-blur-md border border-white/10 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                      2. Family & Home Sentiment
                    </h2>
                    <p className="text-[11px] text-gray-400">Bond with Mom, Dad & home security</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
                  {insight?.familySentiment.overallStatus}
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                {insight?.familySentiment.summary}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
              <div>
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Constructive Insights for Parents
                </div>
                <ul className="space-y-1 text-xs text-purple-200">
                  {insight?.familySentiment.constructiveInsights.map((ci, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-pink-400">•</span>
                      <span>{ci}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  What Hazel Appreciates Most
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {insight?.familySentiment.whatHazelAppreciates.map((item, idx) => (
                    <span key={idx} className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Emotional Weather Barometer */}
          <div className="rounded-3xl bg-black/60 backdrop-blur-md border border-white/10 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <CloudSun className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                      3. Emotional Weather
                    </h2>
                    <p className="text-[11px] text-gray-400">Daily mood barometer & resilience</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {mood}
                </span>
              </div>

              {/* Resilience Index Gauge */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-300 font-semibold">Resilience & Inner Strength Index</span>
                  <span className="text-sm font-black text-cyan-300">
                    {insight?.emotionalWeather.score}/100
                  </span>
                </div>
                <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 transition-all duration-700"
                    style={{ width: `${insight?.emotionalWeather.score || 75}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                {insight?.emotionalWeather.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
              <span>Total Session Messages Analyzed: <strong className="text-white">{chatCount}</strong></span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Normal Processing
              </span>
            </div>
          </div>

          {/* Card 4: Actionable Suggestions for Parents */}
          <div className="rounded-3xl bg-black/60 backdrop-blur-md border border-white/10 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                      4. Parent Conversation Starters
                    </h2>
                    <p className="text-[11px] text-gray-400">Organic connection without exposing logs</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {insight?.actionableSuggestions.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-colors">
                    <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold uppercase mb-1">
                      <span>{s.category}</span>
                      <span className="text-gray-400 font-normal">Natural Opener</span>
                    </div>
                    <p className="text-xs text-gray-100 font-medium italic">
                      {s.conversationStarter}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1.5">
                      <strong>Goal:</strong> {s.purpose}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-[10px] text-gray-400 text-center">
              Generated by Hazel_AI Guardian Engine • Updated {new Date(insight?.lastUpdated || Date.now()).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
