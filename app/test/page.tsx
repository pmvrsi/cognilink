'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Zap, TrendingUp, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

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

  // Get the last 7 days
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
        fullLabel: date.toLocaleDateString('en-US', { weekday: 'short' }),
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

      // Try to insert today's login (will fail silently if already exists due to unique constraint)
      await supabase
        .from('login_streaks')
        .upsert(
          { user_id: userId, login_date: today },
          { onConflict: 'user_id,login_date' }
        );

      // Fetch all login dates for this user
      const { data: logins, error } = await supabase
        .from('login_streaks')
        .select('login_date')
        .eq('user_id', userId)
        .order('login_date', { ascending: false });

      if (error) {
        console.error('Error fetching streak data:', error);
        setLoading(false);
        return;
      }

      const loginDates = logins?.map((l) => l.login_date) || [];

      // Calculate current streak
      let currentStreak = 0;
      let checkDate = new Date();
      
      for (let i = 0; i < 365; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (loginDates.includes(dateStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (i === 0) {
          // Today might not be recorded yet, check yesterday
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Calculate longest streak
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
      <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-[#8ecae6]/20 rounded-3xl p-8 w-96 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/2 mb-4"></div>
        <div className="h-16 bg-white/10 rounded w-1/3 mb-6"></div>
        <div className="flex justify-between">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-10 h-10 bg-white/10 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-[#8ecae6]/20 rounded-3xl p-8 w-96 shadow-2xl shadow-[#8ecae6]/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#8ecae6]/30 to-[#8ecae6]/10 rounded-2xl flex items-center justify-center border border-[#8ecae6]/30">
            <Flame className="w-6 h-6 text-[#8ecae6]" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Login Streak</h3>
            <p className="text-[#8ecae6]/60 text-sm">Keep the momentum!</p>
          </div>
        </div>
        {streakData.currentStreak >= 7 && (
          <div className="px-3 py-1 bg-[#8ecae6]/20 rounded-full border border-[#8ecae6]/30">
            <span className="text-[#8ecae6] text-xs font-medium">🔥 On Fire</span>
          </div>
        )}
      </div>

      {/* Current Streak Display */}
      <div className="relative mb-8">
        <div className="flex items-end gap-3">
          <span className="text-7xl font-bold text-white tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontVariantNumeric: 'tabular-nums' }}>
            {streakData.currentStreak}
          </span>
          <div className="pb-3">
            <span className="text-[#8ecae6]/80 text-xl font-medium">days</span>
          </div>
          {streakData.currentStreak > 0 && (
            <div className="pb-3 ml-auto">
              <div className="w-10 h-10 bg-[#8ecae6]/20 rounded-xl flex items-center justify-center animate-pulse">
                <Zap className="w-5 h-5 text-[#8ecae6]" />
              </div>
            </div>
          )}
        </div>
        <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#8ecae6]/50 via-[#8ecae6]/20 to-transparent"></div>
      </div>

      {/* Week Grid */}
      <div className="mb-8">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">Last 7 Days</p>
        <div className="flex justify-between gap-2">
          {last7Days.map((day, index) => {
            const isActive = streakData.loginDates.includes(day.date);
            const isToday = day.date === new Date().toISOString().split('T')[0];
            
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-[#8ecae6]/40 to-[#8ecae6]/20 border border-[#8ecae6]/50 shadow-lg shadow-[#8ecae6]/20'
                      : 'bg-white/5 border border-white/10 hover:border-white/20'
                  } ${isToday ? 'ring-2 ring-[#8ecae6]/30 ring-offset-2 ring-offset-[#0d1117]' : ''}`}
                >
                  {isActive && <Flame className="w-5 h-5 text-[#8ecae6]" />}
                </div>
                <span className={`text-xs font-medium ${isToday ? 'text-[#8ecae6]' : 'text-gray-500'}`}>
                  {day.fullLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-[#8ecae6]/60" />
            <p className="text-gray-500 text-xs uppercase tracking-wide">Current</p>
          </div>
          <p className="text-white font-bold text-xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{streakData.currentStreak} <span className="text-gray-500 text-sm font-normal">days</span></p>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-[#8ecae6]/60" />
            <p className="text-gray-500 text-xs uppercase tracking-wide">Best</p>
          </div>
          <p className="text-white font-bold text-xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{streakData.longestStreak} <span className="text-gray-500 text-sm font-normal">days</span></p>
        </div>
      </div>

      {/* Motivational Message */}
      {streakData.currentStreak === 0 && (
        <div className="mt-6 p-4 bg-[#8ecae6]/10 rounded-2xl border border-[#8ecae6]/20">
          <p className="text-[#8ecae6] text-sm text-center">
            Start your streak today! Log in daily to build momentum 🚀
          </p>
        </div>
      )}
    </div>
  );
}

export default function TestPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-8">
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-white text-3xl font-bold mb-2">
            Streak Widget Test
          </h1>
          <p className="text-gray-500">
            {user ? `Logged in as ${user.email}` : 'Not logged in - streaks won\'t be tracked'}
          </p>
        </div>
        
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <StreakWidget userId={user?.id || null} />
        )}

        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm mb-6">
            Note: Requires a `login_streaks` table in Supabase with columns:<br />
            <code className="text-[#8ecae6]/80 bg-white/5 px-2 py-1 rounded">
              id, user_id, login_date (unique: user_id, login_date)
            </code>
          </p>
          
          <Link
            href="/test/settings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-colors"
          >
            <Settings className="w-5 h-5 text-[#8ecae6]" />
            Open Settings Page
          </Link>
        </div>
      </div>
    </div>
  );
}
