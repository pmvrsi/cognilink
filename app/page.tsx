import React from 'react';
import Image from 'next/image';
import {
  FileText,
  Mic,
  Brain,
  Search,
  ArrowRight,
  Layers,
  Flame,
  Users,
} from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-[80px] font-bold mb-8 tracking-tighter leading-[1] text-white">
            Link your Learning, <br />
            <span className="text-[#8ecae6]">Connect your cognition.</span>
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
          <div className="relative group pb-24">
            {/* Floating Icons Behind - positioned below card */}
            <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none">
              {/* Icon 1 - GoodNotes */}
              <div className="absolute left-[5%] bottom-0 translate-y-[100%] group-hover:translate-y-[20%] transition-all duration-1000 ease-out opacity-0 group-hover:opacity-80">
                <Image src="/fixedicons/goodnotes.png" alt="" width={80} height={80} className="drop-shadow-2xl" />
              </div>
              {/* Icon 2 - Notes */}
              <div className="absolute left-[20%] bottom-0 translate-y-[100%] group-hover:translate-y-[-10%] transition-all duration-[1200ms] ease-out delay-100 opacity-0 group-hover:opacity-70">
                <Image src="/fixedicons/notes.png" alt="" width={88} height={88} className="drop-shadow-2xl" />
              </div>
              {/* Icon 3 - PDF */}
              <div className="absolute left-[38%] bottom-0 translate-y-[100%] group-hover:translate-y-[30%] transition-all duration-1000 ease-out delay-200 opacity-0 group-hover:opacity-75">
                <Image src="/fixedicons/pdf.png" alt="" width={72} height={72} className="drop-shadow-2xl" />
              </div>
              {/* Icon 4 - Word */}
              <div className="absolute right-[35%] bottom-0 translate-y-[100%] group-hover:translate-y-[-20%] transition-all duration-[1100ms] ease-out delay-150 opacity-0 group-hover:opacity-65">
                <Image src="/fixedicons/word.png" alt="" width={80} height={80} className="drop-shadow-2xl" />
              </div>
              {/* Icon 5 - iOS */}
              <div className="absolute right-[18%] bottom-0 translate-y-[100%] group-hover:translate-y-[15%] transition-all duration-[900ms] ease-out delay-75 opacity-0 group-hover:opacity-80">
                <Image src="/fixedicons/ios.png" alt="" width={64} height={64} className="drop-shadow-2xl" />
              </div>
              {/* Icon 6 - macOS */}
              <div className="absolute right-[3%] bottom-0 translate-y-[100%] group-hover:translate-y-[25%] transition-all duration-[1300ms] ease-out delay-[250ms] opacity-0 group-hover:opacity-60">
                <Image src="/fixedicons/macos.png" alt="" width={96} height={96} className="drop-shadow-2xl" />
              </div>
            </div>
            
            <div className="rounded-[40px] bg-white/5 border border-white/10 p-4 backdrop-blur-3xl overflow-hidden shadow-2xl relative z-10 transition-transform duration-500 group-hover:translate-y-[-8px] group-hover:shadow-[0_30px_60px_-15px_rgba(142,202,230,0.15)]">
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
        </div>
        
        {/* Used by students at */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-8">Used by students at</p>
          <div className="flex items-center justify-center gap-12 flex-wrap">
            <span className="text-white/60 text-xl font-semibold tracking-wide hover:text-white transition-colors">Durham</span>
            <span className="text-white/30">•</span>
            <span className="text-white/60 text-xl font-semibold tracking-wide hover:text-white transition-colors">KCL</span>
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
                  <Brain className="w-6 h-6 text-[#023047]" />
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight text-[#023047] uppercase">
                  02 // Knowledge Graphs
                </h3>
                <p className="text-[#023047]/70 font-bold">
                  [GRAPH_MODE]: Expand your learning into interconnected visual graphs. See how topics relate, discover hidden connections, and navigate complex subjects with ease.
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
                <Flame className="w-6 h-6 text-[#8ecae6]" />
              </div>
              <h3 className="text-2xl font-bold mb-2 tracking-tight uppercase">03 // Login Streaks</h3>
              <p className="text-gray-400">
                Build consistent learning habits with daily streaks and achievement tracking.
              </p>
            </div>

            {/* Feature 4: Wide Card */}
            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-10 overflow-hidden group">
              <div className="flex-1">
                <div className="w-12 h-12 bg-[#8ecae6]/20 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-[#8ecae6]" />
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight uppercase">
                  04 // Friends
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Share graphs and topics with friends for interactive learning together.
                </p>
              </div>
              <div className="w-full md:w-64 h-48 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-105 transition-transform flex items-center justify-center p-6">
                <div className="w-full space-y-3 font-bold">
                  <div className="h-1 w-full bg-[#8ecae6]/30 rounded"></div>
                  <div className="h-1 w-5/6 bg-white/10 rounded"></div>
                  <div className="text-[10px] text-[#8ecae6] pt-4">SHARED WITH 3 FRIENDS</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}