import React, { useState } from 'react';
import { NavView, ReminderItem, UserProfile } from '../types';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  ChevronDown,
  GraduationCap,
} from 'lucide-react';

interface HeaderProps {
  currentView: NavView;
  setCurrentView: (view: NavView) => void;
  setMobileOpen: (open: boolean) => void;
  user: UserProfile;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  reminders: ReminderItem[];
  onToggleReminder: (id: string) => void;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
  onQuickTaskClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  setMobileOpen,
  user,
  darkMode,
  setDarkMode,
  reminders,
  onToggleReminder,
  isAuthenticated,
  onOpenAuth,
  onQuickTaskClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const activeReminders = reminders.filter((r) => !r.isCompleted);

  const searchFeatures: Array<{ title: string; desc: string; view: NavView }> = [
    { title: 'AI Study Planner', desc: 'Generate customized daily exam timetable', view: 'study-planner' },
    { title: 'AI Study Assistant', desc: 'Instant topic breakdown with simple ELI5 explanations', view: 'ai-assistant' },
    { title: 'AI Quiz Generator', desc: 'Create 10-question practice quizzes with explanations', view: 'quiz' },
    { title: 'AI Notes Generator', desc: 'Format lecture notes & cheatsheets in Cornell style', view: 'notes' },
    { title: 'Assignment Helper', desc: 'Generate academic paper outlines & references', view: 'assignment' },
    { title: 'Calendar & Tasks', desc: 'Manage assignment deadlines and exam schedules', view: 'calendar' },
    { title: 'Reminders System', desc: 'Set daily study alerts & notification timers', view: 'reminders' },
  ];

  const filteredSearch = searchQuery.trim()
    ? searchFeatures.filter(
        (f) =>
          f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectSearch = (view: NavView) => {
    setCurrentView(view);
    setSearchQuery('');
    setSearchOpen(false);
  };

  const getPageTitle = (view: NavView) => {
    switch (view) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'study-planner':
        return 'AI Study Planner';
      case 'ai-assistant':
        return 'AI Study Assistant';
      case 'quiz':
        return 'AI Quiz Generator';
      case 'notes':
        return 'AI Notes Generator';
      case 'assignment':
        return 'Assignment Helper';
      case 'calendar':
        return 'Calendar & Task Manager';
      case 'reminders':
        return 'Reminder System';
      case 'settings':
        return 'Settings & Profile';
      case 'about':
        return 'About EduNova AI';
      default:
        return 'EduNova AI';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-purple-100 dark:border-purple-900/30 px-4 lg:px-8 py-3.5 transition-colors font-['Poppins']">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu + View Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 text-purple-900 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{getPageTitle(currentView)}</span>
            </h1>
            <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 font-medium">
              Welcome back, <span className="font-bold text-[#5B21B6] dark:text-[#C4B5FD]">{user.name}</span> ✨
            </p>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="relative hidden lg:block w-80">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
            <input
              type="text"
              placeholder="Search tools, notes, topics..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              className="w-full pl-10 pr-4 py-2 bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 focus:border-[#8B5CF6] dark:focus:border-[#8B5CF6] rounded-[16px] text-xs text-slate-800 dark:text-slate-100 placeholder-purple-300 focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Search Results Dropdown */}
          {searchOpen && searchQuery.trim().length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 rounded-[20px] shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto"
              onMouseLeave={() => setSearchOpen(false)}
            >
              {filteredSearch.length > 0 ? (
                filteredSearch.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSearch(item.view)}
                    className="w-full text-left px-4 py-3 hover:bg-purple-50/70 dark:hover:bg-purple-950/40 border-b border-purple-100/50 dark:border-purple-900/20 last:border-none transition-colors"
                  >
                    <div className="font-bold text-xs text-[#5B21B6] dark:text-[#C4B5FD]">{item.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  No matching tools found. Try "planner", "quiz", or "notes".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Quick Action + Notifications + Theme Toggle + User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick AI Action Button */}
          <button
            onClick={() => setCurrentView('ai-assistant')}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-purple-50 dark:bg-purple-950/40 text-[#5B21B6] dark:text-[#C4B5FD] border border-purple-200 dark:border-purple-800/50 rounded-[16px] text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#8B5CF6] animate-pulse" />
            <span>Ask AI</span>
          </button>

          {/* Add Task Button */}
          <button
            onClick={onQuickTaskClick}
            className="px-3.5 py-2 purple-gradient-btn text-xs font-bold transition-all flex items-center gap-1.5"
            title="Add Task"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-[14px] transition-colors"
              title="Notifications & Reminders"
            >
              <Bell className="w-5 h-5 text-purple-900 dark:text-purple-300" />
              {activeReminders.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-ping" />
              )}
            </button>

            {/* Notification Menu Overlay */}
            {notifOpen && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 rounded-[20px] shadow-2xl overflow-hidden z-50"
                onMouseLeave={() => setNotifOpen(false)}
              >
                <div className="p-3.5 border-b border-purple-100 dark:border-purple-900/30 flex items-center justify-between bg-purple-50/50 dark:bg-purple-950/40">
                  <span className="font-bold text-xs text-[#5B21B6] dark:text-[#C4B5FD] flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#8B5CF6]" /> Study Alerts
                  </span>
                  <span className="text-[11px] bg-[#5B21B6] text-white px-2.5 py-0.5 rounded-full font-extrabold shadow-sm">
                    {activeReminders.length} Active
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-purple-100/50 dark:divide-purple-900/20">
                  {activeReminders.length > 0 ? (
                    activeReminders.map((rem) => (
                      <div
                        key={rem.id}
                        className="p-3 hover:bg-purple-50/60 dark:hover:bg-purple-950/30 flex items-start justify-between gap-2 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{rem.title}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1 font-semibold text-[#8B5CF6]">
                              <Clock className="w-3 h-3 text-[#8B5CF6]" /> {rem.time}
                            </span>
                            {rem.subject && <span className="text-purple-600 dark:text-purple-300">• {rem.subject}</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => onToggleReminder(rem.id)}
                          className="text-slate-400 hover:text-emerald-500 transition-colors p-1"
                          title="Mark Complete"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                      🎉 No pending study reminders! You are all caught up.
                    </div>
                  )}
                </div>

                <div className="p-2 border-t border-purple-100 dark:border-purple-900/30 text-center bg-purple-50/40 dark:bg-purple-950/20">
                  <button
                    onClick={() => {
                      setCurrentView('reminders');
                      setNotifOpen(false);
                    }}
                    className="text-xs text-[#5B21B6] dark:text-[#C4B5FD] font-bold hover:underline"
                  >
                    View All Reminders
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-[14px] transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-purple-900" />}
          </button>

          {/* User Auth Profile Button */}
          {isAuthenticated ? (
            <button
              onClick={() => setCurrentView('settings')}
              className="flex items-center gap-2 p-1.5 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-[16px] transition-colors"
              title="Profile & Settings"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5B21B6] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-extrabold border-2 border-purple-200 shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-purple-400 hidden sm:block" />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 bg-[#5B21B6] hover:bg-[#4C1D95] text-white rounded-[16px] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-purple-300" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

