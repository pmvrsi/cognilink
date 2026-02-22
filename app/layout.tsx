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
                  <Link
                    href="/login"
                    className="text-sm font-bold px-6 py-2.5 rounded-full bg-[#8ecae6] text-[#023047] hover:bg-white transition-all hidden sm:block"
                  >
                    Log in
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
            <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-6">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/MainLogo.png" alt="CogniLink" width={40} height={40} className="drop-shadow-lg" />
                <span className="text-xl font-bold tracking-tight">CogniLink</span>
              </Link>
              <p className="text-gray-500 uppercase text-xs font-bold leading-relaxed">
                [version_1.0.4] — Intelligent layer for students and researchers.
              </p>
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