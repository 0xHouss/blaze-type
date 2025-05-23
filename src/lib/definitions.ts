export type GameMode = "time" | "words" | "quote";
export type MaxTime = 15 | 30 | 60 | 120;
export type MaxWords = 10 | 25 | 50 | 100;
export type MaxSize = "all" | "short" | "medium" | "long";

export interface Quote {
  text: string;
  source: string;
  id: number;
  length: number;
}