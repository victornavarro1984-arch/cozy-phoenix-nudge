export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Category = 'Daily Life' | 'Travel & Food' | 'Business' | 'Phonetics' | 'Idioms';

export interface PracticePhrase {
  id: string;
  english: string;
  spanish: string;
  ipa: string; // Phonetic transcription
  difficulty: Difficulty;
  category: Category;
  tips: string;
  exampleContext: string;
}

export interface MinimalPair {
  id: string;
  soundFocus: string;
  wordA: { word: string; ipa: string; spanish: string };
  wordB: { word: string; ipa: string; spanish: string };
  explanation: string;
}

export interface PhoneticSound {
  id: string;
  symbol: string;
  soundName: string;
  description: string;
  spanishTip: string;
  examples: { word: string; ipa: string; spanish: string }[];
}

export interface QuizQuestion {
  id: string;
  targetEnglish: string;
  spanishPrompt: string;
  ipa: string;
  options: string[];
  correctAnswer: string;
  audioHint: string;
}

export interface DialogueTurn {
  id: string;
  speaker: 'AI' | 'User';
  english: string;
  spanish: string;
  ipa?: string;
  promptTip?: string;
}

export interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  dialogue: DialogueTurn[];
}

export interface Flashcard {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: string;
  category: Category;
  definitionSpanish: string;
  exampleSentence: string;
}