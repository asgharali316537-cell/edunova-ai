import React, { useState } from 'react';
import { TopicExplanation, NoteItem } from '../../types';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  FilePlus,
  BookOpen,
  Zap,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface AIAssistantViewProps {
  onSaveToNotes: (newNote: NoteItem) => void;
  onActivityLog: (title: string, detail?: string) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  onSaveToNotes,
  onActivityLog,
}) => {
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState('Undergraduate / College');

  // API State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState<TopicExplanation | null>(null);

  // Interaction States
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [savedToNotes, setSavedToNotes] = useState(false);

  const sampleTopics = [
    'Backpropagation in Neural Networks',
    'CRISPR Gene Editing Mechanism',
    'Photosynthesis Light Reactions',
    'Schrödinger Wave Equation',
    'Supply and Demand Elasticity',
    'TCP/IP 4-Layer Architecture',
  ];

  const handleExplain = async (topicToUse?: string) => {
    const finalTopic = topicToUse || topic;
    if (!finalTopic.trim()) {
      setError('Please enter a topic to explain.');
      return;
    }

    setError('');
    setLoading(true);
    setCopied(false);
    setSavedToNotes(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: finalTopic, depth }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate topic explanation from AI');
      }

      const data: TopicExplanation = await response.json();
      setExplanation(data);
      onActivityLog(
        `Explained Topic: ${data.topic}`,
        `Depth: ${data.depth} - Generated definition, key points, & real-world analogy`
      );
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error communicating with AI service');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeechToggle = () => {
    if (!explanation) return;
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${explanation.topic}. Definition: ${explanation.definition}. Simple explanation: ${explanation.simpleExplanation}. Summary: ${explanation.shortSummary}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleCopy = () => {
    if (!explanation) return;
    const formatted = `TOPIC: ${explanation.topic}\n\nDEFINITION:\n${explanation.definition}\n\nEXPLANATION:\n${explanation.simpleExplanation}\n\nKEY POINTS:\n${explanation.keyPoints.map((k) => `• ${k}`).join('\n')}\n\nREAL LIFE EXAMPLE:\n${explanation.realLifeExample}\n\nSUMMARY:\n${explanation.shortSummary}`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSaveToNotes = () => {
    if (!explanation) return;
    const newNote: NoteItem = {
      id: `note_exp_${Date.now()}`,
      title: `${explanation.topic} - AI Explanation`,
      subject: 'General Study',
      topic: explanation.topic,
      style: 'Cornell Notes',
      createdAt: new Date().toLocaleDateString(),
      tags: ['AI-Assistant', 'Explanation', explanation.topic],
      content: `# ${explanation.topic}\n\n## Formal Definition\n${explanation.definition}\n\n## Simplified Explanation\n${explanation.simpleExplanation}\n\n## Key Takeaways\n${explanation.keyPoints.map((k) => `- ${k}`).join('\n')}\n\n## Real Life Analogy\n${explanation.realLifeExample}\n\n## Summary\n> ${explanation.shortSummary}`,
    };

    onSaveToNotes(newNote);
    setSavedToNotes(true);
    setTimeout(() => setSavedToNotes(false), 3000);
  };

  return (
    <div className="space-y-6 pb-8 font-['Poppins']">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#8B5CF6] rounded-[20px] p-6 text-white shadow-xl shadow-purple-900/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-extrabold text-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Interactive Topic Explainer</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">AI Study Assistant 💡</h2>
          <p className="text-xs md:text-sm text-purple-100/90 font-medium leading-relaxed">
            Enter any difficult concept, formula, or theorem to get a structured 5-part explanation with real-world analogies.
          </p>
        </div>
      </div>

      {/* Main Search Input & Depth Selector */}
      <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-4">
        {error && (
          <div className="p-3.5 rounded-[16px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Enter Topic / Concept to Explain
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
              placeholder="e.g. Backpropagation, Photosynthesis, Schrödinger Equation..."
              className="w-full px-4 py-3 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Academic Level
            </label>
            <select
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              className="w-full px-3.5 py-3 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="Explain Like I'm 5 (ELI5)">Explain Like I'm 5 (ELI5)</option>
              <option value="High School Student">High School Student</option>
              <option value="Undergraduate / College">Undergraduate / College</option>
              <option value="Advanced / Graduate Level">Advanced / Graduate Level</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Quick Pill Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
            <span className="text-[11px] font-extrabold text-purple-900/50 dark:text-purple-300/50 shrink-0">Try:</span>
            {sampleTopics.slice(0, 3).map((sample, i) => (
              <button
                key={i}
                onClick={() => {
                  setTopic(sample);
                  handleExplain(sample);
                }}
                className="px-3 py-1 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-[#5B21B6] dark:text-[#C4B5FD] rounded-full text-xs font-bold border border-purple-200/60 dark:border-purple-800/60 transition-all whitespace-nowrap shrink-0"
              >
                {sample}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleExplain()}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 purple-gradient-btn text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Breakdown...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Explain Topic Now</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Display Card */}
      {explanation ? (
        <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 md:p-8 shadow-sm space-y-6 animate-fade-in">
          {/* Output Toolbar Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 dark:border-purple-900/30 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#5B21B6] dark:text-[#C4B5FD] bg-purple-100/80 dark:bg-purple-950/60 px-3 py-1 rounded-full">
                {explanation.depth}
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {explanation.topic}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeechToggle}
                className={`px-3 py-2 rounded-[14px] border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSpeaking
                    ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                    : 'bg-purple-50 dark:bg-purple-950/40 text-[#5B21B6] dark:text-[#C4B5FD] border-purple-200 dark:border-purple-800'
                }`}
                title="Read Out Loud"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3 py-2 rounded-[14px] border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-[#5B21B6] dark:text-[#C4B5FD] text-xs font-bold transition-all flex items-center gap-1.5"
                title="Copy Explanation"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleSaveToNotes}
                disabled={savedToNotes}
                className="px-4 py-2 rounded-[14px] purple-gradient-btn text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                title="Save as Note"
              >
                {savedToNotes ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : (
                  <FilePlus className="w-4 h-4" />
                )}
                <span>{savedToNotes ? 'Saved to Notes!' : 'Save Note'}</span>
              </button>
            </div>
          </div>

          {/* 5-Part Explanation Grid */}
          <div className="space-y-6">
            {/* 1. Formal Definition */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-900/60 dark:text-purple-300/60 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#8B5CF6]" /> 1. Definition
              </h4>
              <p className="text-sm font-semibold text-slate-900 dark:text-white bg-purple-50/40 dark:bg-purple-950/20 p-4 rounded-[16px] border border-purple-100 dark:border-purple-900/30 leading-relaxed">
                {explanation.definition}
              </p>
            </div>

            {/* 2. Simple Explanation */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-900/60 dark:text-purple-300/60 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#8B5CF6]" /> 2. Simple Breakdown
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-purple-50/50 dark:bg-purple-950/30 p-4 rounded-[16px] border border-purple-100 dark:border-purple-900/40">
                {explanation.simpleExplanation}
              </p>
            </div>

            {/* 3. Key Points */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-900/60 dark:text-purple-300/60 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 3. Core Takeaways
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {explanation.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-purple-50/40 dark:bg-purple-950/20 rounded-[16px] border border-purple-100 dark:border-purple-900/30 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#5B21B6] text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Real-life Analogy */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" /> 4. Real-World Analogy
              </h4>
              <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 rounded-[16px] border border-amber-200/80 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                {explanation.realLifeExample}
              </div>
            </div>

            {/* 5. Memory Hack Summary */}
            <div className="p-5 bg-gradient-to-r from-[#5B21B6] to-[#8B5CF6] rounded-[20px] text-white shadow-md space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-200">
                5. Memory Hack Summary
              </span>
              <p className="text-sm font-extrabold leading-snug">{explanation.shortSummary}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-purple-200 dark:border-purple-900/40 rounded-[20px] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-[20px] bg-purple-100/80 dark:bg-purple-950/60 text-[#5B21B6] dark:text-[#C4B5FD] flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-8 h-8 text-[#8B5CF6]" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Enter Any Concept Above
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Type a topic like "Dynamic Programming" or "Mitosis" to receive an instant, multi-tiered AI explanation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

