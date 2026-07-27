import React, { useState } from 'react';
import { NoteItem } from '../../types';
import {
  FileText,
  Sparkles,
  Search,
  Plus,
  Copy,
  Check,
  Download,
  Trash2,
  Edit3,
  Tag,
  BookOpen,
  Zap,
} from 'lucide-react';

interface NotesGeneratorViewProps {
  notes: NoteItem[];
  setNotes: React.Dispatch<React.SetStateAction<NoteItem[]>>;
  onActivityLog: (title: string, detail?: string) => void;
}

export const NotesGeneratorView: React.FC<NotesGeneratorViewProps> = ({
  notes,
  setNotes,
  onActivityLog,
}) => {
  // Generator Form States
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<NoteItem['style']>('Cornell Notes');
  const [rawText, setRawText] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    notes.length > 0 ? notes[0].id : null
  );

  // API State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() && !rawText.trim()) {
      setError('Please provide a topic or raw text content.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, style, rawText }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate study notes');
      }

      const data = await response.json();
      const newNote: NoteItem = {
        id: `note_${Date.now()}`,
        title: data.title || topic || 'AI Generated Notes',
        subject: 'General Study',
        topic: topic || 'Lecture Notes',
        content: data.content || '',
        createdAt: new Date().toLocaleDateString(),
        tags: data.tags || ['AI-Notes', style],
        style: style,
      };

      setNotes((prev) => [newNote, ...prev]);
      setActiveNoteId(newNote.id);
      setTopic('');
      setRawText('');
      onActivityLog(
        `Generated Study Notes: ${newNote.title}`,
        `Style: ${style} - Formatted markdown note added to library`
      );
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error generating notes');
    } finally {
      setLoading(false);
    }
  };

  const activeNote = notes.find((n) => n.id === activeNoteId) || (notes.length > 0 ? notes[0] : null);

  const allTags = ['All', ...Array.from(new Set(notes.flatMap((n) => n.tags)))];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || n.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleCopyNote = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadNote = () => {
    if (!activeNote) return;
    const element = document.createElement('a');
    const file = new Blob([activeNote.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeNote.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeNoteId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      setActiveNoteId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  return (
    <div className="space-y-6 pb-8 font-['Poppins']">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#8B5CF6] rounded-[20px] p-6 text-white shadow-xl shadow-purple-900/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-extrabold text-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Smart Note Synthesizer</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">AI Notes Generator & Library 📝</h2>
          <p className="text-xs md:text-sm text-purple-100/90 font-medium leading-relaxed">
            Convert messy lecture transcripts or topics into Cornell Notes, Cheatsheets, or Mindmap outlines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Generator Form & Notes Library List */}
        <div className="space-y-6">
          {/* Note Generator Box */}
          <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#8B5CF6]" />
              <span>Generate New Study Note</span>
            </h3>

            <form onSubmit={handleGenerateNotes} className="space-y-3.5">
              {error && (
                <div className="p-3.5 rounded-[16px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Topic / Title
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Normalization in SQL, Photosynthesis"
                  className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Note Formatting Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option value="Cornell Notes">Cornell Notes System</option>
                  <option value="Bullet Points">Hierarchical Bullet Points</option>
                  <option value="Cheatsheet">Exam Cheatsheet / Formulas</option>
                  <option value="Mindmap Style">Mindmap Breakdown Style</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Raw Text / Lecture Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste lecture transcript or textbook excerpt here..."
                  className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 purple-gradient-btn text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Formatting Notes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Synthesize Notes</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Notes Library List Box */}
          <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Saved Notes Library ({filteredNotes.length})
              </h3>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by keyword..."
                className="w-full pl-9 pr-3 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            {/* Filter Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {allTags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedTag === tag
                      ? 'bg-[#5B21B6] text-white'
                      : 'bg-purple-50 dark:bg-purple-950/40 text-[#5B21B6] dark:text-[#C4B5FD] border border-purple-100 dark:border-purple-800/60'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => {
                  const isActive = activeNoteId === note.id;
                  return (
                    <div
                      key={note.id}
                      onClick={() => setActiveNoteId(note.id)}
                      className={`p-3.5 rounded-[16px] border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                        isActive
                          ? 'bg-purple-50 dark:bg-purple-950/50 border-[#5B21B6] shadow-sm'
                          : 'bg-purple-50/20 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30 hover:border-[#8B5CF6]'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {note.title}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                          <span className="font-bold text-[#5B21B6] dark:text-[#C4B5FD]">
                            {note.style}
                          </span>
                          <span>• {note.createdAt}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 font-medium">
                  No notes found matching search.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Note Reader & Editor */}
        <div className="lg:col-span-2">
          {activeNote ? (
            <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 md:p-8 shadow-sm space-y-6 animate-fade-in">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 dark:border-purple-900/30 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5B21B6] dark:text-[#C4B5FD] bg-purple-100/80 dark:bg-purple-950/60 px-3 py-1 rounded-full">
                      {activeNote.style}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{activeNote.createdAt}</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                    {activeNote.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyNote}
                    className="px-3 py-2 rounded-[14px] border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-[#5B21B6] dark:text-[#C4B5FD] text-xs font-bold transition-all flex items-center gap-1.5"
                    title="Copy Note Text"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownloadNote}
                    className="px-4 py-2 rounded-[14px] purple-gradient-btn text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                    title="Download Markdown"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .MD</span>
                  </button>
                </div>
              </div>

              {/* Note Rendered Content Area */}
              <div className="bg-purple-50/30 dark:bg-purple-950/20 p-6 rounded-[16px] border border-purple-100 dark:border-purple-900/30 text-xs md:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                {activeNote.content}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-dashed border-purple-200 dark:border-purple-900/40 rounded-[20px] p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-[20px] bg-purple-100/80 dark:bg-purple-950/60 text-[#5B21B6] dark:text-[#C4B5FD] flex items-center justify-center mx-auto shadow-sm">
                <FileText className="w-8 h-8 text-[#8B5CF6]" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  No Note Selected
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Select a note from the library on the left or generate a new study note using AI above.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

