'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  // Hide navbar/footer on these routes
  const hideChrome = pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth') || pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <html lang="en" className="bg-[#023047]">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <style>{`html, body { scroll-behavior: smooth; background-color: #023047 !important; }`}</style>
      </head>
      <body
        className="min-h-screen bg-[#023047] text-white selection:bg-[#219ebc] selection:text-white antialiased"
        style={{ fontFamily: "'Ubuntu Mono', monospace", backgroundColor: '#023047' }}
      >
        {/* Navbar - only show on public pages */}
        {!hideChrome && (
          <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
            <div className="max-w-6xl mx-auto px-6">
              <div
                className={`flex items-center justify-between px-6 py-2 rounded-full border transition-all duration-500 ${
                  scrolled
                    ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl'
                    : 'bg-transparent border-transparent'
                }`}
              >
                <Link href="/" className="flex items-center gap-3 cursor-pointer group">
                  <Image src="/MainLogo.png" alt="CogniLink" width={48} height={48} className="drop-shadow-lg transition-all group-hover:scale-110" />
                  <span className="text-xl font-bold tracking-tight">CogniLink</span>
                </Link>

                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-sm font-bold text-gray-300 hover:text-white hidden sm:block">
                    Log in
                  </Link>
                  <Link href="/signup" className="bg-white text-[#023047] px-6 py-2 rounded-full text-sm font-bold hover:bg-[#8ecae6] transition-all transform active:scale-95 shadow-lg">
                    Get started
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Page Content */}
        <main>{children}</main>

        {/* Footer - only show on public pages */}
        {!hideChrome && (
          <footer className="py-20 px-6 border-t border-white/5">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
              <div>
                <Link href="/" className="flex items-center gap-3 mb-6">
                  <Image src="/MainLogo.png" alt="CogniLink" width={48} height={48} className="drop-shadow-lg" />
                  <span className="text-xl font-bold tracking-tight">CogniLink</span>
                </Link>
                <p className="text-gray-500 max-w-xs uppercase text-xs font-bold leading-relaxed">
                  [version_1.0.4] <br />
                  Intelligent layer for students and researchers.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-20">
                <div className="space-y-4">
                  <h6 className="text-xs font-bold uppercase tracking-widest text-white/50">Support</h6>
                  <ul className="space-y-2 text-sm text-gray-400 font-bold uppercase">
                    <li><a href="#" className="hover:text-white transition">Docs</a></li>
                    <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h6 className="text-xs font-bold uppercase tracking-widest text-white/50">Social</h6>
                  <ul className="space-y-2 text-sm text-gray-400 font-bold uppercase">
                    <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                    <li><a href="#" className="hover:text-white transition">GitHub</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-gray-600 text-[10px] font-bold tracking-widest">
              © 2024 COGNILINK_AI_TECHNOLOGIES. ALL_RIGHTS_RESERVED.
            </div>
          </footer>
        )}
      </body>
    </html>
  );
}