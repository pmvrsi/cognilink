'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();
      
      // Get the code from URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          console.error('Auth error:', error);
          router.push('/login?error=auth_failed');
          return;
        }
      }
      
      // Redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#023047]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#8ecae6] mx-auto mb-4" />
        <p className="text-white/60 text-sm font-bold uppercase tracking-widest">
          Authenticating...
        </p>
      </div>
    </div>
  );
}
