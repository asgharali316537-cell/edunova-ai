# EduNova AI — Smart Study Suite & Exam Strategist

EduNova AI is an intelligent, full-stack educational assistant powered by **React 19**, **Vite**, **Tailwind CSS v4**, and **Google Gemini 3.6 Flash**. It helps students optimize study schedules, master complex topics with AI explanations, generate self-assessment quizzes, create structured Cornell notes, draft academic assignment outlines, and track deadlines seamlessly.

---

## 📁 Complete Project Structure

```
.
├── api/
│   └── index.ts               # Vercel Serverless Function entry point
├── assets/                    # Project branding & assets
├── src/
│   ├── assets/                # App icons & SVGs
│   │   └── logo.svg
│   ├── components/            # UI components & view modules
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── AuthModal.tsx
│   │   └── views/             # Core interactive view components
│   │       ├── DashboardView.tsx
│   │       ├── StudyPlannerView.tsx
│   │       ├── AIAssistantView.tsx
│   │       ├── QuizGeneratorView.tsx
│   │       ├── NotesGeneratorView.tsx
│   │       ├── AssignmentHelperView.tsx
│   │       ├── CalendarView.tsx
│   │       ├── RemindersView.tsx
│   │       ├── SettingsView.tsx
│   │       └── AboutView.tsx
│   ├── pages/                 # Top-level page components
│   │   ├── DashboardPage.tsx
│   │   ├── StudyPlannerPage.tsx
│   │   ├── AIAssistantPage.tsx
│   │   ├── QuizGeneratorPage.tsx
│   │   ├── NotesGeneratorPage.tsx
│   │   ├── AssignmentHelperPage.tsx
│   │   ├── CalendarPage.tsx
│   │   ├── RemindersPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── AboutPage.tsx
│   │   └── index.ts           # Barrel export for all pages
│   ├── hooks/                 # Custom React hooks
│   │   ├── useStudyData.ts    # Centralized state & local storage persistence
│   │   └── useTheme.ts        # Dark/Light theme mode state manager
│   ├── services/              # Frontend API client services
│   │   └── aiService.ts       # Typed fetch requests for Gemini API endpoints
│   ├── data/                  # Initial mockup datasets & constants
│   │   └── initialData.ts
│   ├── App.tsx                # Main App layout router & container
│   ├── main.tsx               # Client entry point
│   ├── index.css              # Global Tailwind CSS imports
│   └── types.ts               # Shared TypeScript interfaces & types
├── .env.example               # Environment variables template
├── index.html                 # HTML application container
├── package.json               # Dependencies & scripts
├── server.ts                  # Express backend & Gemini API integration
├── tsconfig.json              # TypeScript compilation configuration
├── vercel.json                # Vercel deployment configuration
├── vite.config.ts             # Vite bundler setup
└── README.md                  # Complete documentation
```

---

## ⚡ Features

1. **AI Study Planner**: Custom day-by-day study schedules tailored to exam dates, target grades, available daily study budget, and subject priorities.
2. **AI Concept Explainer**: Crystal-clear breakdowns of complex formulas, theories, and concepts with adjustable depth levels (Beginner to Post-Grad) and real-life analogies.
3. **Interactive Quiz Generator**: Custom multiple-choice quizzes with instant grading, detailed rationale explanations, and score tracking.
4. **Cornell & Lecture Notes Generator**: Transforms raw lecture transcripts or topic prompts into structured markdown study notes.
5. **Academic Assignment Helper**: Generates academic outlines, thesis statements, literature review guides, and APA/MLA citation references.
6. **Smart Study Calendar & Task Reminders**: Comprehensive deadline calendar, daily study habit tracker, and priority notification system.
7. **Dark / Light Theme**: Adaptive visual appearance with warm neutrals, responsive navigation, and high-contrast typography.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18 or higher
- **npm** or **bun** / **yarn**

### 2. Environment Setup
Clone or export the project, then create a `.env` file in the project root:
```bash
cp .env.example .env
```
Set your Gemini API key in `.env`:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=3000
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build

To build the static frontend assets and bundle the server:
```bash
npm run build
```

To run the production server locally or in a container:
```bash
npm start
```

---

## ☁️ Deploying to Vercel

EduNova AI is optimized for deployment on Vercel:

1. **Push Code to GitHub**:
   Push this complete repository to your GitHub account.

2. **Import Project to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New Project**.
   - Select your repository.
   - Framework Preset: **Vite** (Vercel auto-detects `vite`).

3. **Add Environment Variables**:
   Under **Environment Variables** in Vercel project settings, add:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.

4. **Deploy**:
   Click **Deploy**. Vercel will build the frontend with Vite and automatically serve the API endpoints via the serverless function handler configured in `vercel.json` and `api/index.ts`.

---

## 🛡️ License & Credits

Built with ❤️ using Google AI Studio, React, Tailwind CSS, Express, and Google Gemini 3.6.
