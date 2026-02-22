'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import {
  FileText, Mic, Brain, Search, Plus, Upload,
  Settings, LogOut, ChevronRight, Terminal, Sparkles,
  Command, History, Loader2, Share2, Check, Network
} from 'lucide-react';
import Link from 'next/link';
import NoSSRForceGraph, { adjacencyMatrixToGraphData, type ForceGraphData } from '@/lib/NoSSRForceGraph';
import { Flame, Zap, TrendingUp } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Doc {
  id: number;
  name: string;
  size: string;
  date: string;
  status: string;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

// Shape returned by /api/chat (Gemini schema)
interface GraphData {
  n: number;
  labels: string[];
  label_summary: string[];
  adjacencyMatrix: number[][];
}

// ─── Streak Widget ──────────────────────────────────────────────────────────
interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string | null;
  loginDates: string[];
}

function StreakWidget({ userId }: { userId: string | null }) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastLoginDate: null,
    loginDates: [],
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-GB', { weekday: 'short' }).charAt(0),
        fullLabel: date.toLocaleDateString('en-GB', { weekday: 'short' }),
      });
    }
    return days;
  };
  const last7Days = getLast7Days();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const recordLoginAndFetchStreak = async () => {
      const today = new Date().toISOString().split('T')[0];
      await supabase
        .from('login_streaks')
        .upsert(
          { user_id: userId, login_date: today },
          { onConflict: 'user_id,login_date' }
        );
      const { data: logins, error } = await supabase
        .from('login_streaks')
        .select('login_date')
        .eq('user_id', userId)
        .order('login_date', { ascending: false });
      if (error) {
        setLoading(false);
        return;
      }
      const loginDates = (logins || []).map((l: any) => {
        const d = l.login_date;
        if (!d) return null;
        try {
          return new Date(d).toISOString().split('T')[0];
        } catch (e) {
          return null;
        }
      }).filter(Boolean) as string[];
      let currentStreak = 0;
      let checkDate = new Date();
      for (let i = 0; i < 365; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (loginDates.includes(dateStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (i === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      let longestStreak = 0;
      let tempStreak = 0;
      const sortedDates = [...loginDates].sort();
      for (let i = 0; i < sortedDates.length; i++) {
        if (i === 0) {
          tempStreak = 1;
        } else {
          const prev = new Date(sortedDates[i - 1]);
          const curr = new Date(sortedDates[i]);
          const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      }
      setStreakData({
        currentStreak,
        longestStreak,
        lastLoginDate: loginDates[0] || null,
        loginDates,
      });
      setLoading(false);
    };
    recordLoginAndFetchStreak();
  }, [userId, supabase]);

  if (loading) {
    return (
      <div className="bg-[#023047] border border-[#219ebc]/20 rounded-2xl p-6 w-full animate-pulse mb-6">
        <div className="h-6 bg-white/10 rounded w-1/2 mb-4"></div>
        <div className="h-16 bg-white/10 rounded w-1/3 mb-6"></div>
        <div className="flex justify-between">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-white/10 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#023047] border border-[#219ebc]/20 rounded-2xl p-6 w-full shadow-lg shadow-[#219ebc]/10 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 bg-[#219ebc]/20 rounded-xl flex items-center justify-center border border-[#219ebc]/30">
          <Flame className="w-5 h-5 text-[#8ecae6]" />
        </div>
        <div>
          <h3 className="text-white font-bold text-base">Login Streak</h3>
          <p className="text-[#8ecae6]/60 text-xs">Keep the momentum!</p>
        </div>
      </div>
      <div className="flex items-end gap-2 mb-4">
        <span className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontVariantNumeric: 'tabular-nums' }}>{streakData.currentStreak}</span>
        <span className="text-[#8ecae6]/80 text-base font-medium pb-2">days</span>
        {streakData.currentStreak > 0 && (
          <div className="w-8 h-8 bg-[#219ebc]/20 rounded-xl flex items-center justify-center animate-pulse ml-auto">
            <Zap className="w-4 h-4 text-[#8ecae6]" />
          </div>
        )}
      </div>
      <div className="mb-4">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Last 7 Days</p>
        <div className="flex justify-between gap-1">
          {last7Days.map((day, index) => {
            const isActive = streakData.loginDates.includes(day.date);
            const isToday = day.date === new Date().toISOString().split('T')[0];
            return (
              <div key={index} className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-[#219ebc]/40 border border-[#219ebc]/50 shadow-lg shadow-[#8ecae6]/10'
                      : 'bg-white/5 border border-white/10 hover:border-white/20'
                  } ${isToday ? 'ring-2 ring-[#8ecae6]/30 ring-offset-2 ring-offset-[#023047]' : ''}`}
                >
                  {isActive && <Flame className="w-4 h-4 text-[#8ecae6]" />}
                </div>
                <span className={`text-xs font-medium ${isToday ? 'text-[#8ecae6]' : 'text-gray-400'}`}>{day.fullLabel}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/5 rounded-xl p-2 border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <Flame className="w-3 h-3 text-[#8ecae6]/60" />
            <p className="text-gray-400 text-xs uppercase tracking-wide">Current</p>
          </div>
          <p className="text-white font-bold text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{streakData.currentStreak} <span className="text-gray-400 text-xs font-normal">days</span></p>
        </div>
        <div className="bg-white/5 rounded-xl p-2 border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-[#8ecae6]/60" />
            <p className="text-gray-400 text-xs uppercase tracking-wide">Best</p>
          </div>
          <p className="text-white font-bold text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{streakData.longestStreak} <span className="text-gray-400 text-xs font-normal">days</span></p>
        </div>
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [user, setUser]           = useState<User | null>(null);
  const [loading, setLoading]     = useState(true);
  const [activeDoc, setActiveDoc] = useState<Doc | null>(null);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [query, setQuery]         = useState('');
  const [isScanning, setIsScanning]   = useState(false);
  const [isListening, setIsListening] = useState(false);

  // File upload
  const sidebarInputRef  = useRef<HTMLInputElement>(null);
  const dropzoneInputRef = useRef<HTMLInputElement>(null);
  const [activeFile, setActiveFile]     = useState<File | null>(null);
  const [isUploading, setIsUploading]   = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // Graph
  const [graphData, setGraphData]               = useState<GraphData | null>(null);
  const [graphPrompt, setGraphPrompt]           = useState('');
  const [isGeneratingGraph, setIsGeneratingGraph] = useState(false);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);
  const [isSharing, setIsSharing]                 = useState(false);
  const [shareCopied, setShareCopied]             = useState(false);
  const [shareUrl, setShareUrl]                   = useState<string | null>(null);
  const [renderLinkOpen, setRenderLinkOpen]       = useState(false);
  const [renderLinkInput, setRenderLinkInput]     = useState('');
  const [isRenderingLink, setIsRenderingLink]     = useState(false);
  const [renderLinkError, setRenderLinkError]     = useState('');

  const [documents, setDocuments] = useState<Doc[]>([]);

  const router   = useRouter();
  const supabase = createClient();

  // Auth check — no redirect in dev; middleware handles auth in production
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUser(user);
      setLoading(false);
    })();
  }, [router, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  // ── Upload a PDF → Gemini → get GraphData back ────────────────────────────

  const processFile = async (file: File) => {
    setActiveFile(file);
    setIsUploading(true);
    setUploadStatus(`Uploading ${file.name} to Gemini…`);

    const newDoc: Doc = {
      id:     Date.now(),
      name:   file.name,
      size:   `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      date:   new Date().toISOString().split('T')[0],
      status: 'Uploading…',
    };
    setDocuments(prev => [newDoc, ...prev]);
    setActiveDoc(newDoc);

    const formData = new FormData();
    formData.append(
      'prompt',
      'Extract all key topics from this document and map their prerequisite relationships as a directed graph.'
    );
    formData.append('files', file);

    try {
      setUploadStatus('Analysing document, Extracting topics and relationships');
      const res  = await fetch('/api/chat', { method: 'POST', body: formData });
      const data = await res.json() as GraphData;

      if (res.ok && data.n && data.labels && data.adjacencyMatrix) {
        setDocuments(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: 'Analysed' } : d));
        setGraphData(data);
        setSelectedNodeIndex(null);
        setMessages([{
          role: 'ai',
          content: `Analysed "${file.name}". Extracted ${data.n} topics: ${data.labels.join(', ')}. Knowledge graph is live in the right panel.`,
        }]);
      } else {
        setDocuments(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: 'Failed' } : d));
        setMessages([{ role: 'ai', content: `Error: ${JSON.stringify(data)}` }]);
      }
    } catch {
      setDocuments(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: 'Failed' } : d));
      setMessages([{ role: 'ai', content: 'Could not reach the server.' }]);
    } finally {
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset value so the same file can be re-selected
    e.target.value = '';
  };

  // ── Right-panel Generate Graph button ─────────────────────────────────────
  // Sends the prompt (+ active file if present) to /api/chat and renders result

  const handleGenerateGraph = async () => {
    if (!graphPrompt.trim()) return;
    setIsGeneratingGraph(true);

    const formData = new FormData();
    formData.append('prompt', graphPrompt);
    if (activeFile) formData.append('files', activeFile);

    try {
      const res  = await fetch('/api/chat', { method: 'POST', body: formData });
      const data = await res.json() as GraphData;

      if (res.ok && data.n && data.labels && data.adjacencyMatrix) {
        setGraphData(data);
        setSelectedNodeIndex(null);
        setGraphPrompt('');
        setMessages(prev => [...prev, {
          role: 'ai',
          content: `Graph updated — ${data.n} topics: ${data.labels.join(', ')}.`,
        }]);
      } else {
        console.error('Graph generation failed:', data);
      }
    } catch (err) {
      console.error('Graph generation error:', err);
    } finally {
      setIsGeneratingGraph(false);
    }
  };

  // ── Share graph ───────────────────────────────────────────────────────────

  const handleShare = async () => {
    if (!graphData) return;
    setIsSharing(true);
    try {
      const username =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name      ||
        user?.email?.split('@')[0]     ||
        'Anonymous';

      const { data, error } = await supabase
        .from('shared_graphs')
        .insert({
          user_id:    user?.id,
          graph_data: { ...graphData, shared_by: username },
        })
        .select('id')
        .single();

      if (error || !data) throw new Error(error?.message ?? 'Insert failed');

      const url = `${window.location.origin}/publicgraph/${data.id}`;
      setShareUrl(url);

      try {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      } catch {
        // clipboard blocked — URL is still shown in the UI
      }
    } catch (err) {
      console.error('Share error:', err);
    } finally {
      setIsSharing(false);
    }
  };

  // ── Render graph from share link ──────────────────────────────────────────

  const handleRenderFromLink = async () => {
    setRenderLinkError('');
    const match = renderLinkInput.trim().match(/\/publicgraph\/([a-f0-9-]{36})/i);
    if (!match) { setRenderLinkError('Paste a valid CogniLink share URL.'); return; }

    setIsRenderingLink(true);
    try {
      const { data, error } = await supabase
        .from('shared_graphs')
        .select('graph_data')
        .eq('id', match[1])
        .single();

      if (error || !data) throw new Error('Graph not found.');

      const gd = data.graph_data as GraphData & { shared_by?: string };
      setGraphData(gd);
      setSelectedNodeIndex(null);
      setMessages([{ role: 'ai', content: `Loaded shared graph${gd.shared_by ? ` from ${gd.shared_by}` : ''}. ${gd.n} topics: ${gd.labels.join(', ')}.` }]);
      setRenderLinkInput('');
      setRenderLinkOpen(false);
    } catch (err: any) {
      setRenderLinkError(err.message ?? 'Could not load graph.');
    } finally {
      setIsRenderingLink(false);
    }
  };

  // ── Chat scan ─────────────────────────────────────────────────────────────

  const handleScan = async () => {
    if (!query.trim()) return;
    setIsScanning(true);
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setQuery('');

    try {
      const res  = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          labels:          graphData?.labels,
          label_summary:   graphData?.label_summary,
          adjacencyMatrix: graphData?.adjacencyMatrix,
        }),
      });
      const data = await res.json() as { answer?: string; error?: string };

      setMessages(prev => [...prev, {
        role: 'ai',
        content: data.answer ?? data.error ?? 'Could not process that request.',
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'Server error.' }]);
    } finally {
      setIsScanning(false);
    }
  };

  const toggleVoice = () => setIsListening(v => !v);

  // Convert GraphData → ForceGraph format for the renderer (memoized so
  // unrelated state changes like selectedNodeIndex don't recreate the object)
  const forceGraph: ForceGraphData | null = useMemo(
    () => graphData
      ? adjacencyMatrixToGraphData(graphData.n, graphData.labels, graphData.adjacencyMatrix)
      : null,
    [graphData],
  );

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#023047]">
        <Loader2 className="w-8 h-8 animate-spin text-[#8ecae6]" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#023047] text-white overflow-hidden animate-fade-in" style={{ fontFamily: "'Ubuntu Mono', monospace" }}>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #219ebc; border-radius: 10px; }
        @keyframes scan {
          0%   { width: 0%;  margin-left: 0%; }
          50%  { width: 60%; margin-left: 20%; }
          100% { width: 0%;  margin-left: 100%; }
        }
        .scan-bar { animation: scan 1.5s ease-in-out infinite; }
      ` }} />

      {/* ── Full-screen upload loading overlay ───────────────────────────── */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#023047]/95 backdrop-blur-md">
          {/* Pulsing rings */}
          <div className="relative flex items-center justify-center mb-10">
            <div className="absolute w-44 h-44 rounded-full border border-[#219ebc]/15 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute w-36 h-36 rounded-full border border-[#219ebc]/25 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.35s' }} />
            <div className="absolute w-28 h-28 rounded-full border border-[#219ebc]/35 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.7s' }} />
            <div className="w-20 h-20 rounded-full bg-[#219ebc]/10 border border-[#219ebc]/50 flex items-center justify-center">
              <Loader2 className="w-9 h-9 text-[#8ecae6] animate-spin" />
            </div>
          </div>

          <h2 className="text-2xl font-bold uppercase tracking-[0.3em] text-white mb-3">
            Processing Document
          </h2>
          <p className="text-sm text-[#8ecae6] font-bold max-w-xs text-center tracking-wide opacity-80">
            {uploadStatus}
          </p>

          {/* Scanning progress bar */}
          <div className="mt-8 w-64 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div className="scan-bar h-full bg-[#219ebc] rounded-full" />
          </div>
        </div>
      )}

      {/* Sidebar with slide-in animation */}
      <aside className="w-80 border-r border-white/5 bg-white/[0.02] flex flex-col animate-slide-in" style={{ animationDelay: '0.1s' }}>
        <div className="p-6 border-b border-white/5">
          <input ref={sidebarInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
          <button
            onClick={() => !isUploading && sidebarInputRef.current?.click()}
            disabled={isUploading}
            className="w-full bg-[#219ebc] hover:bg-[#8ecae6] hover:text-[#023047] py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#219ebc]/10 disabled:opacity-50 disabled:cursor-not-allowed animate-bounce-short"
          >
            <Plus className="w-4 h-4" /> NEW DOCUMENT
          </button>
          <button
            onClick={() => { setRenderLinkOpen(o => !o); setRenderLinkError(''); }}
            className="w-full mt-2 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Network className="w-4 h-4" /> RENDER GRAPH
          </button>
          {renderLinkOpen && (
            <div className="mt-2 flex flex-col gap-2">
              <input
                type="text"
                value={renderLinkInput}
                onChange={e => setRenderLinkInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRenderFromLink()}
                placeholder="Paste share link…"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none placeholder:text-gray-600 font-bold focus:border-[#219ebc]/50 transition-all"
              />
              {renderLinkError && <p className="text-[10px] text-red-400 font-bold px-1">{renderLinkError}</p>}
              <button
                onClick={handleRenderFromLink}
                disabled={!renderLinkInput.trim() || isRenderingLink}
                className="w-full bg-[#219ebc] hover:bg-[#8ecae6] hover:text-[#023047] py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRenderingLink ? <><Loader2 className="w-3 h-3 animate-spin" /> Loading…</> : 'Load Graph'}
              </button>
            </div>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
          <div className="px-2 mb-4">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Library</span>
          </div>
          {/* Streak Widget */}
          <StreakWidget userId={user?.id ?? null} />
          {documents.map(doc => (
            <button
              key={doc.id}
              onClick={() => setActiveDoc(doc)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${activeDoc?.id === doc.id ? 'bg-[#219ebc]/20 border-[#219ebc]/40 text-[#8ecae6] animate-pop' : 'hover:bg-white/5 border-transparent text-gray-400 hover:text-white animate-hover-pop'}`}
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 text-left truncate">
                <div className="text-sm font-bold truncate">{doc.name}</div>
                <div className="text-[10px] opacity-50 uppercase tracking-tighter">{doc.status} // {doc.size}</div>
              </div>
              {activeDoc?.id === doc.id && <div className="w-1.5 h-1.5 rounded-full bg-[#8ecae6]" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 mb-4 p-2">
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-[#219ebc]/50"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#219ebc]/30 border border-[#219ebc]/50 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-[#8ecae6]" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate">
                {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
              </div>
            </div>
            <Settings className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white" onClick={() => setSettingsOpen(true)} />
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold text-red-400/70 hover:text-red-400 transition-colors">
            <LogOut className="w-3 h-3" /> LOG OUT
          </button>
        </div>
        {/* Settings menu modal */}
        <SettingsMenu open={settingsOpen} onClose={() => setSettingsOpen(false)} user={user} onLogout={handleLogout} />
      </aside>

      {/* ── After graph is generated: graph takes main area, chat collapses to right panel ── */}
      {forceGraph ? (
        <>
          {/* Graph — fills the main flex-1 space */}
          <main className="flex-1 flex flex-col relative bg-[#023047] overflow-hidden">
            <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-white/[0.01] backdrop-blur-md z-10 shrink-0">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/MainLogo.png" alt="CogniLink" width={40} height={40} className="drop-shadow-lg" />
                <span className="text-xl font-bold tracking-tighter">CogniLink</span>
              </Link>
              <div className="flex items-center gap-4">
                {/* Legend inline in header */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold">
                    <div className="w-5 h-px bg-white/25" /><span className="uppercase tracking-wider">Prerequisite</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold">
                    <div className="w-5 h-px bg-[#8ecae6]" /><span className="uppercase tracking-wider">Related</span>
                  </div>
                </div>
                <button
                  onClick={() => setGraphData(null)}
                  className="text-[10px] font-bold text-white/30 hover:text-white uppercase tracking-widest border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition-all"
                >
                  ← Back to Chat
                </button>
              </div>
            </header>

            {/* ForceGraph fills the entire remaining area */}
            <div className="flex-1 relative min-h-0 overflow-hidden">
              <div className="absolute inset-0">
                {forceGraph && <NoSSRForceGraph graphData={forceGraph} onNodeClick={(id) => setSelectedNodeIndex(id)} />}
              </div>
              {isGeneratingGraph && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-[#8ecae6] animate-spin" />
                    <p className="text-[10px] font-bold text-[#8ecae6] uppercase tracking-widest">Regenerating…</p>
                  </div>
                </div>
              )}
            </div>{/* end flex-1 relative */}
          </main>

          {/* Chat — collapsed to right panel */}
          <aside className="w-96 border-l border-white/5 bg-white/[0.01] flex flex-col">
            {/* Topic summary panel — shown when a node is clicked */}
            {selectedNodeIndex !== null && graphData && (
              <div className="p-5 border-b border-white/5 shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-[10px] font-bold text-[#8ecae6] uppercase tracking-[0.4em]">Topic Detail</h5>
                  <button
                    onClick={() => setSelectedNodeIndex(null)}
                    className="text-[10px] font-bold text-white/30 hover:text-white uppercase tracking-wider"
                  >
                    ✕
                  </button>
                </div>
                <div className="bg-[#219ebc]/10 border border-[#219ebc]/30 rounded-xl p-4">
                  <h6 className="text-sm font-bold text-white mb-2">{graphData.labels[selectedNodeIndex]}</h6>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {graphData.label_summary?.[selectedNodeIndex] ?? 'No summary available.'}
                  </p>
                </div>
              </div>
            )}

            <div className="p-5 border-b border-white/5 shrink-0">
              <h5 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] mb-4">Chat</h5>

              {/* Re-generate prompt */}
              {activeFile && (
                <div className="mb-2 flex items-center gap-1.5 text-[10px] text-[#8ecae6]/70 font-bold uppercase tracking-wider">
                  <FileText className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{activeFile.name}</span>
                </div>
              )}
              <textarea
                value={graphPrompt}
                onChange={e => setGraphPrompt(e.target.value)}
                placeholder="Regenerate graph with a new prompt…"
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs outline-none placeholder:text-gray-600 font-bold resize-none h-16 focus:border-[#219ebc]/50 transition-all"
              />
              <button
                onClick={handleGenerateGraph}
                disabled={!graphPrompt.trim() || isGeneratingGraph}
                className="w-full mt-2 bg-[#219ebc] hover:bg-[#8ecae6] hover:text-[#023047] py-2 rounded-xl font-bold text-xs transition-all uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingGraph
                  ? <><Loader2 className="w-3 h-3 animate-spin" /> Generating…</>
                  : 'Regenerate Graph'
                }
              </button>
              <button
                onClick={handleShare}
                disabled={!graphData || isSharing}
                className="w-full mt-2 bg-white/5 hover:bg-white/10 border border-white/10 py-2 rounded-xl font-bold text-xs transition-all uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isSharing
                  ? <><Loader2 className="w-3 h-3 animate-spin" /> Saving…</>
                  : shareCopied
                  ? <><Check className="w-3 h-3 text-green-400" /> <span className="text-green-400">Link Copied!</span></>
                  : <><Share2 className="w-3 h-3" /> Share Graph</>
                }
              </button>
              {shareUrl && (
                <div className="mt-2 flex items-center gap-1 bg-black/30 border border-white/10 rounded-lg px-2 py-1.5">
                  <span className="flex-1 text-[10px] text-white/50 truncate font-mono">{shareUrl}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(shareUrl).then(() => { setShareCopied(true); setTimeout(() => setShareCopied(false), 2500); })}
                    className="text-[#219ebc] hover:text-[#8ecae6] text-[10px] font-bold shrink-0"
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 min-h-0">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-full p-4 rounded-2xl border text-xs ${msg.role === 'user' ? 'bg-[#219ebc]/10 border-[#219ebc]/30' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex items-center gap-1.5 mb-2 text-[9px] font-bold uppercase tracking-widest text-[#8ecae6]">
                      {msg.role === 'user' ? <Terminal className="w-2.5 h-2.5" /> : <Brain className="w-2.5 h-2.5" />}
                      {msg.role === 'user' ? 'You' : 'System'}
                    </div>
                    <p className="leading-relaxed text-gray-200">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isScanning && (
                <div className="flex gap-1 p-3">
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-[#8ecae6] rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 shrink-0">
              <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-2xl px-3 focus-within:border-[#219ebc]/50 transition-all">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleScan()}
                  placeholder="Ask about the graph…"
                  className="flex-1 bg-transparent py-3 text-xs outline-none placeholder:text-gray-600 font-bold"
                />
                <button
                  onClick={handleScan}
                  disabled={!query.trim() || isScanning}
                  className="w-8 h-8 bg-[#219ebc] rounded-lg flex items-center justify-center text-[#023047] hover:bg-[#8ecae6] transition-all disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={3} />
                </button>
              </div>
            </div>
          </aside>
        </>
      ) : (
        <>
          {/* ── Original layout: chat in main, graph prompt in right panel ── */}
          <main className="flex-1 flex flex-col relative bg-[#023047]">
            <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-white/[0.01] backdrop-blur-md z-10">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/MainLogo.png" alt="CogniLink" width={40} height={40} className="drop-shadow-lg" />
                <span className="text-xl font-bold tracking-tighter">CogniLink</span>
              </Link>
            </header>

            <div className="flex-1 flex flex-col overflow-hidden p-8 gap-8">
              {activeDoc ? (
                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-4">
                    {messages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                        <Sparkles className="w-12 h-12 mb-4 text-[#8ecae6]" />
                        <h4 className="text-xl font-bold uppercase tracking-widest">Cognition Engine Ready</h4>
                        <p className="max-w-xs text-sm mt-2">Ask a question or generate the graph from the right panel.</p>
                      </div>
                    )}
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-2xl p-6 rounded-2xl border ${msg.role === 'user' ? 'bg-[#219ebc]/10 border-[#219ebc]/30' : 'bg-white/5 border-white/10 shadow-xl'}`}>
                          <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-[#8ecae6]">
                            {msg.role === 'user' ? <Terminal className="w-3 h-3" /> : <Brain className="w-3 h-3" />}
                            {msg.role === 'user' ? 'Local_Request' : 'System_Output'}
                          </div>
                          <p className="text-sm leading-relaxed text-gray-200">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isScanning && (
                      <div className="flex justify-start">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl animate-pulse flex items-center gap-4">
                          <div className="flex gap-1">
                            {[0, 0.2, 0.4].map((d, i) => (
                              <div key={i} className="w-1.5 h-1.5 bg-[#8ecae6] rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-[#8ecae6] uppercase tracking-[0.2em]">Generating…</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input bar */}
                  <div className="bg-white/5 border border-white/10 rounded-[32px] p-2 backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center gap-2 p-2">
                      <div className="flex-1 flex items-center px-4 bg-black/20 rounded-2xl border border-white/5 focus-within:border-[#219ebc]/50 transition-all">
                        <Search className="w-4 h-4 text-gray-500 mr-3" />
                        <input
                          type="text"
                          value={query}
                          onChange={e => setQuery(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleScan()}
                          placeholder="Ask a question about the document…"
                          className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-gray-600 font-bold"
                        />
                        <button
                          onClick={handleScan}
                          disabled={!query.trim() || isScanning}
                          className="w-10 h-10 bg-[#219ebc] rounded-xl flex items-center justify-center text-[#023047] hover:bg-[#8ecae6] transition-all disabled:opacity-30"
                        >
                          <ChevronRight className="w-5 h-5" strokeWidth={3} />
                        </button>
                      </div>
                      <button
                        onClick={toggleVoice}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${isListening ? 'bg-red-500' : 'bg-[#023047] border border-white/10 hover:border-[#8ecae6] text-[#8ecae6]'}`}
                      >
                        <Mic className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>

              ) : (
                /* Empty state / drop zone */
                <div
                  className="flex-1 flex flex-col items-center justify-center text-center"
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (file && !isUploading) processFile(file);
                  }}
                >
                  <input ref={dropzoneInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                  <button
                    type="button"
                    onClick={() => {
                      if (!isUploading) dropzoneInputRef.current?.click();
                    }}
                    className="w-32 h-32 bg-[#219ebc]/10 rounded-[40px] border border-[#219ebc]/20 flex items-center justify-center mb-10 cursor-pointer hover:bg-[#219ebc]/20 transition-all relative"
                  >
                    <div className="absolute inset-0 border-2 border-dashed border-[#219ebc]/40 m-2 rounded-[32px]" />
                    <Upload className="w-10 h-10 text-[#219ebc]" />
                  </button>
                  <h2 className="text-4xl font-bold mb-4 tracking-tighter uppercase">Initialise Resource</h2>
                  <p className="text-gray-400 max-w-sm mb-6">Drop a PDF or click to upload and start the cognition scan.</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isUploading) dropzoneInputRef.current?.click();
                    }}
                    disabled={isUploading}
                    className="mb-12 bg-[#219ebc] hover:bg-[#8ecae6] hover:text-[#023047] text-white px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#219ebc]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="w-4 h-4" /> Upload Document
                  </button>
                  <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
                    {/* ...existing code... */}
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Right panel — graph prompt only (no graph yet) */}
          <aside className="w-80 border-l border-white/5 bg-white/[0.01] hidden xl:flex flex-col">
            <div className="p-6 border-b border-white/5">
              <h5 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Knowledge Graph</h5>
            </div>
            <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
              {/* Placeholder */}
              <div className="flex-1 bg-black/30 rounded-2xl border border-white/10 flex flex-col items-center justify-center opacity-30">
                <Sparkles className="w-8 h-8 mb-2 text-[#8ecae6]" />
                <p className="text-[10px] font-bold uppercase tracking-widest">No Graph Yet</p>
                <p className="text-[9px] mt-1 text-gray-500">Upload a doc or use the prompt below</p>
              </div>
              {/* Prompt box */}
              <div className="shrink-0">
                {activeFile && (
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] text-[#8ecae6]/70 font-bold uppercase tracking-wider">
                    <FileText className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{activeFile.name}</span>
                  </div>
                )}
                <textarea
                  value={graphPrompt}
                  onChange={e => setGraphPrompt(e.target.value)}
                  placeholder={activeFile ? `Ask about ${activeFile.name}…` : 'Enter a topic prompt for the graph…'}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm outline-none placeholder:text-gray-600 font-bold resize-none h-20 focus:border-[#219ebc]/50 transition-all"
                />
                <button
                  onClick={handleGenerateGraph}
                  disabled={!graphPrompt.trim() || isGeneratingGraph}
                  className="w-full mt-2 bg-[#219ebc] hover:bg-[#8ecae6] hover:text-[#023047] py-2.5 rounded-xl font-bold text-xs transition-all uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingGraph
                    ? <><Loader2 className="w-3 h-3 animate-spin" /> Generating…</>
                    : 'Generate Graph'
                  }
                </button>
                <button
                  onClick={handleShare}
                  disabled={!graphData || isSharing}
                  className="w-full mt-2 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl font-bold text-xs transition-all uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isSharing
                    ? <><Loader2 className="w-3 h-3 animate-spin" /> Saving…</>
                    : shareCopied
                    ? <><Check className="w-3 h-3 text-green-400" /> <span className="text-green-400">Link Copied!</span></>
                    : <><Share2 className="w-3 h-3" /> Share Graph</>
                  }
                </button>
                {shareUrl && (
                  <div className="mt-2 flex items-center gap-1 bg-black/30 border border-white/10 rounded-lg px-2 py-1.5">
                    <span className="flex-1 text-[10px] text-white/50 truncate font-mono">{shareUrl}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(shareUrl).then(() => { setShareCopied(true); setTimeout(() => setShareCopied(false), 2500); })}
                      className="text-[#219ebc] hover:text-[#8ecae6] text-[10px] font-bold shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </>
      )}

    </div>
  );
}

