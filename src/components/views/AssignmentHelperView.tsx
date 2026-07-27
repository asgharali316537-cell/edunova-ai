import React, { useState } from 'react';
import { AssignmentDraft } from '../../types';
import {
  BookOpenCheck,
  Sparkles,
  Copy,
  Check,
  Download,
  FileText,
  Bookmark,
  Zap,
  ListOrdered,
  Quote,
} from 'lucide-react';

interface AssignmentHelperViewProps {
  onActivityLog: (title: string, detail?: string) => void;
}

export const AssignmentHelperView: React.FC<AssignmentHelperViewProps> = ({ onActivityLog }) => {
  const [topic, setTopic] = useState('');
  const [academicLevel, setAcademicLevel] = useState('Undergraduate');
  const [citationFormat, setCitationFormat] = useState('APA 7th Edition');

  // API State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState<AssignmentDraft | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter an assignment prompt or topic.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, academicLevel, citationFormat }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate assignment draft from AI');
      }

      const data = await response.json();
      const generatedDraft: AssignmentDraft = {
        id: `asgn_${Date.now()}`,
        topic: data.topic || topic,
        academicLevel: data.academicLevel || academicLevel,
        citationFormat: data.citationFormat || citationFormat,
        title: data.title || topic,
        introduction: data.introduction || '',
        mainHeadings: data.mainHeadings || [],
        conclusion: data.conclusion || '',
        references: data.references || [],
        createdAt: new Date().toLocaleDateString(),
      };

      setDraft(generatedDraft);
      onActivityLog(
        `Drafted Assignment: ${generatedDraft.title}`,
        `${generatedDraft.academicLevel} level - ${generatedDraft.mainHeadings.length} main sections with ${citationFormat} citations`
      );
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error creating assignment outline');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDraft = () => {
    if (!draft) return;
    const fullText = `TITLE: ${draft.title}\nACADEMIC LEVEL: ${draft.academicLevel}\nCITATIONS: ${draft.citationFormat}\n\n1. INTRODUCTION\n${draft.introduction}\n\n${draft.mainHeadings
      .map((h, i) => `${i + 2}. ${h.headingTitle}\nKey Points: ${h.keyPoints.join(', ')}\n\n${h.draftContent}`)
      .join('\n\n')}\n\nCONCLUSION\n${draft.conclusion}\n\nREFERENCES\n${draft.references.map((r) => `• ${r}`).join('\n')}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadDraft = () => {
    if (!draft) return;
    const fullText = `# ${draft.title}\n\n**Academic Level:** ${draft.academicLevel}  \n**Citation Style:** ${draft.citationFormat}  \n\n## 1. Introduction\n${draft.introduction}\n\n${draft.mainHeadings
      .map((h, i) => `## ${i + 2}. ${h.headingTitle}\n\n**Key Arguments:**\n${h.keyPoints.map((k) => `- ${k}`).join('\n')}\n\n${h.draftContent}`)
      .join('\n\n')}\n\n## Conclusion\n${draft.conclusion}\n\n## References\n${draft.references.map((r) => `- ${r}`).join('\n')}`;

    const element = document.createElement('a');
    const file = new Blob([fullText], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${draft.title.replace(/\s+/g, '_')}_Assignment.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 pb-8 font-['Poppins']">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#8B5CF6] rounded-[20px] p-6 text-white shadow-xl shadow-purple-900/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-extrabold text-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Academic Paper Consultant</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Assignment Helper 📚</h2>
          <p className="text-xs md:text-sm text-purple-100/90 font-medium leading-relaxed">
            Generate thesis statements, introduction paragraphs, structured main section headings, conclusions, and formatted references.
          </p>
        </div>
      </div>

      {/* Input Configuration Form */}
      <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-4">
        {error && (
          <div className="p-3.5 rounded-[16px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleGenerateAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Assignment Topic or Prompt Question
            </label>
            <textarea
              rows={2}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Ethical implications of Artificial Intelligence in Healthcare decision-making..."
              className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Academic Target Level
              </label>
              <select
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="High School Senior">High School Senior</option>
                <option value="Undergraduate">Undergraduate Student</option>
                <option value="Graduate / Master's">Graduate / Master's</option>
                <option value="PhD / Research Proposal">PhD / Research Proposal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Citation & Reference Format
              </label>
              <select
                value={citationFormat}
                onChange={(e) => setCitationFormat(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="APA 7th Edition">APA 7th Edition</option>
                <option value="MLA 9th Edition">MLA 9th Edition</option>
                <option value="Harvard Style">Harvard Style</option>
                <option value="Chicago Manual of Style">Chicago Manual of Style</option>
                <option value="IEEE Format">IEEE Format</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 purple-gradient-btn text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Structuring Academic Outline...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Generate Assignment Outline & References</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Rendered Assignment Output */}
      {draft ? (
        <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 md:p-8 shadow-sm space-y-6 animate-fade-in">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 dark:border-purple-900/30 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5B21B6] dark:text-[#C4B5FD] bg-purple-100/80 dark:bg-purple-950/60 px-3 py-1 rounded-full">
                  {draft.academicLevel}
                </span>
                <span className="text-xs text-slate-400 font-medium">• {draft.citationFormat}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {draft.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyDraft}
                className="px-3 py-2 rounded-[14px] border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-[#5B21B6] dark:text-[#C4B5FD] text-xs font-bold transition-all flex items-center gap-1.5"
                title="Copy Assignment Text"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Outline'}</span>
              </button>

              <button
                onClick={handleDownloadDraft}
                className="px-4 py-2 rounded-[14px] purple-gradient-btn text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                title="Download Markdown"
              >
                <Download className="w-4 h-4" />
                <span>Download .MD</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* 1. Introduction */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-900/60 dark:text-purple-300/60 flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-[#8B5CF6]" /> 1. Introduction & Thesis Statement
              </h4>
              <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed bg-purple-50/40 dark:bg-purple-950/20 p-4 rounded-[16px] border border-purple-100 dark:border-purple-900/30">
                {draft.introduction}
              </p>
            </div>

            {/* 2. Main Headings */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-900/60 dark:text-purple-300/60 flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-[#8B5CF6]" /> 2. Main Body Sections & Key Arguments
              </h4>

              <div className="space-y-4">
                {draft.mainHeadings.map((heading, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-purple-50/30 dark:bg-purple-950/20 rounded-[16px] border border-purple-100 dark:border-purple-900/30 space-y-3"
                  >
                    <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      2.{idx + 1} {heading.headingTitle}
                    </h5>

                    <div className="flex flex-wrap gap-1.5">
                      {heading.keyPoints.map((pt, pIdx) => (
                        <span
                          key={pIdx}
                          className="text-[10px] font-extrabold bg-purple-100 dark:bg-purple-900/60 text-[#5B21B6] dark:text-[#C4B5FD] px-2.5 py-1 rounded-full"
                        >
                          • {pt}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                      {heading.draftContent}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Conclusion */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-900/60 dark:text-purple-300/60 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> 3. Synthesis & Conclusion
              </h4>
              <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed bg-purple-50/40 dark:bg-purple-950/20 p-4 rounded-[16px] border border-purple-100 dark:border-purple-900/30">
                {draft.conclusion}
              </p>
            </div>

            {/* 4. References */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-900/60 dark:text-purple-300/60 flex items-center gap-1.5">
                <Quote className="w-4 h-4 text-[#8B5CF6]" /> 4. References & Works Cited ({draft.citationFormat})
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 bg-purple-50/50 dark:bg-purple-950/30 p-4 rounded-[16px] border border-purple-100 dark:border-purple-900/40 font-mono">
                {draft.references.map((ref, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#5B21B6] dark:text-[#C4B5FD] font-bold">•</span>
                    <span>{ref}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-purple-200 dark:border-purple-900/40 rounded-[20px] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-[20px] bg-purple-100/80 dark:bg-purple-950/60 text-[#5B21B6] dark:text-[#C4B5FD] flex items-center justify-center mx-auto shadow-sm">
            <BookOpenCheck className="w-8 h-8 text-[#8B5CF6]" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Need Assignment Help?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Enter your paper topic above and choose your citation format to generate a complete academic outline.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

