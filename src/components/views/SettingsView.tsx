import React, { useState } from 'react';
import { UserProfile } from '../../types';
import {
  Settings,
  Sun,
  Moon,
  User,
  GraduationCap,
  Target,
  Clock,
  Save,
  RotateCcw,
  CheckCircle2,
  Shield,
  Palette,
} from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  setUser,
  darkMode,
  setDarkMode,
  onResetData,
}) => {
  const [name, setName] = useState(user.name);
  const [gradeLevel, setGradeLevel] = useState(user.gradeLevel);
  const [targetExam, setTargetExam] = useState(user.targetExam);
  const [dailyHourGoal, setDailyHourGoal] = useState(user.dailyHourGoal);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      gradeLevel,
      targetExam,
      dailyHourGoal,
    }));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-8 font-['Poppins']">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#8B5CF6] rounded-[20px] p-6 text-white shadow-xl shadow-purple-900/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-black tracking-tight">Settings & Student Profile ⚙️</h2>
          <p className="text-xs md:text-sm text-purple-100/90 font-medium leading-relaxed">
            Customize your academic parameters, daily study target goals, and theme preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Theme & Quick Preferences */}
        <div className="space-y-6">
          {/* Theme Selector */}
          <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#8B5CF6]" />
              <span>Theme & Visual Styling</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDarkMode(false)}
                className={`p-4 rounded-[16px] border flex flex-col items-center justify-center gap-2 transition-all ${
                  !darkMode
                    ? 'bg-purple-50 border-[#8B5CF6] text-[#5B21B6] font-extrabold shadow-md'
                    : 'bg-purple-50/30 dark:bg-slate-800 border-purple-100 dark:border-purple-900/30 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-6 h-6 text-amber-500" />
                <span className="text-xs">Light Mode</span>
              </button>

              <button
                onClick={() => setDarkMode(true)}
                className={`p-4 rounded-[16px] border flex flex-col items-center justify-center gap-2 transition-all ${
                  darkMode
                    ? 'bg-purple-950 border-[#8B5CF6] text-purple-100 font-extrabold shadow-md'
                    : 'bg-purple-50/30 dark:bg-slate-800 border-purple-100 dark:border-purple-900/30 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon className="w-6 h-6 text-purple-400" />
                <span className="text-xs">Dark Mode</span>
              </button>
            </div>
          </div>

          {/* Reset App Data */}
          <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-[20px] p-6 shadow-sm space-y-3">
            <h3 className="font-extrabold text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Database Reset</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Reset all study plans, notes, task items, and activities back to factory defaults.
            </p>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all app data back to defaults?')) {
                  onResetData();
                }
              }}
              className="w-full py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 rounded-[14px] text-xs font-bold border border-rose-200 dark:border-rose-800 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset Local Application Data
            </button>
          </div>
        </div>

        {/* Right Column: Profile Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/30 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Academic Profile Settings
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Update your personal information to optimize AI recommendations.
                </p>
              </div>

              {savedSuccess && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Saved!
                </div>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Grade / Degree Level
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
                  <input
                    type="text"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Target Exam / Deadline
                </label>
                <div className="relative">
                  <Target className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
                  <input
                    type="text"
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Daily Study Goal Target (Hours)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="14"
                    value={dailyHourGoal}
                    onChange={(e) => setDailyHourGoal(parseFloat(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 purple-gradient-btn text-xs font-bold shadow-lg transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

