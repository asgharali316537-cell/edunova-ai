import React, { useState } from 'react';
import { GeneratedStudyPlan, TaskItem } from '../../types';
import {
  CalendarDays,
  Sparkles,
  Clock,
  Target,
  CheckCircle2,
  Plus,
  Zap,
  ListOrdered,
  Lightbulb,
} from 'lucide-react';

interface StudyPlannerViewProps {
  onAddTasksFromPlan: (newTasks: TaskItem[]) => void;
  onActivityLog: (title: string, detail?: string) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  onAddTasksFromPlan,
  onActivityLog,
}) => {
  // Input states
  const [examName, setExamName] = useState('Fall Midterm Examinations 2026');
  const [examDate, setExamDate] = useState('2026-08-15');
  const [subjectsText, setSubjectsText] = useState('Data Structures, Database Systems, Artificial Intelligence, Discrete Math');
  const [dailyHours, setDailyHours] = useState(4.5);
  const [targetGoal, setTargetGoal] = useState('Top Grade A+ (GPA 3.9+)');
  const [timeWindow, setTimeWindow] = useState('Evening & Afternoon');

  // API State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<GeneratedStudyPlan | null>(null);
  const [addedTasksSuccess, setAddedTasksSuccess] = useState(false);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setAddedTasksSuccess(false);

    try {
      const subjectsArray = subjectsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const response = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examName,
          examDate,
          subjects: subjectsArray,
          dailyHours,
          targetGoal,
          studyTimePreference: timeWindow,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate study plan from AI service');
      }

      const data: GeneratedStudyPlan = await response.json();
      setPlan(data);
      onActivityLog(
        `Generated AI Study Plan: ${examName}`,
        `${data.weeklySchedule.length} days planned for ${subjectsArray.length} subjects`
      );
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Something went wrong while generating your study plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPlanToTasks = () => {
    if (!plan) return;

    const generatedTasks: TaskItem[] = plan.weeklySchedule.flatMap((item, idx) => {
      return item.topics.map((topic, tIdx) => ({
        id: `task_plan_${Date.now()}_${idx}_${tIdx}`,
        title: `[AI Plan] ${topic} (${item.focusSubject})`,
        subject: item.focusSubject,
        dueDate: new Date(Date.now() + 86400000 * (idx + 1)).toISOString().split('T')[0],
        dueTime: '18:00',
        priority: idx < 3 ? 'high' : 'medium',
        completed: false,
        category: 'Revision',
      }));
    });

    onAddTasksFromPlan(generatedTasks);
    setAddedTasksSuccess(true);
    setTimeout(() => setAddedTasksSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 pb-8 font-['Poppins']">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#8B5CF6] rounded-[20px] p-6 text-white shadow-xl shadow-purple-900/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-extrabold text-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Gemini 3.6 Flash Powered</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">AI Personalized Study Planner 📅</h2>
          <p className="text-xs md:text-sm text-purple-100/90 font-medium leading-relaxed">
            Turn your exam date and subject list into an optimized day-by-day timetable engineered for maximum memory retention.
          </p>
        </div>
        <CalendarDays className="w-12 h-12 text-white/20 hidden md:block shrink-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-[#8B5CF6]" />
            <span>Exam & Subject Setup</span>
          </h3>

          <form onSubmit={handleGeneratePlan} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-[16px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Exam / Goal Name
              </label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="e.g. Fall Midterms 2026, MCAT Exam"
                className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Exam Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Daily Budget
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="14"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                    className="w-full px-3 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                  <span className="text-xs text-purple-900/60 dark:text-purple-300/60 font-bold">hrs</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Subjects (Comma-Separated)
              </label>
              <textarea
                rows={3}
                value={subjectsText}
                onChange={(e) => setSubjectsText(e.target.value)}
                placeholder="e.g. Calculus, Physics, Organic Chemistry, World History"
                className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Outcome / Grade Goal
              </label>
              <input
                type="text"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                placeholder="e.g. Grade A+, Score 90%+"
                className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Preferred Study Window
              </label>
              <select
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="Morning & Early Afternoon">Morning & Early Afternoon</option>
                <option value="Afternoon & Evening">Afternoon & Evening</option>
                <option value="Late Night Focus Hours">Late Night Focus Hours</option>
                <option value="Flexible / Intermittent Blocks">Flexible / Intermittent Blocks</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 purple-gradient-btn text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Calculating Timetable...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>Generate AI Timetable</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Generated Plan Display */}
        <div className="lg:col-span-2 space-y-6">
          {plan ? (
            <div className="space-y-6 animate-fade-in">
              {/* Executive Summary Card */}
              <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 dark:border-purple-900/30 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {plan.examName} Strategy
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Daily Budget: <strong className="text-[#5B21B6] dark:text-[#C4B5FD]">{plan.dailyHours} Hours/Day</strong>
                    </p>
                  </div>

                  <button
                    onClick={handleExportPlanToTasks}
                    disabled={addedTasksSuccess}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[16px] text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
                  >
                    {addedTasksSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Saved to Tasks Calendar!
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Save Schedule to Tasks
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-purple-50/50 dark:bg-purple-950/30 p-4 rounded-[16px] border border-purple-100 dark:border-purple-900/40">
                  {plan.summary}
                </p>

                {/* Milestones Roadmap */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-900/60 dark:text-purple-300/60 flex items-center gap-1.5">
                    <ListOrdered className="w-4 h-4 text-[#8B5CF6]" /> Key Milestones
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {plan.milestones.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-purple-50/40 dark:bg-purple-950/20 rounded-[14px] border border-purple-100 dark:border-purple-900/30 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-start gap-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#5B21B6] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Day-by-Day Timetable Cards */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-[#8B5CF6]" />
                  <span>7-Day Strategic Timetable</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {plan.weeklySchedule.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-4.5 shadow-sm hover:shadow-md transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between border-b border-purple-100/60 dark:border-purple-900/20 pb-2">
                        <span className="text-xs font-extrabold text-[#5B21B6] dark:text-[#C4B5FD] bg-purple-100/70 dark:bg-purple-950/60 px-2.5 py-1 rounded-[10px]">
                          {item.day}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" /> {item.timeSlot}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-purple-900/50 dark:text-purple-300/50">
                          Focus Subject
                        </span>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.focusSubject}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-purple-900/50 dark:text-purple-300/50">
                          Key Topics
                        </span>
                        <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 mt-1 font-medium">
                          {item.topics.map((t, tIdx) => (
                            <li key={tIdx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shrink-0" />
                              <span className="truncate">{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Study Tips */}
              <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 rounded-[20px] p-5 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" /> Memory Recall Tips
                </h4>
                <ul className="space-y-1.5 text-xs font-medium text-amber-950 dark:text-amber-200">
                  {plan.studyTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-dashed border-purple-200 dark:border-purple-900/40 rounded-[20px] p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-[20px] bg-purple-100/80 dark:bg-purple-950/60 text-[#5B21B6] dark:text-[#C4B5FD] flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-8 h-8 text-[#8B5CF6]" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  No Active Study Plan Generated
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Fill in your target exam details and subjects on the left panel to let EduNova AI build your personalized study schedule!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

