'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import {
  FileText,
  Mic,
  Brain,
  Search,
  Plus,
  Upload,
  Settings,
  LogOut,
  ChevronRight,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Command,
  History,
  MoreVertical,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface Document {
  id: number;
  name: string;
  size: string;
  date: string;
  status: string;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
  citations?: string[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDoc, setActiveDoc] = useState<Document | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // Mock data for the documents
  const [documents, setDocuments] = useState<Document[]>([
    { id: 1, name: "Quantum_Physics_Ch4.pdf", size: "12.4 MB", date: "2024-03-15", status: "Analyzed" },
    { id: 2, name: "Molecular_Biology_Final.pdf", size: "8.1 MB", date: "2024-03-14", status: "Analyzed" },
    { id: 3, name: "History_WW2_Economics.pdf", size: "15.9 MB", date: "2024-03-10", status: "Partial" },
  ]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    getUser();
  }, [router, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const newDoc: Document = {
      id: Date.now(),
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      date: new Date().toISOString().split('T')[0],
      status: "Uploading..."
    };

    setDocuments(prev => [newDoc, ...prev]);
    setActiveDoc(newDoc);
    setMessages([{ role: 'ai', content: `Uploading and analyzing ${file.name}... Please wait.` }]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setDocuments(prev => prev.map(d =>
          d.id === newDoc.id ? { ...d, status: 'Analyzed' } : d
        ));

        setMessages([
          { role: 'ai', content: `I have analyzed "${data.filename}". Here is the summary:\n\n${data.summary}` }
        ]);
      } else {
        console.error('API Error:', data.error);
        setDocuments(prev => prev.map(d =>
          d.id === newDoc.id ? { ...d, status: 'Failed' } : d
        ));
        setMessages([
          { role: 'ai', content: `Sorry, I encountered an error: ${data.error}` }
        ]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setDocuments(prev => prev.map(d =>
        d.id === newDoc.id ? { ...d, status: 'Failed' } : d
      ));
      setMessages([
        { role: 'ai', content: 'Sorry, failed to connect to the server.' }
      ]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleScan = async () => {
    if (!query) return;
    setIsScanning(true);

    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'ai', content: data.text }
        ]);
      } else {
        console.error('API Error:', data.error);
        setMessages((prev) => [
          ...prev,
          { role: 'ai', content: 'Sorry, I encountered an error while processing your request.' }
        ]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: 'Sorry, failed to connect to the server.' }
      ]);
    } finally {
      setIsScanning(false);
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice trigger
      setTimeout(() => {
        setIsListening(false);
        setQuery("Explain the secondary effects mentioned on page 12");
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#023047]">
        <Loader2 className="w-8 h-8 animate-spin text-[#8ecae6]" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#023047] text-white overflow-hidden" style={{ fontFamily: "'Ubuntu Mono', monospace" }}>

      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #219ebc; border-radius: 10px; }
      `}} />

      {/* Sidebar - Navigation & Library */}
      <aside className="w-80 border-r border-white/5 bg-white/[0.02] flex flex-col">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-[#8ecae6] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(142,202,230,0.3)]">
              <Layers className="w-5 h-5 text-[#023047]" />
            </div>
            <span className="text-xl font-bold tracking-tighter">CogniLink</span>
          </Link>

          <button className="w-full bg-[#219ebc] hover:bg-[#8ecae6] hover:text-[#023047] py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#219ebc]/10">
            <Plus className="w-4 h-4" /> NEW DOCUMENT
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
          <div className="px-2 mb-4">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Core Library</span>
          </div>

          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setActiveDoc(doc)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${activeDoc?.id === doc.id ? 'bg-[#219ebc]/20 border-[#219ebc]/40 text-[#8ecae6]' : 'hover:bg-white/5 border-transparent text-gray-400 hover:text-white'}`}
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 text-left truncate">
                <div className="text-sm font-bold truncate">{doc.name}</div>
                <div className="text-[10px] opacity-50 uppercase tracking-tighter">{doc.status} // {doc.size}</div>
              </div>
              {activeDoc?.id === doc.id && <div className="w-1.5 h-1.5 rounded-full bg-[#8ecae6]"></div>}
            </button>
          ))}

          <div className="mt-8 px-2 mb-4">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Knowledge Graphs</span>
          </div>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-white/5 transition-all">
            <History className="w-4 h-4" />
            <span className="text-sm font-bold">Recent Inquiries</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 mb-4 p-2">
            <div className="w-10 h-10 rounded-full bg-[#219ebc]/30 border border-[#219ebc]/50 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-[#8ecae6]" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold truncate">{user?.email?.split('@')[0] || 'User'}</div>
              <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest animate-pulse">Online</div>
            </div>
            <Settings className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white" />
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold text-red-400/70 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3 h-3" /> TERMINATE SESSION
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col relative bg-[#023047]">
        {/* Header */}
        <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-white/[0.01] backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <Cpu className="w-4 h-4 text-[#8ecae6]" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/50">
              {activeDoc ? `processing_module // ${activeDoc.name}` : 'standing_by // select resource'}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 border border-white/10 px-3 py-1 rounded-full uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Neural Engine Active
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10">
              <MoreVertical className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden p-8 gap-8">

          {activeDoc ? (
            <>
              {/* Interaction Panel */}
              <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                {/* Scrollable Conversation */}
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-4">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                      <Sparkles className="w-12 h-12 mb-4 text-[#8ecae6]" />
                      <h4 className="text-xl font-bold uppercase tracking-widest">Cognition Engine Ready</h4>
                      <p className="max-w-xs text-sm mt-2">Specify a topic or scan the document to begin knowledge extraction.</p>
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-2xl p-6 rounded-2xl border ${msg.role === 'user' ? 'bg-[#219ebc]/10 border-[#219ebc]/30' : 'bg-white/5 border-white/10 shadow-xl backdrop-blur-sm'}`}>
                        <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-[#8ecae6]">
                          {msg.role === 'user' ? <Terminal className="w-3 h-3" /> : <Brain className="w-3 h-3" />}
                          {msg.role === 'user' ? 'Local_Request' : 'System_Output'}
                        </div>
                        <p className="text-sm leading-relaxed text-gray-200">{msg.content}</p>
                        {msg.citations && (
                          <div className="mt-4 flex gap-2">
                            {msg.citations.map(c => (
                              <span key={c} className="text-[9px] font-bold bg-[#8ecae6]/10 text-[#8ecae6] border border-[#8ecae6]/30 px-2 py-0.5 rounded uppercase hover:bg-[#8ecae6] hover:text-[#023047] transition-all cursor-crosshair">
                                Source: {c}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isScanning && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl animate-pulse flex items-center gap-4">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-[#8ecae6] rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-[#8ecae6] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-1.5 h-1.5 bg-[#8ecae6] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                        <span className="text-xs font-bold text-[#8ecae6] uppercase tracking-[0.2em]">Generating_Summary...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-2 backdrop-blur-xl shadow-2xl relative">
                  <div className="flex items-center gap-2 p-2">
                    <div className="flex-1 flex items-center px-4 bg-black/20 rounded-2xl border border-white/5 group focus-within:border-[#219ebc]/50 transition-all">
                      <Search className="w-4 h-4 text-gray-500 mr-3" />
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                        placeholder="Specify topic or ask further questions..."
                        className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-gray-600 font-bold"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 font-bold bg-white/5 px-2 py-1 rounded">CMD + K</span>
                        <button
                          onClick={handleScan}
                          disabled={!query || isScanning}
                          className="w-10 h-10 bg-[#219ebc] rounded-xl flex items-center justify-center text-[#023047] hover:bg-[#8ecae6] transition-all disabled:opacity-30 disabled:grayscale"
                        >
                          <ChevronRight className="w-5 h-5" strokeWidth={3} />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={toggleVoice}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${isListening ? 'bg-red-500 shadow-red-500/30' : 'bg-[#023047] border border-white/10 hover:border-[#8ecae6] text-[#8ecae6]'}`}
                    >
                      {isListening ? (
                        <div className="flex gap-1">
                          <div className="w-1 h-4 bg-white rounded-full animate-pulse"></div>
                          <div className="w-1 h-6 bg-white rounded-full animate-pulse [animation-delay:0.2s]"></div>
                          <div className="w-1 h-4 bg-white rounded-full animate-pulse [animation-delay:0.4s]"></div>
                        </div>
                      ) : (
                        <Mic className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                  {isListening && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-bounce">
                      Recording_Audio...
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="application/pdf"
                className="hidden"
              />
              <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`w-32 h-32 bg-[#219ebc]/10 rounded-[40px] border border-[#219ebc]/20 flex items-center justify-center mb-10 group cursor-pointer hover:bg-[#219ebc]/20 transition-all overflow-hidden relative ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="absolute inset-0 border-2 border-dashed border-[#219ebc]/40 m-2 rounded-[32px]"></div>
                {isUploading ? (
                  <Loader2 className="w-10 h-10 text-[#219ebc] animate-spin" />
                ) : (
                  <Upload className="w-10 h-10 text-[#219ebc] group-hover:scale-110 transition-transform" />
                )}
              </div>
              <h2 className="text-4xl font-bold mb-4 tracking-tighter uppercase">Initialize Resource</h2>
              <p className="text-gray-400 max-w-sm mb-12">Select a document from your library or drop a new PDF to start the cognition scan.</p>

              <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
                <div
                  onClick={() => setActiveDoc(documents[0])}
                  className="p-6 bg-white/5 border border-white/10 rounded-3xl text-left hover:border-[#8ecae6]/40 transition-all cursor-pointer group"
                >
                  <History className="w-6 h-6 text-[#8ecae6] mb-4" />
                  <div className="text-sm font-bold uppercase mb-1">Resume Last</div>
                  <div className="text-xs text-gray-500">Quantum_Physics_Ch4</div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-left hover:border-[#8ecae6]/40 transition-all cursor-pointer group">
                  <Command className="w-6 h-6 text-[#8ecae6] mb-4" />
                  <div className="text-sm font-bold uppercase mb-1">Search Global</div>
                  <div className="text-xs text-gray-500">Scan across all resources</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Intelligence Panel - Metadata & Statistics */}
      <aside className="w-72 border-l border-white/5 bg-white/[0.01] hidden xl:flex flex-col">
        <div className="p-8 border-b border-white/5">
          <h5 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] mb-6">Sys_Analytics</h5>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                <span className="text-gray-500">Tokens Processed</span>
                <span className="text-[#8ecae6]">84.2k</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#8ecae6] w-3/4"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                <span className="text-gray-500">Extraction Confidence</span>
                <span className="text-[#8ecae6]">98.4%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#8ecae6] w-5/6"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <h5 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] mb-6">Detected_Topics</h5>
          <div className="flex flex-wrap gap-2">
            {['Particle Physics', 'Heisenberg', 'Electron Shells', 'Nuclear Force', 'Entropy', 'Calculus'].map(topic => (
              <button key={topic} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-tight hover:border-[#8ecae6] hover:text-[#8ecae6] transition-all">
                {topic}
              </button>
            ))}
          </div>

          <h5 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] mt-12 mb-6">Hotkeys</h5>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-gray-500">NEW_QUERY</span>
              <span className="bg-white/5 px-2 py-1 rounded">ALT + Q</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-gray-500">VOICE_TRIGGER</span>
              <span className="bg-white/5 px-2 py-1 rounded">SPACEBAR</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-gray-500">EXPORT_SUMMARY</span>
              <span className="bg-white/5 px-2 py-1 rounded">CMD + E</span>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white/5 border-t border-white/5">
          <div className="p-4 bg-[#219ebc]/10 rounded-2xl border border-[#219ebc]/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#8ecae6]" />
              <span className="text-[10px] font-bold text-[#8ecae6] uppercase tracking-widest">Pro Version</span>
            </div>
            <p className="text-[10px] font-medium text-gray-400 mb-4 leading-relaxed">Unlock unlimited scanning and advanced mathematical OCR.</p>
            <button className="w-full bg-[#219ebc] py-2 rounded-xl text-[10px] font-bold text-[#023047] uppercase hover:bg-[#8ecae6] transition-all">Upgrade Now</button>
          </div>
        </div>
      </aside>

    </div>
  );
}
