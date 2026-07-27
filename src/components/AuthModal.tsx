import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  X,
  Mail,
  Lock,
  User,
  GraduationCap,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Undergraduate - Computer Science');
  const [targetExam, setTargetExam] = useState('Midterm Examinations 2026');
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode !== 'forgot' && !password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (mode === 'forgot') {
        setSuccessMessage(`Password reset link sent to ${email}! Check your inbox.`);
        return;
      }

      const loggedUser: UserProfile = {
        id: 'usr_' + Date.now().toString().slice(-6),
        name: mode === 'signup' && name ? name : email.split('@')[0].replace('.', ' '),
        email: email,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        gradeLevel: mode === 'signup' ? gradeLevel : 'Undergraduate Student',
        targetExam: mode === 'signup' ? targetExam : 'Upcoming Midterms',
        dailyHourGoal: 4.5,
        theme: 'light',
      };

      onLoginSuccess(loggedUser);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-md animate-fade-in font-['Poppins']">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 rounded-[20px] shadow-2xl overflow-hidden transition-all">
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#8B5CF6] p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[16px] bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">EduNova AI</h2>
              <p className="text-xs text-purple-200 font-medium">Smart Study Assistant Account</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-950/20">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-3 text-xs font-bold text-center transition-all ${
              mode === 'login'
                ? 'text-[#5B21B6] dark:text-[#C4B5FD] border-b-2 border-[#5B21B6] dark:border-[#8B5CF6] bg-white dark:bg-slate-900'
                : 'text-slate-500 dark:text-slate-400 hover:text-purple-900 dark:hover:text-purple-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-3 text-xs font-bold text-center transition-all ${
              mode === 'signup'
                ? 'text-[#5B21B6] dark:text-[#C4B5FD] border-b-2 border-[#5B21B6] dark:border-[#8B5CF6] bg-white dark:bg-slate-900'
                : 'text-slate-500 dark:text-slate-400 hover:text-purple-900 dark:hover:text-purple-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-[16px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-semibold">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-[16px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-purple-400" />
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-purple-400" />
              <input
                type="email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                required
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="text-xs text-[#5B21B6] dark:text-[#C4B5FD] font-bold hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-purple-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  required
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Grade / Academic Level
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3.5 top-3.5 text-purple-400" />
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="High School Senior">High School Senior</option>
                    <option value="Undergraduate - Computer Science">Undergraduate - Computer Science</option>
                    <option value="Undergraduate - Engineering / STEM">Undergraduate - Engineering / STEM</option>
                    <option value="Undergraduate - Medical / Life Sciences">Undergraduate - Medical / Life Sciences</option>
                    <option value="Postgraduate / Master's Degree">Postgraduate / Master's Degree</option>
                    <option value="Competitive Exam Candidate (SAT/GRE/MCAT)">Competitive Exam Candidate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Primary Target Exam
                </label>
                <div className="relative">
                  <Target className="w-4 h-4 absolute left-3.5 top-3.5 text-purple-400" />
                  <input
                    type="text"
                    placeholder="e.g. Fall Midterms 2026, MCAT, SAT"
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>
            </>
          )}

          {mode === 'login' && (
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#5B21B6] rounded border-purple-200 focus:ring-[#8B5CF6]"
              />
              <label htmlFor="rememberMe" className="ml-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                Keep me logged in on this browser
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 purple-gradient-btn text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : mode === 'login' ? (
              <>
                <span>Sign In to EduNova</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : mode === 'signup' ? (
              <>
                <span>Create Student Account</span>
                <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <span>Send Reset Instructions</span>
            )}
          </button>

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
                setSuccessMessage('');
              }}
              className="w-full py-2 text-xs text-slate-600 dark:text-slate-400 font-bold hover:underline text-center"
            >
              Back to Sign In
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

