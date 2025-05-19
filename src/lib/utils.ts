import { Quote } from "@/app/actions";
import { GameMode, MaxSize, MaxWords } from "@/app/game";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const countWords = (quote: string) => quote.split(" ").length

export function saveToLocalStorage<T>(key: string, value: T) {
  if (!localStorage) return

  localStorage.setItem(key, JSON.stringify(value));
}

export function getFromLocalStorage<T>(key: string, fallback: T): T {
  if (!localStorage) return fallback

  const stored = localStorage.getItem(key);
  if (!stored) return fallback;

  try {
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

export function getRandomText(
  quotes: Quote[],
  words: string[],
  gameMode: GameMode,
  maxWords: MaxWords,
  maxSize: MaxSize,
  punctuation: boolean,
  numbers: boolean
) {
  let text = "";
  let source = "";

  // Handle quote mode: pick a quote based on selected size
  if (gameMode === "quote") {
    const filteredQuotes = quotes.filter(quote => {
      if (maxSize === "short") return quote.length <= 50;
      if (maxSize === "medium") return quote.length > 50 && quote.length <= 100;
      if (maxSize === "long") return quote.length > 100;
      return true;
    });

    const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    text = quote.text;
    source = quote.source;
  } else {
    const nbWords = gameMode === "words" ? maxWords : 25;

    // Sample a word using Zipf-like weighted distribution (favors frequent words)
    const sampleWord = () => {
      const skew = 0.7;
      const index = Math.floor(words.length * Math.pow(Math.random(), skew));
      return words[index];
    };

    // Punctuation types with associated likelihoods
    const sentenceEndPunctuation = [
      { mark: ".", weight: 0.7 },
      { mark: "!", weight: 0.2 },
      { mark: "?", weight: 0.1 }
    ];

    // Select a sentence-ending punctuation mark based on weights
    const getWeightedRandomPunctuation = () => {
      const totalWeight = sentenceEndPunctuation.reduce((sum, p) => sum + p.weight, 0);
      const rand = Math.random() * totalWeight;
      let cumulative = 0;
      for (const p of sentenceEndPunctuation) {
        cumulative += p.weight;
        if (rand <= cumulative) return p.mark;
      }
      return ".";
    };

    const finalSentences = [];
    let wordCount = 0;

    while (wordCount < nbWords) {
      // Generate a sentence of 6–10 words
      const sentenceLength = Math.floor(Math.random() * 5) + 6;
      const sentenceWords = [];

      for (let i = 0; i < sentenceLength && wordCount < nbWords; i++) {
        // Occasionally insert numbers (as standalone tokens)
        if (numbers && Math.random() < 0.15) {
          sentenceWords.push(Math.floor(Math.random() * 100).toString());
          wordCount++;
          if (wordCount >= nbWords) break;
        }

        sentenceWords.push(sampleWord());
        wordCount++;
      }

      // Capitalize the first word of the sentence
      if (sentenceWords.length > 0) {
        const w = sentenceWords[0];
        sentenceWords[0] = w[0].toUpperCase() + w.slice(1);
      }

      // Insert 1–2 commas at natural positions if punctuation is enabled
      if (punctuation && sentenceWords.length >= 6) {
        const numCommas = Math.random() < 0.5 ? 1 : 2;
        for (let i = 1; i <= numCommas; i++) {
          const pos = Math.floor((i * sentenceWords.length) / (numCommas + 1));
          if (pos < sentenceWords.length - 1) {
            sentenceWords[pos] += ",";
          }
        }
      }

      // Join words into a sentence and add a final punctuation mark
      let sentence = sentenceWords.join(" ");
      if (punctuation) {
        sentence += getWeightedRandomPunctuation();
      }

      finalSentences.push(sentence);
    }

    // Join all generated sentences into one paragraph
    text = finalSentences.join(" ");
  }

  return { text, source };
}
