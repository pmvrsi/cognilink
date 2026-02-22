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
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
              {/* Left: logo + tagline */}
              <div className="flex flex-col gap-4">
                <Link href="/" className="flex items-center gap-3">
                  <Image src="/MainLogo.png" alt="CogniLink" width={40} height={40} className="drop-shadow-lg" />
                  <span className="text-xl font-bold tracking-tight">CogniLink</span>
                </Link>
                <p className="text-gray-500 uppercase text-xs font-bold leading-relaxed">
                  [version_1.0.4] — Intelligent layer for students and researchers.
                </p>
              </div>

              {/* Right: GitHub + Instagram */}
              <div className="flex items-center gap-6">
                <a
                  href="https://github.com/pmvrsi/cognilink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.004.07 1.532 1.031 1.532 1.031.892 1.528 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.104-.253-.447-1.27.097-2.646 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.748-1.025 2.748-1.025.546 1.376.202 2.393.1 2.646.64.698 1.028 1.591 1.028 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/hackldn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 hover:border-white/30 transition-all">
                    <Image
                      src="/Instagram Image 763x763.jpg"
                      alt="Instagram"
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </a>
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