export type NavTab = 'alphabet' | 'letter-game' | 'word-builder' | 'word-match' | 'daily-challenge';

export type AlphabetGroupId = 'all' | 'familiar' | 'false-friends' | 'georgian-match' | 'special';

export type LetterCategory = 'vowel' | 'consonant' | 'sign';

export interface RussianLetter {
  id: string;
  order: number;
  upper: string;
  lower: string;
  group: Exclude<AlphabetGroupId, 'all'>;
  category: LetterCategory;
  phoneticKa: string;
  spokenHint: string;
  georgianTip: string;
  isFalseFriend?: boolean;
  falseFriendNote?: string;
  cursiveTipKa?: string;
  exampleWord: {
    ru: string;
    ka: string;
    transcriptionKa: string;
    highlightIndex: number;
    imageKey: string;
  };
}

export type WordDifficulty = 1 | 2 | 3;

export interface VocabWord {
  id: string;
  ru: string;
  ka: string;
  transcriptionKa: string;
  syllables: string[];
  difficulty: WordDifficulty;
  categoryKa: string;
  imageKey: string;
  hintKa: string;
}

export interface PlayerProgress {
  learnedLetters: string[];
  learnedWords: string[];
  stars: number;
  streak: number;
  bestStreak: number;
  soundEnabled: boolean;
}