// Settings menu modal
function SettingsMenu({ open, onClose, user, onLogout }: { open: boolean; onClose: () => void; user: User | null; onLogout: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#023047]/80 backdrop-blur-sm">
      <div className="bg-[#023047] border border-[#219ebc]/20 rounded-3xl p-8 w-[400px] shadow-2xl shadow-[#219ebc]/10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#219ebc]/20 rounded-xl flex items-center justify-center border border-[#219ebc]/30">
            <Settings className="w-6 h-6 text-[#8ecae6]" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Settings</h3>
            <p className="text-[#8ecae6]/60 text-sm">Manage your preferences</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-white font-medium">Dark Mode</span>
            <button className="ml-auto bg-[#219ebc]/20 rounded-full w-10 h-6 flex items-center" onClick={onClose}>
              <span className="bg-white w-5 h-5 rounded-full ml-1" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white font-medium">Notifications</span>
            <button className="ml-auto bg-[#219ebc]/20 rounded-full w-10 h-6 flex items-center" onClick={onClose}>
              <span className="bg-white w-5 h-5 rounded-full ml-1" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white font-medium">Show Streak</span>
            <button className="ml-auto bg-[#219ebc]/20 rounded-full w-10 h-6 flex items-center" onClick={onClose}>
              <span className="bg-white w-5 h-5 rounded-full ml-1" />
            </button>
          </div>
        </div>
        <button onClick={onLogout} className="mt-8 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold text-red-400/70 hover:text-red-400 transition-colors">
          <LogOut className="w-3 h-3" /> Log Out
        </button>
        <button onClick={onClose} className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold text-[#219ebc]/70 hover:text-[#8ecae6] transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}