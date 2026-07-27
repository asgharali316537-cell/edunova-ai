import React from 'react';
import { NavView, StudyGoal, TaskItem, RecentActivity, UserProfile } from '../../types';
import {
  Flame,
  Clock,
  CheckCircle2,
  Plus,
  Sparkles,
  Calendar,
  HelpCircle,
  FileText,
  BookOpen,
  TrendingUp,
  Award,
  BookOpenCheck,
  Target,
  Zap,
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  studyGoal: StudyGoal;
  setStudyGoal: React.Dispatch<React.SetStateAction<StudyGoal>>;
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  activities: RecentActivity[];
  setCurrentView: (view: NavView) => void;
  onOpenTaskModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  studyGoal,
  setStudyGoal,
  tasks,
  onToggleTask,
  activities,
  setCurrentView,
  onOpenTaskModal,
}) => {
  const upcomingTasks = tasks.filter((t) => !t.completed).slice(0, 4);
  const goalPercent = Math.min(
    100,
    Math.round((studyGoal.completedHours / studyGoal.targetHours) * 100)
  );

  const handleAddHour = () => {
    setStudyGoal((prev) => ({
      ...prev,
      completedHours: Math.min(prev.targetHours + 2, +(prev.completedHours + 0.5).toFixed(1)),
    }));
  };

  return (
    <div className="space-y-6 pb-8 font-['Poppins']">
      {/* Cute Welcome Banner */}
      <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#8B5CF6] p-6 md:p-8 text-white shadow-xl shadow-purple-900/20">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 top-6 w-32 h-32 bg-amber-300/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-purple-100 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Smart AI Study Mode Active</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              Welcome back, <span className="text-[#C4B5FD]">{user.name}</span>! 🎓
            </h2>
            <p className="text-xs md:text-sm text-purple-100/90 leading-relaxed font-medium">
              You are preparing for <strong className="text-white underline decoration-amber-300 decoration-2">{user.targetExam}</strong>. You have a <strong className="text-amber-300 font-extrabold">{studyGoal.streakDays}-day active study streak</strong> today!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('study-planner')}
              className="px-5 py-3 bg-white text-[#5B21B6] hover:bg-purple-50 rounded-[16px] font-extrabold text-xs md:text-sm shadow-xl hover:scale-[1.03] transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#8B5CF6]" />
              <span>View Today's AI Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'AI Study Planner', view: 'study-planner' as NavView, icon: Calendar, color: 'bg-purple-100/80 text-[#5B21B6] dark:bg-purple-950/50 dark:text-[#C4B5FD] border-purple-200 dark:border-purple-800' },
          { label: 'Ask AI Assistant', view: 'ai-assistant' as NavView, icon: Sparkles, color: 'bg-purple-100/80 text-[#5B21B6] dark:bg-purple-950/50 dark:text-[#C4B5FD] border-purple-200 dark:border-purple-800' },
          { label: 'Practice Quiz', view: 'quiz' as NavView, icon: HelpCircle, color: 'bg-amber-100/80 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
          { label: 'Format Notes', view: 'notes' as NavView, icon: FileText, color: 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
          { label: 'Draft Assignment', view: 'assignment' as NavView, icon: BookOpenCheck, color: 'bg-indigo-100/80 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
          { label: 'Add Task', action: onOpenTaskModal, icon: Plus, color: 'bg-rose-100/80 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
        ].map((act, i) => {
          const Icon = act.icon;
          return (
            <button
              key={i}
              onClick={() => (act.view ? setCurrentView(act.view) : act.action?.())}
              className={`p-4 rounded-[20px] border ${act.color} bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all flex flex-col items-center justify-center text-center gap-2.5 group`}
            >
              <div className="p-2.5 rounded-[14px] bg-white/80 dark:bg-slate-800 group-hover:scale-110 transition-transform shadow-xs">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold leading-tight">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Goal Tracker + Progress + Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Today's Study Goal */}
        <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-900/60 dark:text-purple-300/60 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#8B5CF6]" /> Today's Goal
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-extrabold border border-amber-200/80 dark:border-amber-800">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
                <span>{studyGoal.streakDays} Day Streak</span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {studyGoal.completedHours}{' '}
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    / {studyGoal.targetHours} Hours
                  </span>
                </span>
                <span className="text-sm font-black text-[#5B21B6] dark:text-[#C4B5FD]">{goalPercent}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3.5 bg-purple-50 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-purple-100 dark:border-purple-900/20">
                <div
                  className="h-full bg-gradient-to-r from-[#5B21B6] to-[#8B5CF6] rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${goalPercent}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {goalPercent >= 100
                ? '🎉 Target crushed! Excellent effort today.'
                : `Stay focused! Just ${(studyGoal.targetHours - studyGoal.completedHours).toFixed(1)} hours remaining to hit your target.`}
            </p>
          </div>

          <div className="pt-4 border-t border-purple-100 dark:border-purple-900/30 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Log Study Time:
            </span>
            <button
              onClick={handleAddHour}
              className="px-3.5 py-1.5 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-[#5B21B6] dark:text-[#C4B5FD] rounded-[12px] text-xs font-bold border border-purple-200 dark:border-purple-800 transition-all flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> +30 mins
            </button>
          </div>
        </div>

        {/* Card 2: Subject Mastery Progress */}
        <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-4 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
              <span>Subject Mastery</span>
            </h3>
            <button
              onClick={() => setCurrentView('calendar')}
              className="text-xs text-[#5B21B6] dark:text-[#C4B5FD] font-bold hover:underline"
            >
              Details
            </button>
          </div>

          <div className="space-y-3.5">
            {studyGoal.subjectsProgress.map((subj, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                    {subj.subject}
                  </span>
                  <span className="text-[#5B21B6] dark:text-[#C4B5FD]">{subj.progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-purple-50 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-purple-100/50 dark:border-purple-900/20">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${subj.progressPercent}%`,
                      backgroundColor: subj.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Upcoming Tasks */}
        <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8B5CF6]" />
                <span>Upcoming Tasks</span>
              </h3>
              <button
                onClick={() => setCurrentView('calendar')}
                className="text-xs text-[#5B21B6] dark:text-[#C4B5FD] font-bold hover:underline"
              >
                View All ({tasks.length})
              </button>
            </div>

            <div className="space-y-2">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-[16px] bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100/80 dark:border-purple-900/30 flex items-start justify-between gap-2 transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                        <span>Due {task.dueDate}</span>
                        <span
                          className={`font-extrabold px-2 py-0.5 rounded-full text-[10px] ${
                            task.priority === 'high'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                              : 'bg-purple-100 text-[#5B21B6] dark:bg-purple-900/60 dark:text-[#C4B5FD]'
                          }`}
                        >
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="text-purple-300 hover:text-emerald-500 transition-colors p-1"
                      title="Mark Task Complete"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                  No upcoming tasks. Click "Add Task" to create one!
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onOpenTaskModal}
            className="w-full py-2.5 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-[#5B21B6] dark:text-[#C4B5FD] rounded-[16px] text-xs font-bold transition-all border border-purple-200 dark:border-purple-800 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Homework or Exam Task
          </button>
        </div>
      </div>

      {/* Recent Activity Log Section */}
      <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-4 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Recent Activity & AI History</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Track your generated quizzes, notes, study plans, and assistant chats.
            </p>
          </div>
          <Award className="w-6 h-6 text-[#8B5CF6]" />
        </div>

        <div className="divide-y divide-purple-100/50 dark:divide-purple-900/20">
          {activities.map((act) => (
            <div key={act.id} className="py-3 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-[14px] bg-purple-100/80 dark:bg-purple-950/60 text-[#5B21B6] dark:text-[#C4B5FD] flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {act.title}
                  </p>
                  {act.detail && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{act.detail}</p>
                  )}
                </div>
              </div>

              <span className="text-[11px] font-bold text-purple-400 whitespace-nowrap">
                {act.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

