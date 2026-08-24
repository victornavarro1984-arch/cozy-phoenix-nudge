export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  category: string;
  dueDate?: string;
  subtasks: Subtask[];
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