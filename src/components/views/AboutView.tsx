import React from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Calendar,
  HelpCircle,
  FileText,
  BookOpen,
  Bell,
  Code2,
  Globe,
  Rocket,
  ShieldCheck,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const featuresList = [
    { title: 'AI Study Planner', desc: 'Custom daily & weekly timetable generator tailored to exam dates and subject workload.', icon: Calendar },
    { title: 'AI Study Assistant', desc: '5-tier topic explainer with formal definitions, ELI5 breakdowns, and real-world analogies.', icon: Sparkles },
    { title: 'AI Quiz Generator', desc: '10-question practice tests with live timer, instant explanation, and score celebration.', icon: HelpCircle },
    { title: 'AI Notes Generator', desc: 'Synthesizes transcripts into Cornell Notes, Cheatsheets, or Mindmap structures.', icon: FileText },
    { title: 'Assignment Helper', desc: 'Generates academic thesis statements, main section outlines, conclusions, and citations.', icon: BookOpen },
    { title: 'Calendar & Tasks', desc: 'Interactive task manager with completion metrics and priority tags.', icon: Calendar },
    { title: 'Reminder System', desc: 'Custom study alerts with snooze, active notifications, and repeat options.', icon: Bell },
    { title: 'Profile & Settings', desc: 'Light/Dark purple themes, customizable study goal targets, and local persistence.', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 pb-8 font-['Poppins']">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#8B5CF6] rounded-[20px] p-8 text-white shadow-xl shadow-purple-900/20 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-extrabold text-purple-100">
          <GraduationCap className="w-4 h-4 text-purple-200" />
          <span>EduNova AI v2.5 Production Build</span>
        </div>
        <h2 className="text-3xl font-black tracking-tight">
          Smart Study Suite for High-Achieving Students 🎓
        </h2>
        <p className="text-sm text-purple-100/90 max-w-2xl leading-relaxed font-medium">
          EduNova AI is built to eliminate study anxiety, streamline exam preparation, and maximize long-term memory retention through Gemini 2.5 Flash models.
        </p>
      </div>

      {/* Feature Showcase Grid */}
      <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
          Integrated Educational Capabilities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuresList.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-[16px] bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 space-y-2.5"
              >
                <div className="w-9 h-9 rounded-[12px] bg-purple-100 dark:bg-purple-900/50 text-[#5B21B6] dark:text-[#C4B5FD] flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                    {feat.title}
                  </span>
                  <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech Stack & Deployment Readiness */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#8B5CF6]" /> Technical Architecture
          </h3>
          <ul className="text-xs text-slate-600 dark:text-slate-400 font-medium space-y-1.5">
            <li><strong>Frontend:</strong> React 19, Vite, Tailwind CSS v4, Lucide Icons</li>
            <li><strong>Animations:</strong> Motion / React 12, Canvas Confetti</li>
            <li><strong>Backend Server:</strong> Express.js custom full-stack runner with Esbuild</li>
            <li><strong>AI Engine:</strong> Google GenAI SDK with Gemini 2.5 Flash</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <Rocket className="w-4 h-4 text-emerald-600" /> Deployment Readiness
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            This repository is configured for immediate export to <strong>GitHub</strong> and deployment on <strong>Vercel</strong> or <strong>Google Cloud Run</strong>.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-[#5B21B6] dark:text-[#C4B5FD] rounded-[12px] text-xs font-bold border border-purple-100 dark:border-purple-900/30 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#8B5CF6]" /> Cloud Run / Vercel Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

