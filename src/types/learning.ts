export type LevelId = 'basic' | 'advanced';

export interface LessonContent {
  id: string;
  title: string;
  spanishTip: string;
  explanation: string;
  examples: {
    english: string;
    phonetic: string;
    spanish: string;
    breakdown?: string;
  }[];
  drill?: string[];
}

export interface Module {
  id: string;
  levelId: LevelId;
  title: string;
  description: string;
  icon: string;
  badge: string;
  lessons: LessonContent[];
  quizId: string;
}

export interface Flashcard {
  id: string;
  english: string;
  phonetic: string;
  spanish: string;
  example: string;
  exampleSpanish: string;
  category: string;
  spanishSpeakerTip?: string;
  level: LevelId;
}

export interface PronunciationExercise {
  id: string;
  phrase: string;
  phonetic: string;
  spanish: string;
  tip: string;
  level: LevelId;
  category: 'vowels' | 'consonants' | 'rhythm' | 'linking' | 'reductions';
  slowAudioText?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  soundCue?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserProgress {
  completedModules: string[]; // module ids
  completedLessons: string[]; // lesson ids
  quizScores: Record<string, number>; // quizId -> best score %
  masteredFlashcards: string[];
  practiceStreak: number;
  lastActiveDate: string;
  voiceSpeed: number; // 0.75 - 1.0
}