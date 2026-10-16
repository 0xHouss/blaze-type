export const GAME_MODES = ["time", "words", "quote"] as const;
export const MAX_TIMES = [15, 30, 60, 120] as const;
export const MAX_WORDS = [10, 25, 50, 100] as const;
export const MAX_SIZES = ["all", "short", "medium", "long"] as const;

export type GameMode = (typeof GAME_MODES)[number];
export type MaxTime = (typeof MAX_TIMES)[number];
export type MaxWords = (typeof MAX_WORDS)[number];
export type MaxSize = (typeof MAX_SIZES)[number];

export interface Quote {
  text: string;
  source: string;
  id: number;
  length: number;
}

export interface Config {
  gameMode: GameMode;
  maxTime: MaxTime;
  maxWords: MaxWords;
  maxSize: MaxSize;
  numbers: boolean;
  punctuation: boolean;
}

export const DEFAULT_CONFIG: Config = {
  gameMode: "words",
  maxTime: 30,
  maxWords: 50,
  maxSize: "all",
  numbers: false,
  punctuation: false,
};

function oneOf<T>(options: readonly T[], value: unknown, fallback: T): T {
  return options.includes(value as T) ? (value as T) : fallback;
}

// Validates a stored config field by field so a stale or corrupted value never reaches the game
export function parseConfig(value: unknown): Config {
  if (typeof value !== "object" || value === null) return DEFAULT_CONFIG;

  const config = value as Record<string, unknown>;

  return {
    gameMode: oneOf(GAME_MODES, config.gameMode, DEFAULT_CONFIG.gameMode),
    maxTime: oneOf(MAX_TIMES, config.maxTime, DEFAULT_CONFIG.maxTime),
    maxWords: oneOf(MAX_WORDS, config.maxWords, DEFAULT_CONFIG.maxWords),
    maxSize: oneOf(MAX_SIZES, config.maxSize, DEFAULT_CONFIG.maxSize),
    numbers: typeof config.numbers === "boolean" ? config.numbers : DEFAULT_CONFIG.numbers,
    punctuation: typeof config.punctuation === "boolean" ? config.punctuation : DEFAULT_CONFIG.punctuation,
  };
}
