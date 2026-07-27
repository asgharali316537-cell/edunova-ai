import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for GoogleGenAI to ensure server startup never crashes if key is pending
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ----------------------------------------------------------------------------
// API Endpoints for AI Features
// ----------------------------------------------------------------------------

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'EduNova AI - Smart Study Assistant' });
});

// 1. AI Study Planner
app.post('/api/ai/plan', async (req, res) => {
  try {
    const { examName, examDate, subjects, dailyHours, targetGoal, studyTimePreference } = req.body;
    
    if (!examName || !subjects || !dailyHours) {
      return res.status(400).json({ error: 'Missing required parameters (examName, subjects, dailyHours)' });
    }

    const ai = getAI();
    const prompt = `You are EduNova AI, a world-class educational strategist. Create a highly effective, realistic, and motivating daily & weekly study plan for a student.

Student Input:
- Exam / Goal: ${examName}
- Target Date: ${examDate || 'In 14 Days'}
- Target Outcome: ${targetGoal || 'Top Grade A+'}
- Subjects: ${Array.isArray(subjects) ? subjects.join(', ') : subjects}
- Daily Study Budget: ${dailyHours} hours/day
- Preferred Time Window: ${studyTimePreference || 'Flexible / Balanced'}

Respond STRICTLY with valid JSON following this structure:
{
  "examName": "${examName}",
  "daysRemaining": 14,
  "dailyHours": ${dailyHours},
  "summary": "Short 2-3 sentence strategic executive summary of this plan",
  "weeklySchedule": [
    {
      "day": "Day 1 (Monday)",
      "focusSubject": "Subject Name",
      "topics": ["Topic A", "Topic B"],
      "timeSlot": "Morning / 2 Hours",
      "goals": ["Goal 1", "Goal 2"]
    }
    // Repeat for Day 1 to Day 7
  ],
  "milestones": [
    "Milestone 1 by Day 3",
    "Milestone 2 by Day 7",
    "Milestone 3 by Day 12"
  ],
  "studyTips": [
    "Tip 1 regarding active recall / spaced repetition",
    "Tip 2 regarding break schedule (e.g. Pomodoro 50/10)",
    "Tip 3 regarding exam preparation mindset"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const parsedData = JSON.parse(jsonText);
    res.json(parsedData);
  } catch (err: any) {
    console.error('Error generating study plan:', err);
    res.status(500).json({
      error: 'Failed to generate study plan with AI',
      details: err?.message || 'Gemini API Error',
    });
  }
});

// 2. AI Study Assistant (Topic Explainer)
app.post('/api/ai/explain', async (req, res) => {
  try {
    const { topic, depth } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const ai = getAI();
    const prompt = `You are EduNova AI, a master educator who breaks down complex concepts into crystal-clear insights.

Topic: "${topic}"
Target Depth / Audience: "${depth || 'High School / Undergraduate'}"

Explain this topic concisely and clearly. Respond STRICTLY in valid JSON with this format:
{
  "topic": "${topic}",
  "depth": "${depth || 'High School'}",
  "definition": "Clear 1-2 sentence formal definition",
  "simpleExplanation": "In-depth yet accessible explanation in simple language",
  "keyPoints": [
    "Key point or formula 1",
    "Key point or rule 2",
    "Key point or mechanism 3",
    "Key point or application 4"
  ],
  "realLifeExample": "An engaging, relatable real-world analogy or practical application",
  "shortSummary": "A punchy 1-sentence memory hack or core takeaway"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const parsedData = JSON.parse(jsonText);
    res.json(parsedData);
  } catch (err: any) {
    console.error('Error explaining topic:', err);
    res.status(500).json({
      error: 'Failed to explain topic with AI',
      details: err?.message || 'Gemini API Error',
    });
  }
});

// 3. AI Quiz Generator
app.post('/api/ai/quiz', async (req, res) => {
  try {
    const { topic, difficulty = 'Medium', questionCount = 10 } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const ai = getAI();
    const prompt = `Generate an interactive multiple-choice quiz on the topic "${topic}" with difficulty level "${difficulty}".
Create exactly ${questionCount} high-quality questions designed for student self-testing.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionNumber: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Exactly 4 distinct answer choices',
                  },
                  correctAnswerIndex: {
                    type: Type.INTEGER,
                    description: '0-based index (0, 1, 2, or 3) of the correct option',
                  },
                  explanation: {
                    type: Type.STRING,
                    description: 'Detailed explanation of why this answer is correct and others are incorrect',
                  },
                },
                required: ['questionNumber', 'question', 'options', 'correctAnswerIndex', 'explanation'],
              },
            },
          },
          required: ['topic', 'difficulty', 'questions'],
        },
      },
    });

    const jsonText = response.text || '{}';
    const parsedData = JSON.parse(jsonText);
    res.json(parsedData);
  } catch (err: any) {
    console.error('Error generating quiz:', err);
    res.status(500).json({
      error: 'Failed to generate quiz with AI',
      details: err?.message || 'Gemini API Error',
    });
  }
});

// 4. AI Notes Generator
app.post('/api/ai/notes', async (req, res) => {
  try {
    const { topic, style = 'Cornell Notes', rawText = '' } = req.body;
    if (!topic && !rawText) {
      return res.status(400).json({ error: 'Topic or raw lecture text is required' });
    }

    const ai = getAI();
    const prompt = `You are EduNova AI. Generate clean, well-formatted study notes.
Topic / Title: "${topic || 'Lecture Summary'}"
Note Format Style: "${style}" (Options: Cornell Notes, Bullet Points, Mindmap Style, Cheatsheet)
${rawText ? `Raw Context / Transcript:\n"""\n${rawText}\n"""` : ''}

Generate detailed Markdown structured notes with headers, bold key concepts, bullet lists, code/formula blocks if applicable, and a summary section at the bottom.

Respond STRICTLY in JSON format:
{
  "title": "${topic || 'Study Notes'}",
  "style": "${style}",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "content": "Full markdown content of the notes"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const parsedData = JSON.parse(jsonText);
    res.json(parsedData);
  } catch (err: any) {
    console.error('Error generating notes:', err);
    res.status(500).json({
      error: 'Failed to generate study notes with AI',
      details: err?.message || 'Gemini API Error',
    });
  }
});

// 5. Assignment Helper
app.post('/api/ai/assignment', async (req, res) => {
  try {
    const { topic, academicLevel = 'Undergraduate', citationFormat = 'APA 7th Edition' } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Assignment topic is required' });
    }

    const ai = getAI();
    const prompt = `You are EduNova AI, an academic writing consultant. Generate a structured assignment outline and draft for the topic: "${topic}".
Academic Level: ${academicLevel}
Citation Style: ${citationFormat}

Respond STRICTLY in JSON with this structure:
{
  "topic": "${topic}",
  "academicLevel": "${academicLevel}",
  "citationFormat": "${citationFormat}",
  "title": "Academic Title for Assignment",
  "introduction": "Comprehensive introduction section with thesis statement and background context",
  "mainHeadings": [
    {
      "headingTitle": "Heading 1: Topic Overview & Literature Review",
      "keyPoints": ["Key argument 1", "Evidence 2"],
      "draftContent": "In-depth academic paragraphs detailing this section..."
    },
    {
      "headingTitle": "Heading 2: Analysis & Critical Evaluation",
      "keyPoints": ["Analysis point 1", "Counter-argument point 2"],
      "draftContent": "In-depth academic analysis..."
    },
    {
      "headingTitle": "Heading 3: Practical Implications or Case Applications",
      "keyPoints": ["Practical case 1", "Future outlook"],
      "draftContent": "In-depth practical analysis..."
    }
  ],
  "conclusion": "Strong concluding paragraph synthesizing main arguments and final recommendations",
  "references": [
    "Reference 1 formatted in ${citationFormat}",
    "Reference 2 formatted in ${citationFormat}",
    "Reference 3 formatted in ${citationFormat}"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const parsedData = JSON.parse(jsonText);
    res.json(parsedData);
  } catch (err: any) {
    console.error('Error drafting assignment:', err);
    res.status(500).json({
      error: 'Failed to draft assignment helper content with AI',
      details: err?.message || 'Gemini API Error',
    });
  }
});

// ----------------------------------------------------------------------------
// Vite Dev / Prod static server integration
// ----------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduNova AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

export default app;
