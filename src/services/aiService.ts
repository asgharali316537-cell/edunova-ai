import {
  StudyPlanRequest,
  StudyPlanResponse,
  ExplainRequest,
  ExplainResponse,
  QuizRequest,
  QuizResponse,
  NotesRequest,
  NotesResponse,
  AssignmentRequest,
  AssignmentResponse,
} from '../types';

/**
 * Service class for interacting with EduNova AI backend endpoints.
 * Operates safely with error handling and fallback defaults.
 */
export const aiService = {
  /**
   * Generates a personalized daily & weekly study plan using AI.
   */
  async generateStudyPlan(data: StudyPlanRequest): Promise<StudyPlanResponse> {
    const res = await fetch('/api/ai/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || errJson.details || 'Failed to generate study plan');
    }

    return res.json();
  },

  /**
   * Explains a complex topic with tailored depth and real-world analogies.
   */
  async explainTopic(data: ExplainRequest): Promise<ExplainResponse> {
    const res = await fetch('/api/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || errJson.details || 'Failed to explain topic');
    }

    return res.json();
  },

  /**
   * Generates interactive multiple-choice quizzes for self-testing.
   */
  async generateQuiz(data: QuizRequest): Promise<QuizResponse> {
    const res = await fetch('/api/ai/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || errJson.details || 'Failed to generate quiz');
    }

    return res.json();
  },

  /**
   * Summarizes lecture raw text or generates structured Cornell / Cheatsheet study notes.
   */
  async generateNotes(data: NotesRequest): Promise<NotesResponse> {
    const res = await fetch('/api/ai/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || errJson.details || 'Failed to generate notes');
    }

    return res.json();
  },

  /**
   * Drafts structured academic assignment outlines, thesis statements, and citations.
   */
  async draftAssignment(data: AssignmentRequest): Promise<AssignmentResponse> {
    const res = await fetch('/api/ai/assignment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || errJson.details || 'Failed to draft assignment helper');
    }

    return res.json();
  },
};
