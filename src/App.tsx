/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavView, UserProfile, StudyGoal, TaskItem, ReminderItem, RecentActivity, NoteItem } from './types';
import {
  initialUser,
  initialStudyGoal,
  initialTasks,
  initialReminders,
  initialActivities,
  initialNotes,
} from './data/initialData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';

import { DashboardView } from './components/views/DashboardView';
import { StudyPlannerView } from './components/views/StudyPlannerView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { QuizGeneratorView } from './components/views/QuizGeneratorView';
import { NotesGeneratorView } from './components/views/NotesGeneratorView';
import { AssignmentHelperView } from './components/views/AssignmentHelperView';
import { CalendarView } from './components/views/CalendarView';
import { RemindersView } from './components/views/RemindersView';
import { SettingsView } from './components/views/SettingsView';
import { AboutView } from './components/views/AboutView';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auth State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('edunova_auth') === 'true';
  });
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('edunova_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('edunova_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Application Data States (with localStorage persistence)
  const [studyGoal, setStudyGoal] = useState<StudyGoal>(() => {
    const saved = localStorage.getItem('edunova_goal');
    return saved ? JSON.parse(saved) : initialStudyGoal;
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('edunova_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const saved = localStorage.getItem('edunova_reminders');
    return saved ? JSON.parse(saved) : initialReminders;
  });

  const [activities, setActivities] = useState<RecentActivity[]>(() => {
    const saved = localStorage.getItem('edunova_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('edunova_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });

  // Quick Task Modal
  const [quickTaskModalOpen, setQuickTaskModalOpen] = useState(false);

  // Dark Mode Class Sync Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('edunova_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('edunova_theme', 'light');
    }
  }, [darkMode]);

  // Persist Data Changes
  useEffect(() => {
    localStorage.setItem('edunova_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('edunova_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('edunova_goal', JSON.stringify(studyGoal));
  }, [studyGoal]);

  useEffect(() => {
    localStorage.setItem('edunova_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('edunova_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('edunova_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('edunova_notes', JSON.stringify(notes));
  }, [notes]);

  // Helper function to log recent activities
  const logActivity = (title: string, detail?: string) => {
    const newAct: RecentActivity = {
      id: `act_${Date.now()}`,
      type: 'task',
      title,
      timestamp: 'Just now',
      detail,
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 15)]);
  };

  // Handlers
  const handleLoginSuccess = (loggedUser: UserProfile) => {
    setUser(loggedUser);
    setIsAuthenticated(true);
    logActivity(`User Logged In: ${loggedUser.name}`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(initialUser);
    localStorage.removeItem('edunova_auth');
  };

  const handleResetData = () => {
    setUser(initialUser);
    setStudyGoal(initialStudyGoal);
    setTasks(initialTasks);
    setReminders(initialReminders);
    setActivities(initialActivities);
    setNotes(initialNotes);
    localStorage.clear();
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTasksFromPlan = (newPlanTasks: TaskItem[]) => {
    setTasks((prev) => [...newPlanTasks, ...prev]);
  };

  const handleSaveNoteFromAssistant = (newNote: NoteItem) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  const activeRemindersCount = reminders.filter((r) => !r.isCompleted).length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activeRemindersCount={activeRemindersCount}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isAuthenticated={isAuthenticated}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        userName={user.name}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          setMobileOpen={setMobileOpen}
          user={user}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          reminders={reminders}
          onToggleReminder={handleToggleReminder}
          isAuthenticated={isAuthenticated}
          onOpenAuth={() => setAuthModalOpen(true)}
          onQuickTaskClick={() => setQuickTaskModalOpen(true)}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              user={user}
              studyGoal={studyGoal}
              setStudyGoal={setStudyGoal}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              activities={activities}
              setCurrentView={setCurrentView}
              onOpenTaskModal={() => setQuickTaskModalOpen(true)}
            />
          )}

          {currentView === 'study-planner' && (
            <StudyPlannerView
              onAddTasksFromPlan={handleAddTasksFromPlan}
              onActivityLog={logActivity}
            />
          )}

          {currentView === 'ai-assistant' && (
            <AIAssistantView
              onSaveToNotes={handleSaveNoteFromAssistant}
              onActivityLog={logActivity}
            />
          )}

          {currentView === 'quiz' && (
            <QuizGeneratorView onActivityLog={logActivity} />
          )}

          {currentView === 'notes' && (
            <NotesGeneratorView
              notes={notes}
              setNotes={setNotes}
              onActivityLog={logActivity}
            />
          )}

          {currentView === 'assignment' && (
            <AssignmentHelperView onActivityLog={logActivity} />
          )}

          {currentView === 'calendar' && (
            <CalendarView
              tasks={tasks}
              setTasks={setTasks}
              onActivityLog={logActivity}
              openTaskModal={quickTaskModalOpen}
              setOpenTaskModal={setQuickTaskModalOpen}
            />
          )}

          {currentView === 'reminders' && (
            <RemindersView
              reminders={reminders}
              setReminders={setReminders}
              onActivityLog={logActivity}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              user={user}
              setUser={setUser}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onResetData={handleResetData}
            />
          )}

          {currentView === 'about' && <AboutView />}
        </main>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
