export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  category: string;
  dueDate?: string;
  subtasks: { id: string; title: string; completed: boolean }[];
  timeSpentMinutes: number;
  createdAt: string;
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  color: string;
  frequency: 'daily' | 'weekdays' | 'weekends';
  completedDates: string[]; // ISO Date strings 'YYYY-MM-DD'
  streak: number;
  bestStreak: number;
  targetDaysPerWeek: number;
}<dyad-write path="src/types/index.ts" description="Define TypeScript types for workspace tasks, habits, notes, focus sessions, and user metrics">
export type Priority = 'low' | '<dyad-write path="src/types/index.ts" description="Define TypeScript types for workspace tasks, habits, notes, focus sessions, and user metrics">
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  category: string;
  dueDate?: string;
  subtasks: { id: string; title: string; completed: boolean }[];
  timeSpentMinutes: number;
  createdAt: string;
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  color: string;
  frequency: 'daily' | 'weekdays' | 'weekends';
  completedDates: string[]; // ISO Date strings 'YYYY-MM-DD'
  streak: number;
  bestStreak: number;
  targetDaysPerWeek: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  category: string;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  type: 'work' | 'short_break' | 'long_break';
  durationMinutes: number;
  completedAt: string;
  taskTitle?: string;
}

export interface UserStats {
  totalFocusMinutes: number;
  tasksCompleted: number;
  habitsChecked: number;
  currentStreak: number;
  points: number;
}