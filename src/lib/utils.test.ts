import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG, parseConfig, Quote } from "./definitions";
import { filterQuotesBySize, formatTime, generateText, getDetailedLines, wrapParagraph } from "./utils";

const words = ["alpha", "beta", "gamma", "delta"];

describe("generateText", () => {
  it("generates the requested number of words", () => {
    expect(generateText(words, 25, false, false).split(" ")).toHaveLength(25);
  });

  it("only uses the given words without punctuation or numbers", () => {
    const tokens = generateText(words, 50, false, false).split(" ");

    expect(tokens.every(token => words.includes(token))).toBe(true);
  });

  it("capitalizes and punctuates sentences when punctuation is on", () => {
    const text = generateText(words, 50, true, false);

    expect(text[0]).toBe(text[0].toUpperCase());
    expect(text).toMatch(/[.!?]$/);
  });

  it("inserts numbers when numbers are on", () => {
    const random = () => 0.1; // always below the 15% number chance

    expect(generateText(words, 10, false, true, random)).toMatch(/\d/);
  });
});

describe("wrapParagraph", () => {
  it("keeps every line within the limit, apart from the trailing space", () => {
    const lines = wrapParagraph("the quick brown fox jumps over the lazy dog", 10);

    expect(lines.every(line => line.trimEnd().length <= 10)).toBe(true);
  });

  it("preserves the text exactly when lines are joined", () => {
    const text = "the quick brown fox jumps over the lazy dog";

    expect(wrapParagraph(text, 10).join("")).toBe(text);
  });
});

describe("getDetailedLines", () => {
  it("indexes characters continuously across lines", () => {
    const indexes = getDetailedLines("ab cd ef", 3).flat().map(([, index]) => index);

    expect(indexes).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });
});

describe("filterQuotesBySize", () => {
  const quote = (length: number): Quote => ({ text: "", source: "", id: length, length });
  const quotes = [quote(30), quote(80), quote(150)];

  it("buckets quotes by length", () => {
    expect(filterQuotesBySize(quotes, "short").map(q => q.length)).toEqual([30]);
    expect(filterQuotesBySize(quotes, "medium").map(q => q.length)).toEqual([80]);
    expect(filterQuotesBySize(quotes, "long").map(q => q.length)).toEqual([150]);
    expect(filterQuotesBySize(quotes, "all")).toHaveLength(3);
  });
});

describe("formatTime", () => {
  it("formats seconds as mm:ss", () => {
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(125)).toBe("02:05");
  });
});

describe("parseConfig", () => {
  it("falls back to defaults for missing or invalid storage", () => {
    expect(parseConfig(null)).toEqual(DEFAULT_CONFIG);
    expect(parseConfig("nope")).toEqual(DEFAULT_CONFIG);
  });

  it("keeps valid fields and replaces invalid ones", () => {
    expect(parseConfig({ gameMode: "time", maxTime: 45, numbers: true })).toEqual({
      ...DEFAULT_CONFIG,
      gameMode: "time",
      numbers: true,
    });
  });
});
