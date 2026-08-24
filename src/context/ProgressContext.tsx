"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { QuizQuestionHistory } from '@/types/english';

interface ProgressContextType {
  xp: number;
  streak: number;
  masteredPhrases: string[];
  masteredFlashcards: string[];
  quizHistory: Record<string, QuizQuestionHistory>;
  addXp: (amount: number) => void;
  toggleMasteredPhrase: (id: string) => void;
  toggleMasteredFlashcard: (id: string) => void;
  isPhraseMastered: (id: string) => boolean;
  isFlashcardMastered: (id: string) => boolean;
  recordQuizAnswer: (questionId: string, isCorrect: boolean) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [xp, setXp] = useState<number>(() => {
    if (typeof window === 'undefined') return 120;
    const saved = localStorage.getItem('fluent_xp');
    return saved ? parseInt(saved, 10) : 120;
  });

  const [streak, setStreak] = useState<number>(() => {
    if (typeof window === 'undefined') return 5;
    const saved = localStorage.getItem('fluent_streak');
    return saved ? parseInt(saved, 10) : 5;
  });

  const [masteredPhrases, setMasteredPhrases] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('fluent_mastered_phrases');
    return saved ? JSON.parse(saved) : [];
  });

  const [masteredFlashcards, setMasteredFlashcards] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('fluent_mastered_flashcards');
    return saved ? JSON.parse(saved) : [];
  });

  const [quizHistory, setQuizHistory] = useState<Record<string, QuizQuestionHistory>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem('fluent_quiz_history');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('fluent_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('fluent_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('fluent_mastered_phrases', JSON.stringify(masteredPhrases));
  }, [masteredPhrases]);

  useEffect(() => {
    localStorage.setItem('fluent_mastered_flashcards', JSON.stringify(masteredFlashcards));
  }, [masteredFlashcards]);

  useEffect(() => {
    localStorage.setItem('fluent_quiz_history', JSON.stringify(quizHistory));
  }, [quizHistory]);

  const addXp = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  const toggleMasteredPhrase = (id: string) => {
    setMasteredPhrases((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleMasteredFlashcard = (id: string) => {
    setMasteredFlashcards((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const recordQuizAnswer = (questionId: string, isCorrect: boolean) => {
    setQuizHistory((prev) => {
      const current = prev[questionId] || {
        attempts: 0,
        correct: 0,
        failed: 0,
        lastAnsweredCorrectly: false,
      };

      return {
        ...prev,
        [questionId]: {
          attempts: current.attempts + 1,
          correct: isCorrect ? current.correct + 1 : current.correct,
          failed: isCorrect ? current.failed : current.failed + 1,
          lastAnsweredCorrectly: isCorrect,
        },
      };
    });

    if (isCorrect) {
      addXp(15);
    }
  };

  const resetProgress = () => {
    setXp(0);
    setMasteredPhrases([]);
    setMasteredFlashcards([]);
    setQuizHistory({});
    localStorage.removeItem('fluent_xp');
    localStorage.removeItem('fluent_mastered_phrases');
    localStorage.removeItem('fluent_mastered_flashcards');
    localStorage.removeItem('fluent_quiz_history');
  };

  const isPhraseMastered = (id: string) => masteredPhrases.includes(id);
  const isFlashcardMastered = (id: string) => masteredFlashcards.includes(id);

  return (
    <ProgressContext.Provider
      value={{
        xp,
        streak,
        masteredPhrases,
        masteredFlashcards,
        quizHistory,
        addXp,
        toggleMasteredPhrase,
        toggleMasteredFlashcard,
        isPhraseMastered,
        isFlashcardMastered,
        recordQuizAnswer,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress debe utilizarse dentro de un ProgressProvider');
  }
  return context;
};