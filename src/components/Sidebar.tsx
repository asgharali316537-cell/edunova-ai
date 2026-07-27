import React from 'react';
import { NavView } from '../types';
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  HelpCircle,
  FileText,
  BookOpenCheck,
  Calendar as CalendarIcon,
  Bell,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
  UserCheck,
} from 'lucide-react';

interface SidebarProps {
  currentView: NavView;
  setCurrentView: (view: NavView) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activeRemindersCount: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  collapsed,
  setCollapsed,
  activeRemindersCount,
  mobileOpen,
  setMobileOpen,
  isAuthenticated,
  onOpenAuth,
  onLogout,
  userName = 'Student',
}) => {
  const navItems: Array<{ id: NavView; label: string; icon: React.FC<{ className?: string }>; badge?: number }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'study-planner', label: 'AI Study Planner', icon: CalendarDays },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'quiz', label: 'Quiz Generator', icon: HelpCircle },
    { id: 'notes', label: 'Notes Generator', icon: FileText },
    { id: 'assignment', label: 'Assignment Helper', icon: BookOpenCheck },
    { id: 'calendar', label: 'Calendar & Tasks', icon: CalendarIcon },
    { id: 'reminders', label: 'Reminders', icon: Bell, badge: activeRemindersCount },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About EduNova', icon: Info },
  ];

  const handleNavClick = (viewId: NavView) => {
    setCurrentView(viewId);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#180d30] text-white border-r border-purple-900/40 select-none font-['Poppins']">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-900/40">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleNavClick('dashboard')}
        >
          <div className="w-11 h-11 rounded-[16px] bg-gradient-to-tr from-[#5B21B6] via-[#7C3AED] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-purple-600/30 shrink-0 transition-transform group-hover:scale-105">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-wide leading-tight truncate">
                  EduNova
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-[#8B5CF6] text-white shadow-sm">
                  AI
                </span>
              </div>
              <span className="text-[11px] text-purple-200/70 font-medium truncate">Smart Study Suite</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 text-purple-300 hover:text-white hover:bg-purple-900/40 rounded-xl transition-all"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-[16px] text-xs font-semibold transition-all relative group ${
                isActive
                  ? 'bg-gradient-to-r from-[#5B21B6] to-[#8B5CF6] text-white shadow-lg shadow-purple-900/40 font-bold scale-[1.01]'
                  : 'text-purple-200/80 hover:bg-purple-900/30 hover:text-white'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-purple-300/70 group-hover:text-purple-200'
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}

              {/* Badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`ml-auto text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                    collapsed ? 'absolute top-1.5 right-1.5 px-1 py-0 text-[10px]' : ''
                  } ${
                    isActive ? 'bg-white text-[#5B21B6]' : 'bg-purple-500/30 text-purple-200 border border-purple-400/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Footer Card */}
      <div className="p-3.5 border-t border-purple-900/40 bg-[#120826]/80">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5B21B6] to-[#8B5CF6] flex items-center justify-center text-white font-bold shrink-0 border-2 border-purple-300/30 shadow-md">
              {userName.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{userName}</p>
                <span className="inline-flex items-center text-[11px] text-emerald-300 font-medium">
                  <UserCheck className="w-3 h-3 mr-1 text-emerald-400" /> Active Student
                </span>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={onLogout}
                className="p-2 text-purple-300 hover:text-rose-300 hover:bg-rose-500/20 rounded-xl transition-all"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {!collapsed ? (
              <button
                onClick={onOpenAuth}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-[#5B21B6] to-[#8B5CF6] hover:from-[#4C1D95] hover:to-[#7C3AED] text-white rounded-[16px] text-xs font-bold shadow-md shadow-purple-900/40 transition-all flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4" /> Sign In / Sign Up
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="w-10 h-10 mx-auto bg-[#5B21B6] hover:bg-[#7C3AED] text-white rounded-[16px] flex items-center justify-center transition-all shadow-md"
                title="Sign In"
              >
                <GraduationCap className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block h-screen sticky top-0 z-30 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-purple-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

