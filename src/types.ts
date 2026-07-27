export type NavView =
  | 'dashboard'
  | 'study-planner'
  | 'ai-assistant'
  | 'quiz'
  | 'notes'
  | 'assignment'
  | 'calendar'
  | 'reminders'
  | 'settings'
  | 'about';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  gradeLevel: string; // e.g., "Undergraduate - Computer Science", "High School Senior"
  targetExam: string; // e.g., "Final Term Exams", "MCAT", "SAT"
  dailyHourGoal: number;
  theme: 'light' | 'dark';
}

export interface TaskItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category: 'Homework' | 'Exam Prep' | 'Revision' | 'Project' | 'General';
}

export interface ReminderItem {
  id: string;
  title: string;
  date: string;
  time: string;
  subject?: string;
  isCompleted: boolean;
  repeat: 'none' | 'daily' | 'weekly';
}

export interface StudyGoal {
  targetHours: number;
  completedHours: number;
  streakDays: number;
  lastUpdated: string;
  subjectsProgress: Array<{
    subject: string;
    progressPercent: number; // 0 to 100
    color: string;
  }>;
}

export interface RecentActivity {
  id: string;
  type: 'planner' | 'assistant' | 'quiz' | 'notes' | 'assignment' | 'task';
  title: string;
  timestamp: string;
  detail?: string;
}

export interface GeneratedStudyPlan {
  examName: string;
  daysRemaining: number;
  dailyHours: number;
  summary: string;
  weeklySchedule: Array<{
    day: string;
    focusSubject: string;
    topics: string[];
    timeSlot: string;
    goals: string[];
  }>;
  milestones: string[];
  studyTips: string[];
}

export interface TopicExplanation {
  topic: string;
  depth: string;
  definition: string;
  simpleExplanation: string;
  keyPoints: string[];
  realLifeExample: string;
  shortSummary: string;
}

export interface QuizQuestion {
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-based
  explanation: string;
}

export interface QuizSet {
  id: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdAt: string;
  questions: QuizQuestion[];
  score?: number;
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  topic: string;
  content: string;
  createdAt: string;
  tags: string[];
  style: 'Bullet Points' | 'Cornell Notes' | 'Mindmap Style' | 'Cheatsheet';
}

export interface AssignmentDraft {
  id: string;
  topic: string;
  academicLevel: string;
  citationFormat: string;
  title: string;
  introduction: string;
  mainHeadings: Array<{
    headingTitle: string;
    keyPoints: string[];
    draftContent: string;
  }>;
  conclusion: string;
  references: string[];
  createdAt: string;
}

// Aliases for compatibility
export type Task = TaskItem;
export type StudyNoteItem = NoteItem;
export type ActivityLog = RecentActivity;

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  subject?: string;
  type: 'exam' | 'assignment' | 'study' | 'reminder';
}

// AI API Request / Response Types
export interface StudyPlanRequest {
  examName: string;
  examDate?: string;
  subjects: string[] | string;
  dailyHours: number;
  targetGoal?: string;
  studyTimePreference?: string;
}

export type StudyPlanResponse = GeneratedStudyPlan;

export interface ExplainRequest {
  topic: string;
  depth?: string;
}

export type ExplainResponse = TopicExplanation;

export interface QuizRequest {
  topic: string;
  difficulty?: string;
  questionCount?: number;
}

export interface QuizResponse {
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
}

export interface NotesRequest {
  topic?: string;
  style?: string;
  rawText?: string;
}

export interface NotesResponse {
  title: string;
  style: string;
  tags: string[];
  content: string;
}

export interface AssignmentRequest {
  topic: string;
  academicLevel?: string;
  citationFormat?: string;
}

export type AssignmentResponse = Omit<AssignmentDraft, 'id' | 'createdAt'>;
