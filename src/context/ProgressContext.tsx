"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProgressContextType {
  xp: number;
  streak: number;
  masteredPhrases: string[];
  masteredFlashcards: string[];
  addXp: (amount: number) => void;
  toggleMasteredPhrase: (id: string) => void;
  toggleMasteredFlashcard: (id: string) => void;
  isPhraseMastered: (id: string) => boolean;
  isFlashcardMastered: (id: string) => boolean;
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

  const isPhraseMastered = (id: string) => masteredPhrases.includes(id);
  const isFlashcardMastered = (id: string) => masteredFlashcards.includes(id);

  return (
    <ProgressContext.Provider
      value={{
        xp,
        streak,
        masteredPhrases,
        masteredFlashcards,
        addXp,
        toggleMasteredPhrase,
        toggleMasteredFlashcard,
        isPhraseMastered,
        isFlashcardMastered,
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