import { UserProfile, TaskItem, ReminderItem, StudyGoal, RecentActivity, NoteItem } from '../types';

export const initialUser: UserProfile = {
  id: 'usr_001',
  name: 'Alex Rivera',
  email: 'alex.rivera@edu.nova',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  gradeLevel: 'Undergraduate - Computer Science & AI',
  targetExam: 'Fall Midterm Examinations 2026',
  dailyHourGoal: 4.5,
  theme: 'light',
};

export const initialStudyGoal: StudyGoal = {
  targetHours: 4.5,
  completedHours: 3.2,
  streakDays: 12,
  lastUpdated: new Date().toISOString(),
  subjectsProgress: [
    { subject: 'Data Structures & Algorithms', progressPercent: 85, color: '#2563EB' },
    { subject: 'Database Management Systems', progressPercent: 68, color: '#10B981' },
    { subject: 'Artificial Intelligence & ML', progressPercent: 74, color: '#8B5CF6' },
    { subject: 'Linear Algebra & Calculus', progressPercent: 50, color: '#F59E0B' },
  ],
};

export const initialTasks: TaskItem[] = [
  {
    id: 'tsk_1',
    title: 'Review Binary Search Tree & AVL Rotation Proofs',
    subject: 'Data Structures & Algorithms',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '18:00',
    priority: 'high',
    completed: false,
    category: 'Revision',
  },
  {
    id: 'tsk_2',
    title: 'Complete SQL Normalization (3NF & BCNF) Problem Set',
    subject: 'Database Management Systems',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dueTime: '23:59',
    priority: 'medium',
    completed: false,
    category: 'Homework',
  },
  {
    id: 'tsk_3',
    title: 'Read Chapter 4: Neural Networks & Backpropagation',
    subject: 'Artificial Intelligence & ML',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    dueTime: '15:00',
    priority: 'high',
    completed: true,
    category: 'Revision',
  },
  {
    id: 'tsk_4',
    title: 'Draft Essay Outline for Ethics in AI Systems',
    subject: 'Computer Ethics',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    dueTime: '20:00',
    priority: 'low',
    completed: false,
    category: 'Project',
  },
];

export const initialReminders: ReminderItem[] = [
  {
    id: 'rem_1',
    title: 'Data Structures Mock Quiz Session',
    date: new Date().toISOString().split('T')[0],
    time: '17:00',
    subject: 'Data Structures',
    isCompleted: false,
    repeat: 'none',
  },
  {
    id: 'rem_2',
    title: 'Submit AI Assignment Draft Outline',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '22:00',
    subject: 'AI & Machine Learning',
    isCompleted: false,
    repeat: 'none',
  },
  {
    id: 'rem_3',
    title: 'Group Study Session - Discrete Math',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '14:30',
    subject: 'Mathematics',
    isCompleted: false,
    repeat: 'weekly',
  },
];

export const initialActivities: RecentActivity[] = [
  {
    id: 'act_1',
    type: 'quiz',
    title: 'Completed Quiz: Data Structures & Algorithms',
    timestamp: '20 minutes ago',
    detail: 'Score: 9/10 (90%) - Great accuracy on Trees & Graphs',
  },
  {
    id: 'act_2',
    type: 'assistant',
    title: 'Explained Topic: Backpropagation in Neural Networks',
    timestamp: '2 hours ago',
    detail: 'Generated ELI5 explanation and real-world gradient descent analogy',
  },
  {
    id: 'act_3',
    type: 'planner',
    title: 'Created Exam Schedule: Fall Midterm Prep Plan',
    timestamp: 'Yesterday',
    detail: '14-Day Intensive timetable generated for 4 core subjects',
  },
  {
    id: 'act_4',
    type: 'notes',
    title: 'Generated Cheatsheet Notes: ACID Properties in DBMS',
    timestamp: '2 days ago',
    detail: 'Cornell Notes format with key transaction recovery examples',
  },
];

export const initialNotes: NoteItem[] = [
  {
    id: 'nt_1',
    title: 'ACID Properties & Transaction Isolation in DBMS',
    subject: 'Database Systems',
    topic: 'ACID Properties',
    style: 'Cornell Notes',
    createdAt: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
    tags: ['DBMS', 'Transactions', 'ACID'],
    content: `# ACID Properties in Database Systems

## 1. Atomicity ("All or Nothing")
- Ensures that all operations within a work unit are completed successfully; otherwise, the transaction is aborted at the point of failure and previous operations are rolled back.
- **Example:** Transferring $100 from Bank A to Bank B requires deducting $100 from A AND adding $100 to B. Both must succeed, or neither.

## 2. Consistency
- Guarantees that a transaction can only bring the database from one valid state to another, maintaining database invariants, constraints, and cascade rules.

## 3. Isolation
- Ensures that concurrent execution of transactions leaves the database in the same state that would have been obtained if the transactions were executed sequentially.
- **Isolation Levels:** Read Uncommitted, Read Committed, Repeatable Read, Serializable.

## 4. Durability
- Guarantees that once a transaction has been committed, it will remain committed even in the event of a system failure (e.g., power loss or crash).
- Logged via Write-Ahead Logging (WAL).
`,
  },
  {
    id: 'nt_2',
    title: 'Asymptotic Analysis & Big-O Notation Cheatsheet',
    subject: 'Algorithms',
    topic: 'Big-O Notation',
    style: 'Cheatsheet',
    createdAt: new Date(Date.now() - 86400000 * 5).toLocaleDateString(),
    tags: ['Algorithms', 'Big-O', 'Complexity'],
    content: `# Asymptotic Complexity Cheatsheet

### Common Time Complexities (Fastest to Slowest)
- **O(1)** - Constant Time: Direct Array Lookup, Stack Push/Pop.
- **O(log N)** - Logarithmic Time: Binary Search, Balanced BST Operations.
- **O(N)** - Linear Time: Array Traversal, Linear Search.
- **O(N log N)** - Linearithmic Time: Merge Sort, Quick Sort (Avg), Heap Sort.
- **O(N²)** - Quadratic Time: Bubble Sort, Selection Sort, Nested Loops.
- **O(2ⁿ)** - Exponential Time: Recursive Fibonacci without Memoization.
- **O(N!)** - Factorial Time: Travelling Salesperson (Brute Force).

### Key Rules
1. **Drop Constants:** O(2N) → O(N)
2. **Drop Non-Dominant Terms:** O(N² + N) → O(N²)
3. **Worst Case vs Best Case:** Always prepare for Worst-Case unless specified.
`,
  },
];

export const initialEvents = [
  {
    id: 'evt_1',
    title: 'Data Structures Midterm Exam',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    subject: 'Data Structures',
    type: 'exam' as const,
  },
  {
    id: 'evt_2',
    title: 'Database Design Assignment Due',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '23:59',
    subject: 'DBMS',
    type: 'assignment' as const,
  },
  {
    id: 'evt_3',
    title: 'AI & ML Group Revision Session',
    date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    time: '14:00',
    subject: 'AI & Machine Learning',
    type: 'study' as const,
  },
];

