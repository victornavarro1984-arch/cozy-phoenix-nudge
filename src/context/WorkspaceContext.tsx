"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Task, Habit, Note, FocusSession, TaskStatus } from '@/types';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

interface WorkspaceContextType {
  tasks: Task[];
  habits: Habit[];
  notes: Note[];
  focusSessions: FocusSession[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'timeSpentMinutes'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, newStatus: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak' | 'bestStreak'>) => void;
  toggleHabitDay: (habitId: string, dateStr: string) => void;
  deleteHabit: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addFocusSession: (session: Omit<FocusSession, 'id' | 'completedAt'>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Q3 Architecture Review',
    description: 'Finalize service boundary diagrams and assess cloud migration load limits.',
    status: 'in_progress',
    priority: 'urgent',
    category: 'Engineering',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    subtasks: [
      { id: 'st-1', title: 'Audit database replication lag', completed: true },
      { id: 'st-2', title: 'Review Kubernetes ingress definitions', completed: false },
      { id: 'st-3', title: 'Publish ADR document', completed: false },
    ],
    timeSpentMinutes: 75,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Design System Typography Refresh',
    description: 'Update Geist & Inter variable font scalings for mobile viewports.',
    status: 'todo',
    priority: 'high',
    category: 'Design',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    subtasks: [
      { id: 'st-4', title: 'Harmonize h1-h6 scale ratios', completed: false },
      { id: 'st-5', title: 'Test contrast in dark/light mode', completed: true },
    ],
    timeSpentMinutes: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Publish Product Changelog v2.4',
    description: 'Include screenshots of new analytics filters and bug fixes.',
    status: 'done',
    priority: 'medium',
    category: 'Marketing',
    dueDate: new Date().toISOString().split('T')[0],
    subtasks: [
      { id: 'st-6', title: 'Draft release notes', completed: true },
      { id: 'st-7', title: 'Export social teaser banner', completed: true },
    ],
    timeSpentMinutes: 45,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Optimize Core Web Vitals (LCP < 1.2s)',
    description: 'Preload hero banner assets and defer secondary CSS stylesheets.',
    status: 'todo',
    priority: 'medium',
    category: 'Performance',
    dueDate: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
    subtasks: [
      { id: 'st-8', title: 'Compress WebP hero graphics', completed: false },
      { id: 'st-9', title: 'Profile Next/Vite bundle chunk weights', completed: false },
    ],
    timeSpentMinutes: 0,
    createdAt: new Date().toISOString(),
  },
];

const defaultHabits: Habit[] = [
  {
    id: 'h-1',
    title: 'Deep Work (2 Hours)',
    category: 'Focus',
    color: '#6366F1',
    frequency: 'daily',
    completedDates: [
      new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0],
    ],
    streak: 3,
    bestStreak: 12,
    targetDaysPerWeek: 5,
  },
  {
    id: 'h-2',
    title: 'Code Review & Pull Requests',
    category: 'Engineering',
    color: '#06B6D4',
    frequency: 'weekdays',
    completedDates: [
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0],
    ],
    streak: 2,
    bestStreak: 8,
    targetDaysPerWeek: 5,
  },
  {
    id: 'h-3',
    title: 'Physical Workout / 30m Run',
    category: 'Health',
    color: '#10B981',
    frequency: 'daily',
    completedDates: [
      new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
    ],
    streak: 1,
    bestStreak: 14,
    targetDaysPerWeek: 4,
  },
];

const defaultNotes: Note[] = [
  {
    id: 'n-1',
    title: '🚀 Q4 Strategic Objectives & Key Results',
    content: '1. Reach sub-100ms response time for global API edge handlers.\n2. Scale monthly active collaborators by 35%.\n3. Implement unified search and AI assistant integrations.\n\n*Key Dependencies:* Cloudflare Workers, Redis cache layer, fine-tuned RAG pipeline.',
    tags: ['Strategy', 'Roadmap', 'Q4'],
    pinned: true,
    category: 'Planning',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'n-2',
    title: '🎨 Color & Design Guidelines',
    content: 'Primary: Indigo #6366f1\nAccent: Emerald #10b981\nBackground: Slate #0f172a with subtle glassmorphism.\nFont: Sans-serif with tight tracking and balanced weights for maximum legibility.',
    tags: ['Design', 'Tokens'],
    pinned: false,
    category: 'Design',
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('nexus_tasks');
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('nexus_habits');
    return saved ? JSON.parse(saved) : defaultHabits;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('nexus_notes');
    return saved ? JSON.parse(saved) : defaultNotes;
  });

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('nexus_focus_sessions');
    return saved ? JSON.parse(saved) : [
      { id: 'f-1', type: 'work', durationMinutes: 25, completedAt: new Date(Date.now() - 3600000 * 3).toISOString(), taskTitle: 'Audit database replication lag' },
      { id: 'f-2', type: 'work', durationMinutes: 25, completedAt: new Date(Date.now() - 3600000 * 2).toISOString(), taskTitle: 'Review Kubernetes ingress definitions' },
    ];
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('nexus_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('nexus_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('nexus_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('nexus_focus_sessions', JSON.stringify(focusSessions));
  }, [focusSessions]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'timeSpentMinutes'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Date.now(),
      createdAt: new Date().toISOString(),
      timeSpentMinutes: 0,
    };
    setTasks((prev) => [newTask, ...prev]);
    toast.success('Task created successfully');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.info('Task removed');
  };

  const moveTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          if (newStatus === 'done' && t.status !== 'done') {
            confetti({
              particleCount: 75,
              spread: 60,
              origin: { y: 0.7 },
            });
            toast.success(`🎉 Completed: "${t.title}"`);
          }
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          const allCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);
          if (allCompleted && t.status !== 'done') {
            confetti({
              particleCount: 50,
              spread: 50,
              origin: { y: 0.8 },
            });
          }
          return {
            ...t,
            subtasks: updatedSubtasks,
            status: allCompleted ? 'done' : t.status,
          };
        }
        return t;
      })
    );
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'completedDates' | 'streak' | 'bestStreak'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: 'habit_' + Date.now(),
      completedDates: [],
      streak: 0,
      bestStreak: 0,
    };
    setHabits((prev) => [...prev, newHabit]);
    toast.success('Habit tracker added');
  };

  const toggleHabitDay = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const exists = h.completedDates.includes(dateStr);
          const updatedDates = exists
            ? h.completedDates.filter((d) => d !== dateStr)
            : [...h.completedDates, dateStr];

          const newStreak = exists ? Math.max(0, h.streak - 1) : h.streak + 1;
          const bestStreak = Math.max(h.bestStreak, newStreak);

          if (!exists) {
            confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
          }

          return {
            ...h,
            completedDates: updatedDates,
            streak: newStreak,
            bestStreak,
          };
        }
        return h;
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    toast.info('Habit removed');
  };

  const addNote = (noteData: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: 'note_' + Date.now(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    toast.success('Note saved');
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    toast.info('Note deleted');
  };

  const addFocusSession = (sessionData: Omit<FocusSession, 'id' | 'completedAt'>) => {
    const newSession: FocusSession = {
      ...sessionData,
      id: 'focus_' + Date.now(),
      completedAt: new Date().toISOString(),
    };
    setFocusSessions((prev) => [newSession, ...prev]);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
    toast.success(`🎯 Focus session logged: +${sessionData.durationMinutes} mins!`);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        tasks,
        habits,
        notes,
        focusSessions,
        activeTab,
        setActiveTab,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        toggleSubtask,
        addHabit,
        toggleHabitDay,
        deleteHabit,
        addNote,
        updateNote,
        deleteNote,
        addFocusSession,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};