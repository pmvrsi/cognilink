import Image from 'next/image';
import Link from 'next/link';
import {
  Brain,
  ArrowRight,
  Layers,
  Flame,
  Users,
} from 'lucide-react';
import ProductCard from './components/ProductCard';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="anim-focus-in text-6xl md:text-[80px] font-bold mb-8 tracking-tighter leading-[1] text-white">
            Link your Learning, <br />
            <span className="text-[#8ecae6]">Connect your cognition.</span>
          </h1>

          <p className="anim-fade-up delay-300 max-w-xl mx-auto text-lg md:text-xl text-gray-400 mb-12 leading-relaxed">
            CogniLink builds a conversational knowledge graph AI assistant from your resources.
            Ask anything, summarise instantly.
          </p>

          <div className="anim-fade-up delay-500 flex justify-center items-center mb-24">
            <Link
              href="/login"
              className="bg-[#8ecae6] text-[#023047] px-10 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-2 hover:bg-white hover:shadow-lg hover:shadow-[#8ecae6]/20 active:scale-95"
            >
              Branch your Files
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Visual Product Card */}
        <ProductCard />
        
        {/* Used by students at */}
        <div className="anim-fade-in delay-1000 max-w-4xl mx-auto mt-16 text-center">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-8">Used by students at</p>
          <div className="flex items-center justify-center gap-12 flex-wrap">
            <Image 
              src="/Durham University Logo.png" 
              alt="Durham University" 
              width={140} 
              height={40} 
              className="opacity-60 hover:opacity-100 transition-opacity brightness-0 invert"
            />
            <span className="text-white/30">•</span>
            <Image
              src="/Queen Mary Logo Blue.png"
              alt="Queen Mary University of London"
              width={140}
              height={40}
              className="opacity-60 hover:opacity-100 transition-opacity brightness-0 invert"
            />
            <span className="text-white/30">•</span>
            <Image
              src="/Keele University Logo.png"
              alt="Keele University"
              width={140}
              height={40}
              className="opacity-60 hover:opacity-100 transition-opacity brightness-0 invert"
            />
            <span className="text-white/30">•</span>
            <Image
              src="/Leonardo Logo.png"
              alt="Leonardo"
              width={140}
              height={40}
              className="opacity-60 hover:opacity-100 transition-opacity brightness-0 invert"
            />
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Feature 1: Large Card */}
            <div className="anim-fade-up delay-100 md:col-span-2 bg-white/5 border border-white/10 rounded-[40px] p-10 hover:bg-white/[0.07] transition-all duration-500 overflow-hidden relative group">
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
            <div className="anim-fade-up delay-200 bg-white/5 border border-white/10 rounded-[40px] p-10 hover:bg-white/[0.07] transition-all duration-500 overflow-hidden relative group">
              <div className="w-12 h-12 bg-[#8ecae6]/20 rounded-2xl flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-[#8ecae6]" />
              </div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight uppercase">
                02 // Knowledge Graphs
              </h3>
              <p className="text-gray-400 leading-relaxed">
                [GRAPH_MODE]: Expand your learning into interconnected visual graphs. See how topics relate, discover hidden connections, and navigate complex subjects with ease.
              </p>
            </div>

            {/* Feature 3: Small Card */}
            <div className="anim-fade-up delay-300 bg-white/5 border border-white/10 rounded-[40px] p-10 hover:border-[#8ecae6]/30 transition-all">
              <div className="w-12 h-12 bg-[#8ecae6]/20 rounded-2xl flex items-center justify-center mb-6">
                <Flame className="w-6 h-6 text-[#8ecae6]" />
              </div>
              <h3 className="text-2xl font-bold mb-2 tracking-tight uppercase">03 // Login Streaks</h3>
              <p className="text-gray-400">
                Build consistent learning habits with daily streaks and achievement tracking.
              </p>
            </div>

            {/* Feature 4: Wide Card */}
            <div className="anim-fade-up delay-400 md:col-span-2 bg-white/5 border border-white/10 rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-10 overflow-hidden group">
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