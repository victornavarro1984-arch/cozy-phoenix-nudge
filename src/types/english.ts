export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Level = 'basic' | 'advanced';

export type Category = 
  | 'Daily Life' 
  | 'Travel & Food' 
  | 'Business' 
  | 'Phonetics' 
  | 'Linking & Reductions' 
  | 'Idioms';

export interface PracticePhrase {
  id: string;
  english: string;
  spanish: string;
  ipa: string; // Phonetic transcription
  difficulty: Difficulty;
  level: Level;
  category: Category;
  tips: string;
  exampleContext: string;
}

export interface MinimalPair {
  id: string;
  soundFocus: string;
  level: Level;
  wordA: { word: string; ipa: string; spanish: string };
  wordB: { word: string; ipa: string; spanish: string };
  explanation: string;
}

export interface PhoneticSound {
  id: string;
  symbol: string;
  soundName: string;
  level: Level;
  description: string;
  spanishTip: string;
  examples: { word: string; ipa: string; spanish: string }[];
}

export interface QuizQuestion {
  id: string;
  targetEnglish: string;
  spanishPrompt: string;
  ipa: string;
  level: Level;
  category: Category;
  options: string[];
  correctAnswer: string;
  audioHint: string;
  explanation?: string;
}

export interface Flashcard {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: string;
  category: Category;
  level: Level;
  definitionSpanish: string;
  exampleSentence: string;
}

export interface QuizQuestionHistory {
  attempts: number;
  correct: number;
  failed: number;
  lastAnsweredCorrectly: boolean;
}