import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizSet } from '../../types';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ArrowRight,
  Zap,
  BookOpen,
} from 'lucide-react';

interface QuizGeneratorViewProps {
  onActivityLog: (title: string, detail?: string) => void;
}

export const QuizGeneratorView: React.FC<QuizGeneratorViewProps> = ({ onActivityLog }) => {
  // Input fields
  const [topic, setTopic] = useState('Data Structures & Algorithms');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questionCount, setQuestionCount] = useState(10);

  // API State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quizSet, setQuizSet] = useState<QuizSet | null>(null);

  // Quiz Playing State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => setTimerSeconds((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleGenerateQuiz = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a quiz topic.');
      return;
    }

    setError('');
    setLoading(true);
    setQuizSet(null);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setShowExplanation({});
    setQuizSubmitted(false);
    setTimerSeconds(0);
    setIsTimerRunning(false);

    try {
      const response = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, questionCount }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz from AI');
      }

      const data = await response.json();
      const generatedQuiz: QuizSet = {
        id: `quiz_${Date.now()}`,
        topic: data.topic || topic,
        difficulty: (data.difficulty as any) || difficulty,
        createdAt: new Date().toLocaleDateString(),
        questions: data.questions || [],
      };

      setQuizSet(generatedQuiz);
      setIsTimerRunning(true);
      onActivityLog(
        `Generated Quiz: ${generatedQuiz.topic}`,
        `${generatedQuiz.questions.length} questions (${generatedQuiz.difficulty} difficulty)`
      );
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error generating quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    setShowExplanation((prev) => ({ ...prev, [qIdx]: true }));
  };

  const handleSubmitQuiz = () => {
    if (!quizSet) return;
    setIsTimerRunning(false);
    setQuizSubmitted(true);

    // Calculate score
    let score = 0;
    quizSet.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        score += 1;
      }
    });

    const percent = Math.round((score / quizSet.questions.length) * 100);
    if (percent >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    onActivityLog(
      `Completed Quiz: ${quizSet.topic}`,
      `Score: ${score}/${quizSet.questions.length} (${percent}%) - Time: ${formatTimer(timerSeconds)}`
    );
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculateScore = () => {
    if (!quizSet) return { score: 0, total: 0, percent: 0 };
    let score = 0;
    quizSet.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        score += 1;
      }
    });
    return {
      score,
      total: quizSet.questions.length,
      percent: Math.round((score / quizSet.questions.length) * 100),
    };
  };

  return (
    <div className="space-y-6 pb-8 font-['Poppins']">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#8B5CF6] rounded-[20px] p-6 text-white shadow-xl shadow-purple-900/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-extrabold text-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Practice Test Engine</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">AI Quiz Generator ❓</h2>
          <p className="text-xs md:text-sm text-purple-100/90 font-medium leading-relaxed">
            Generate 10 randomized multiple-choice questions on any subject to test your knowledge before exams.
          </p>
        </div>
      </div>

      {/* Quiz Creator Form */}
      <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 shadow-sm space-y-4">
        {error && (
          <div className="p-3.5 rounded-[16px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleGenerateQuiz} className="grid grid-cols-1 md:grid-cols-4 gap-3.5 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Topic or Subject
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Data Structures, Cell Biology, Organic Chemistry"
              className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-[16px] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard / Exam Level</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 purple-gradient-btn text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Building Test...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Generate 10 Questions</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Active Quiz Area */}
      {quizSet && quizSet.questions.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Bar with Timer & Progress */}
          <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold bg-purple-100 dark:bg-purple-950/60 text-[#5B21B6] dark:text-[#C4B5FD] px-3 py-1 rounded-full">
                {quizSet.topic} ({quizSet.difficulty})
              </span>
              <span className="text-xs font-bold text-slate-500">
                Question {currentQuestionIdx + 1} of {quizSet.questions.length}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-purple-50 dark:bg-purple-950/40 px-3 py-1.5 rounded-[12px] border border-purple-100 dark:border-purple-800">
                <Clock className="w-4 h-4 text-[#8B5CF6]" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[14px] text-xs font-bold transition-all shadow-md"
                >
                  Submit Test
                </button>
              ) : (
                <button
                  onClick={() => handleGenerateQuiz()}
                  className="px-4 py-1.5 purple-gradient-btn text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake
                </button>
              )}
            </div>
          </div>

          {/* Current Question Display Card */}
          {(() => {
            const currentQ = quizSet.questions[currentQuestionIdx];
            const isAnswered = selectedAnswers[currentQuestionIdx] !== undefined;
            const selectedOpt = selectedAnswers[currentQuestionIdx];

            return (
              <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-[20px] p-6 md:p-8 shadow-sm space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#5B21B6] dark:text-[#C4B5FD]">
                    Question {currentQuestionIdx + 1}
                  </span>
                  <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                    {currentQ.question}
                  </h3>
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    const isCorrect = currentQ.correctAnswerIndex === optIdx;

                    let btnStyle =
                      'bg-purple-50/40 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30 text-slate-800 dark:text-slate-200 hover:border-[#8B5CF6]';

                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle =
                          'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle =
                          'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 font-bold';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-purple-100 dark:bg-purple-900/50 border-[#5B21B6] text-[#5B21B6] dark:text-[#C4B5FD] font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(currentQuestionIdx, optIdx)}
                        className={`w-full text-left p-4 rounded-[16px] border transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-[10px] bg-purple-100 dark:bg-purple-900/60 text-[#5B21B6] dark:text-[#C4B5FD] font-extrabold text-xs flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="text-xs md:text-sm font-medium">{opt}</span>
                        </div>

                        {isAnswered && (
                          <span>
                            {isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : isSelected ? (
                              <XCircle className="w-5 h-5 text-rose-500" />
                            ) : null}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Instant Explanation Box */}
                {isAnswered && (
                  <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 rounded-[16px] space-y-1 text-xs leading-relaxed animate-fade-in font-medium">
                    <span className="font-extrabold text-[#5B21B6] dark:text-[#C4B5FD] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#8B5CF6]" /> Solution Explanation:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300">{currentQ.explanation}</p>
                  </div>
                )}

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-purple-100 dark:border-purple-900/30">
                  <button
                    onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIdx === 0}
                    className="px-4 py-2 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-[#5B21B6] dark:text-[#C4B5FD] rounded-[14px] text-xs font-bold disabled:opacity-40 transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1.5">
                    {quizSet.questions.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentQuestionIdx(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          currentQuestionIdx === i
                            ? 'bg-[#5B21B6] scale-125'
                            : selectedAnswers[i] !== undefined
                            ? 'bg-emerald-500'
                            : 'bg-purple-200 dark:bg-purple-900'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentQuestionIdx((prev) =>
                        Math.min(quizSet.questions.length - 1, prev + 1)
                      )
                    }
                    disabled={currentQuestionIdx === quizSet.questions.length - 1}
                    className="px-4 py-2 purple-gradient-btn rounded-[14px] text-xs font-bold disabled:opacity-40 transition-colors flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Results Summary Box when submitted */}
          {quizSubmitted && (
            <div className="bg-gradient-to-br from-[#4C1D95] via-[#5B21B6] to-[#8B5CF6] text-white border border-purple-400/30 rounded-[20px] p-6 md:p-8 shadow-2xl space-y-4 text-center animate-fade-in">
              <Award className="w-12 h-12 text-amber-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-2xl font-black">Quiz Completed!</h3>
                <p className="text-xs text-purple-100 font-medium">
                  You scored{' '}
                  <strong className="text-amber-300 text-lg font-black">
                    {calculateScore().score} / {calculateScore().total}
                  </strong>{' '}
                  ({calculateScore().percent}%) in {formatTimer(timerSeconds)}
                </p>
              </div>

              <div className="max-w-md mx-auto text-xs font-medium text-purple-100 bg-white/15 backdrop-blur-md p-4 rounded-[16px] border border-white/20">
                {calculateScore().percent >= 80
                  ? '🌟 Master level accuracy! You demonstrate strong conceptual mastery.'
                  : calculateScore().percent >= 60
                  ? '👍 Good job! Review the questions you missed above before your exam.'
                  : '💡 Don\'t worry! Use the AI Assistant to review difficult concepts and try again.'}
              </div>
            </div>
          )}
        </div>
      )}

      {!quizSet && !loading && (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-purple-200 dark:border-purple-900/40 rounded-[20px] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-[20px] bg-purple-100/80 dark:bg-purple-950/60 text-[#5B21B6] dark:text-[#C4B5FD] flex items-center justify-center mx-auto shadow-sm">
            <HelpCircle className="w-8 h-8 text-[#8B5CF6]" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Ready for Self-Testing?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Enter a subject above and click "Generate 10 Questions" to start your practice test session.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

