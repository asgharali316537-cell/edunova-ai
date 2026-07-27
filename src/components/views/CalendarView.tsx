import React, { useState } from 'react';
import { TaskItem } from '../../types';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Clock,
  Filter,
  Trash2,
  AlertCircle,
  Tag,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface CalendarViewProps {
  tasks: TaskItem[];
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  onActivityLog: (title: string, detail?: string) => void;
  openTaskModal: boolean;
  setOpenTaskModal: (open: boolean) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  setTasks,
  onActivityLog,
  openTaskModal,
  setOpenTaskModal,
}) => {
  // New Task Form
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('18:00');
  const [priority, setPriority] = useState<TaskItem['priority']>('high');
  const [category, setCategory] = useState<TaskItem['category']>('Homework');

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: TaskItem = {
      id: `task_${Date.now()}`,
      title,
      subject,
      dueDate,
      dueTime,
      priority,
      completed: false,
      category,
    };

    setTasks((prev) => [newTask, ...prev]);
    setTitle('');
    setOpenTaskModal(false);
    onActivityLog(`Created Task: ${title}`, `Subject: ${subject} - Priority: ${priority.toUpperCase()}`);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = !t.completed;
          if (updated) {
            onActivityLog(`Completed Task: ${t.title}`);
          }
          return { ...t, completed: updated };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesStatus =
      statusFilter === 'all' ? true : statusFilter === 'completed' ? t.completed : !t.completed;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calendar Days calculation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="space-y-6 pb-8 font-['Poppins']">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#8B5CF6] rounded-[20px] p-6 text-white shadow-xl shadow-purple-900/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-black tracking-tight">Calendar & Task Manager 📅</h2>
          <p className="text-xs md:text-sm text-purple-100/90 font-medium leading-relaxed">
            Keep track of homework submissions, upcoming midterm dates, and AI study plan milestones.
          </p>
        </div>
        <button
          onClick={() => setOpenTaskModal(true)}
          className="px-5 py-2.5 bg-white text-[#5B21B6] hover:bg-purple-50 rounded-[16px] font-extrabold text-xs shadow-lg shadow-black/10 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#8B5CF6]" />
          <span>Add New Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Calendar Date Grid */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/30 pb-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
              {monthNames[month]} {year}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="p-1.5 text-slate-500 hover:text-[#5B21B6] dark:hover:text-[#C4B5FD] rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="p-1.5 text-slate-500 hover:text-[#5B21B6] dark:hover:text-[#C4B5FD] rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-extrabold text-purple-400">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty_${i}`} className="h-9" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
              const hasTask = tasks.some((t) => t.dueDate === dateStr);
              const isToday =
                new Date().getDate() === dayNum &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              return (
                <div
                  key={dayNum}
                  className={`h-9 rounded-[12px] flex flex-col items-center justify-center text-xs font-bold relative transition-colors ${
                    isToday
                      ? 'purple-gradient-card text-white shadow-md'
                      : 'hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span>{dayNum}</span>
                  {hasTask && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute bottom-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Task List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-4">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 dark:border-purple-900/30 pb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#8B5CF6]" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Tasks & Assignment Deadlines ({filteredTasks.length})
                </h3>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center bg-purple-50 dark:bg-purple-950/40 p-1 rounded-[14px] text-xs font-bold">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-[10px] transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-white dark:bg-slate-800 text-[#5B21B6] dark:text-[#C4B5FD] shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1 rounded-[10px] transition-colors ${
                    statusFilter === 'pending'
                      ? 'bg-white dark:bg-slate-800 text-[#5B21B6] dark:text-[#C4B5FD] shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-3 py-1 rounded-[10px] transition-colors ${
                    statusFilter === 'completed'
                      ? 'bg-white dark:bg-slate-800 text-[#5B21B6] dark:text-[#C4B5FD] shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter tasks by title or subject..."
                className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            {/* Task Item Cards */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-[16px] border transition-all flex items-start justify-between gap-3 ${
                      task.completed
                        ? 'bg-purple-50/30 dark:bg-purple-950/10 border-purple-100 dark:border-purple-900/20 opacity-60'
                        : 'bg-white dark:bg-slate-800/60 border-purple-100 dark:border-purple-900/30 shadow-sm hover:border-[#8B5CF6]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          task.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-purple-200 dark:border-purple-700 hover:border-emerald-500'
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div className="space-y-1 min-w-0">
                        <p
                          className={`text-xs md:text-sm font-bold text-slate-900 dark:text-white ${
                            task.completed ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {task.title}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          <span className="font-extrabold text-[#5B21B6] dark:text-[#C4B5FD]">
                            {task.subject}
                          </span>
                          <span>• Due {task.dueDate} {task.dueTime}</span>
                          <span
                            className={`font-extrabold px-2 py-0.5 rounded-full text-[10px] ${
                              task.priority === 'high'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                  No tasks found. Click "Add New Task" to create one!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {openTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add New Study Task</h3>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete Database Normalization HW"
                  className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High / Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenTaskModal(false)}
                  className="flex-1 py-2.5 bg-purple-50 dark:bg-purple-950/40 text-[#5B21B6] dark:text-[#C4B5FD] rounded-[16px] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 purple-gradient-btn rounded-[16px] text-xs font-bold shadow-md"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

