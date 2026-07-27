import { useState, useEffect } from 'react';
import { Task, ReminderItem, CalendarEvent, StudyNoteItem, ActivityLog } from '../types';
import { initialTasks, initialReminders, initialEvents, initialNotes } from '../data/initialData';

export function useStudyData() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('edunova_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const saved = localStorage.getItem('edunova_reminders');
    return saved ? JSON.parse(saved) : initialReminders;
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('edunova_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [savedNotes, setSavedNotes] = useState<StudyNoteItem[]>(() => {
    const saved = localStorage.getItem('edunova_saved_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('edunova_activities');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'act-1',
            type: 'study',
            title: 'Completed Quantum Mechanics Practice',
            timestamp: '2 hours ago',
            score: 92,
          },
          {
            id: 'act-2',
            type: 'quiz',
            title: 'Cell Biology Quiz (10/10 Correct)',
            timestamp: 'Yesterday at 4:30 PM',
            score: 100,
          },
          {
            id: 'act-3',
            type: 'note',
            title: 'Generated Cornell Notes on Organic Chemistry',
            timestamp: '2 days ago',
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('edunova_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('edunova_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('edunova_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('edunova_saved_notes', JSON.stringify(savedNotes));
  }, [savedNotes]);

  useEffect(() => {
    localStorage.setItem('edunova_activities', JSON.stringify(activities));
  }, [activities]);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (newTask: Omit<Task, 'id'>) => {
    const created: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [created, ...prev]);
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  const addReminder = (newReminder: Omit<ReminderItem, 'id'>) => {
    const created: ReminderItem = {
      ...newReminder,
      id: `rem-${Date.now()}`,
    };
    setReminders((prev) => [created, ...prev]);
  };

  const addEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const created: CalendarEvent = {
      ...newEvent,
      id: `evt-${Date.now()}`,
    };
    setEvents((prev) => [...prev, created]);
  };

  const saveNote = (note: Omit<StudyNoteItem, 'id' | 'createdAt'>) => {
    const created: StudyNoteItem = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: new Date().toLocaleDateString(),
    };
    setSavedNotes((prev) => [created, ...prev]);
  };

  const logActivity = (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newAct: ActivityLog = {
      ...activity,
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  return {
    tasks,
    setTasks,
    toggleTask,
    addTask,
    reminders,
    setReminders,
    toggleReminder,
    addReminder,
    events,
    setEvents,
    addEvent,
    savedNotes,
    setSavedNotes,
    saveNote,
    activities,
    logActivity,
  };
}
