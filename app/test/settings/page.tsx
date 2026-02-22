'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  Trash2, 
  LogOut,
  ChevronRight,
  Save,
  ArrowLeft,
  Flame,
  Eye,
  EyeOff
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import Link from 'next/link';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
        enabled ? 'bg-[#8ecae6]' : 'bg-white/10'
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

function SettingRow({ icon, title, description, children, onClick, danger }: SettingRowProps) {
  const content = (
    <>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          danger ? 'bg-red-500/20' : 'bg-[#8ecae6]/20'
        }`}>
          <div className={danger ? 'text-red-400' : 'text-[#8ecae6]'}>{icon}</div>
        </div>
        <div className="flex-1">
          <p className={`font-medium ${danger ? 'text-red-400' : 'text-white'}`}>{title}</p>
          {description && <p className="text-gray-500 text-sm">{description}</p>}
        </div>
      </div>
      {children}
      {onClick && !children && (
        <ChevronRight className="w-5 h-5 text-gray-500" />
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between p-4">
      {content}
    </div>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-gray-500 text-xs uppercase tracking-widest mb-3 px-4">{title}</h2>
      <div className="bg-white/5 border border-white/10 rounded-3xl divide-y divide-white/10">
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Settings state
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [streakReminders, setStreakReminders] = useState(true);
  const [showStreak, setShowStreak] = useState(true);
  const [language, setLanguage] = useState('en');
  
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Would call delete account API here
      alert('Account deletion would happen here');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/test"
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <h1 className="text-white text-xl font-bold">Settings</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[#8ecae6] text-[#0a0a0a] rounded-xl font-medium hover:bg-[#8ecae6]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Account Section */}
        <SettingSection title="Account">
          <SettingRow
            icon={<User className="w-5 h-5" />}
            title={user?.email || 'Not logged in'}
            description="Your account email"
          />
        </SettingSection>

        {/* Appearance Section */}
        <SettingSection title="Appearance">
          <SettingRow
            icon={darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            title="Dark Mode"
            description="Use dark theme across the app"
          >
            <Toggle enabled={darkMode} onChange={setDarkMode} />
          </SettingRow>
          
          <SettingRow
            icon={<Globe className="w-5 h-5" />}
            title="Language"
            description="English (UK)"
            onClick={() => {}}
          />
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection title="Notifications">
          <SettingRow
            icon={<Bell className="w-5 h-5" />}
            title="Push Notifications"
            description="Receive push notifications"
          >
            <Toggle enabled={notifications} onChange={setNotifications} />
          </SettingRow>
          
          <SettingRow
            icon={<Flame className="w-5 h-5" />}
            title="Streak Reminders"
            description="Get reminded to maintain your streak"
          >
            <Toggle enabled={streakReminders} onChange={setStreakReminders} />
          </SettingRow>
          
          <SettingRow
            icon={<Bell className="w-5 h-5" />}
            title="Weekly Email Digest"
            description="Summary of your learning progress"
          >
            <Toggle enabled={emailDigest} onChange={setEmailDigest} />
          </SettingRow>
        </SettingSection>

        {/* Privacy Section */}
        <SettingSection title="Privacy">
          <SettingRow
            icon={showStreak ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            title="Show Streak to Friends"
            description="Let friends see your login streak"
          >
            <Toggle enabled={showStreak} onChange={setShowStreak} />
          </SettingRow>
          
          <SettingRow
            icon={<Shield className="w-5 h-5" />}
            title="Privacy Policy"
            onClick={() => window.open('/privacy', '_blank')}
          />
        </SettingSection>

        {/* Danger Zone */}
        <SettingSection title="Danger Zone">
          <SettingRow
            icon={<LogOut className="w-5 h-5" />}
            title="Sign Out"
            description="Sign out of your account"
            onClick={handleSignOut}
          />
          
          <SettingRow
            icon={<Trash2 className="w-5 h-5" />}
            title="Delete Account"
            description="Permanently delete your account and data"
            onClick={handleDeleteAccount}
            danger
          />
        </SettingSection>

        {/* Version Info */}
        <div className="text-center text-gray-600 text-sm mt-12">
          <p>CogniLink v1.0.0</p>
          <p className="mt-1">Made with 💙 for HackLDN</p>
        </div>
      </div>
    </div>
  );
}
