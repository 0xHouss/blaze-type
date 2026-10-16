import "server-only";

import { FALLBACK_WORDS } from "./fallback-words";
import { MAX_SIZES, MaxSize, Quote } from "./definitions";
import { filterQuotesBySize } from "./utils";

const WORDS_URL = "https://monkeytype.com/languages/english.json";
const QUOTES_URL = "https://monkeytype.com/quotes/english.json";

// The word list is tiny, so it's cached with the page and refreshed daily.
// If monkeytype is unreachable the bundled list keeps builds and pages working.
export async function getWords(): Promise<string[]> {
  try {
    const res = await fetch(WORDS_URL, { next: { revalidate: 86400 } });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (!Array.isArray(data.words) || data.words.length === 0) {
      throw new Error("Unexpected words payload");
    }

    return data.words;
  } catch (error) {
    console.error("Failed to fetch words, using the bundled list:", error);
    return FALLBACK_WORDS;
  }
}

type QuoteBuckets = Record<MaxSize, Pick<Quote, "text" | "source">[]>;

// The quote list is ~2 MB, too big for Next's data cache, so each server instance keeps it in memory
let quoteBuckets: Promise<QuoteBuckets> | null = null;

function loadQuotes() {
  quoteBuckets ??= fetch(QUOTES_URL, { cache: "no-store" })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<{ quotes: Quote[] }>;
    })
    .then(({ quotes }) => {
      const buckets = {} as QuoteBuckets;

      for (const size of MAX_SIZES) {
        buckets[size] = filterQuotesBySize(quotes, size).map(({ text, source }) => ({ text, source }));
      }

      return buckets;
    })
    .catch(error => {
      // Retry on the next request instead of caching the failure
      quoteBuckets = null;
      throw error;
    });

  return quoteBuckets;
}

export async function getRandomQuote(size: MaxSize) {
  const quotes = (await loadQuotes())[size];

  return quotes[Math.floor(Math.random() * quotes.length)];
}
