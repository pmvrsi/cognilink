import React from 'react';
import {
  FileText,
  Mic,
  Brain,
  Search,
  ArrowRight,
  Layers,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-[80px] font-bold mb-8 tracking-tighter leading-[1] text-white">
            Connect your books. <br />
            <span className="text-[#8ecae6]">Master every topic.</span>
          </h1>

          <p className="max-w-xl mx-auto text-lg md:text-xl text-gray-400 mb-12 leading-relaxed">
            [system_scan]: CogniLink builds a conversational knowledge graph from your resources.
            Ask anything, summarise instantly, and learn via voice.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24">
            <button className="w-full sm:w-auto bg-[#219ebc] hover:bg-[#8ecae6] hover:text-[#023047] px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#219ebc]/20 group">
              Start Scanning{' '}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg transition-all backdrop-blur-md">
              View Demo
            </button>
          </div>
        </div>

        {/* Visual Product Card */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-[40px] bg-white/5 border border-white/10 p-4 backdrop-blur-3xl overflow-hidden shadow-2xl">
            <div className="bg-[#023047] rounded-[32px] border border-white/5 aspect-[16/8] flex">
              <div className="w-1/4 border-r border-white/5 p-6 hidden lg:block">
                <div className="w-full h-8 bg-white/5 rounded-lg mb-8"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-1.5 bg-white/5 rounded-full w-full"></div>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-8 relative flex flex-col justify-center items-center">
                <div className="w-full max-w-lg space-y-6">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#8ecae6] rounded-full flex items-center justify-center text-[#023047]">
                      <Search className="w-5 h-5" />
                    </div>
                    <div className="text-sm text-white/40 tracking-widest uppercase font-bold">
                      Query: "Explain Quantum Physics"
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-[#219ebc]/10 rounded-2xl border border-[#219ebc]/20 flex items-end p-4">
                      <div className="h-2 w-full bg-[#8ecae6]/20 rounded"></div>
                    </div>
                    <div className="h-32 bg-white/5 rounded-2xl border border-white/10 flex items-end p-4">
                      <div className="h-2 w-2/3 bg-white/10 rounded"></div>
                    </div>
                  </div>
                </div>
                {/* Voice Overlay */}
                <div className="absolute bottom-8 right-8 flex items-center gap-3 bg-[#219ebc] p-4 rounded-full shadow-2xl animate-pulse">
                  <Mic className="w-6 h-6" />
                  <div className="flex gap-1">
                    <div className="w-1 h-3 bg-white/50 rounded-full"></div>
                    <div className="w-1 h-5 bg-white rounded-full"></div>
                    <div className="w-1 h-3 bg-white/50 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Feature 1: Large Card */}
            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[40px] p-10 hover:bg-white/[0.07] transition-all duration-500 overflow-hidden relative group">
              <div className="max-w-md relative z-10">
                <div className="w-12 h-12 bg-[#8ecae6]/20 rounded-2xl flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 text-[#8ecae6]" />
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight uppercase tracking-wider">
                  01 // Topic Extraction
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Ignore the noise. Tell CogniLink exactly what you need to know, and receive
                  structured summaries formatted for high-retention learning.
                </p>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Layers className="w-64 h-64 text-[#8ecae6]" />
              </div>
            </div>

            {/* Feature 2: Tall Card */}
            <div className="bg-[#219ebc] rounded-[40px] p-10 flex flex-col justify-between group cursor-pointer hover:shadow-2xl transition-all">
              <div>
                <div className="w-12 h-12 bg-[#023047]/20 rounded-2xl flex items-center justify-center mb-6">
                  <Mic className="w-6 h-6 text-[#023047]" />
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight text-[#023047] uppercase">
                  02 // Voice Q&A
                </h3>
                <p className="text-[#023047]/70 font-bold">
                  [VOICE_MODE]: Speak to your library. Ask follow-up questions hands-free while you
                  move.
                </p>
              </div>
              <div className="flex justify-end">
                <div className="w-12 h-12 bg-[#023047] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Feature 3: Small Card */}
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 hover:border-[#8ecae6]/30 transition-all">
              <div className="w-12 h-12 bg-[#8ecae6]/20 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-[#8ecae6]" />
              </div>
              <h3 className="text-2xl font-bold mb-2 tracking-tight uppercase">03 // OCR Engine</h3>
              <p className="text-gray-400">
                High-speed character recognition for handwritten notes and old textbooks.
              </p>
            </div>

            {/* Feature 4: Wide Card */}
            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-10 overflow-hidden group">
              <div className="flex-1">
                <div className="w-12 h-12 bg-[#8ecae6]/20 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6 text-[#8ecae6]" />
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight uppercase">
                  04 // Verification
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Every claim is cited. Direct links to the original page in your PDF ensure no
                  hallucinated data.
                </p>
              </div>
              <div className="w-full md:w-64 h-48 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-105 transition-transform flex items-center justify-center p-6">
                <div className="w-full space-y-3 font-bold">
                  <div className="h-1 w-full bg-[#8ecae6]/30 rounded"></div>
                  <div className="h-1 w-5/6 bg-white/10 rounded"></div>
                  <div className="text-[10px] text-[#8ecae6] pt-4">REF: PAGE_42_PARA_1</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-48 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tighter uppercase leading-none">
            Your books <br /> are waiting.
          </h2>
          <button className="bg-white text-[#023047] px-12 py-6 rounded-full font-black text-xl hover:bg-[#8ecae6] transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] active:scale-95">
            INITIALISE FREE TRIAL
          </button>
          <p className="mt-8 text-gray-500 font-bold tracking-widest text-xs">
            LIMIT: 5 DOCUMENTS / SESSION
          </p>
        </div>
      </section>
    </>
  );
}