import React, { useState } from 'react';
import { ReminderItem } from '../../types';
import {
  Bell,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface RemindersViewProps {
  reminders: ReminderItem[];
  setReminders: React.Dispatch<React.SetStateAction<ReminderItem[]>>;
  onActivityLog: (title: string, detail?: string) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  setReminders,
  onActivityLog,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('18:00');
  const [subject, setSubject] = useState('Computer Science');
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly'>('none');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRem: ReminderItem = {
      id: `rem_${Date.now()}`,
      title,
      date,
      time,
      subject,
      isCompleted: false,
      repeat,
    };

    setReminders((prev) => [newRem, ...prev]);
    setTitle('');
    setIsModalOpen(false);
    onActivityLog(`Created Reminder: ${title}`, `Alert set for ${date} at ${time}`);
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const activeReminders = reminders.filter((r) => !r.isCompleted);
  const completedReminders = reminders.filter((r) => r.isCompleted);

  return (
    <div className="space-y-6 pb-8 font-['Poppins']">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#8B5CF6] rounded-[20px] p-6 text-white shadow-xl shadow-purple-900/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-black tracking-tight">Study Reminder System ⏰</h2>
          <p className="text-xs md:text-sm text-purple-100/90 font-medium leading-relaxed">
            Set automated alerts for group study sessions, mock quizzes, and exam deadlines.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-white text-[#5B21B6] hover:bg-purple-50 rounded-[16px] font-extrabold text-xs shadow-lg shadow-black/10 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#8B5CF6]" />
          <span>New Study Alert</span>
        </button>
      </div>

      {/* Active Reminders List */}
      <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/30 pb-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#8B5CF6]" />
            <span>Active Study Reminders ({activeReminders.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {activeReminders.length > 0 ? (
            activeReminders.map((rem) => (
              <div
                key={rem.id}
                className="p-4 bg-purple-50/40 dark:bg-purple-950/20 rounded-[16px] border border-purple-100 dark:border-purple-900/30 flex items-start justify-between gap-3 shadow-sm hover:border-[#8B5CF6]/50 transition-all"
              >
                <div className="space-y-1.5 min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B21B6] dark:text-[#C4B5FD] bg-purple-100 dark:bg-purple-900/60 px-2.5 py-0.5 rounded-full">
                    {rem.subject || 'General'}
                  </span>
                  <p className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">
                    {rem.title}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" /> {rem.date} at {rem.time}
                    </span>
                    {rem.repeat !== 'none' && (
                      <span className="text-xs text-[#8B5CF6] font-extrabold">• Repeat: {rem.repeat}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleReminder(rem.id)}
                    className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors"
                    title="Mark Done"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteReminder(rem.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete Reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-8 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
              🎉 All reminders completed! Click "New Study Alert" to schedule one.
            </div>
          )}
        </div>
      </div>

      {/* Completed History */}
      {completedReminders.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-3 opacity-70">
          <h3 className="font-extrabold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider">
            Completed Reminders ({completedReminders.length})
          </h3>
          <div className="space-y-2">
            {completedReminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3 bg-purple-50/20 dark:bg-purple-950/10 rounded-[14px] border border-purple-100 dark:border-purple-900/20 flex items-center justify-between gap-2 text-xs"
              >
                <div className="line-through text-slate-500 dark:text-slate-400 font-medium">
                  {rem.title} ({rem.subject})
                </div>
                <button
                  onClick={() => handleDeleteReminder(rem.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">New Study Reminder</h3>

            <form onSubmit={handleCreateReminder} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reminder Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Group Quiz Session on Algorithms"
                  className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Data Structures"
                  className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Alert Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-purple-50 dark:bg-purple-950/40 text-[#5B21B6] dark:text-[#C4B5FD] rounded-[16px] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 purple-gradient-btn rounded-[16px] text-xs font-bold shadow-md"
                >
                  Save Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

