'use client'

import { Config } from "@/lib/definitions";
import { EMPTY_TEST, getStats, needsMoreText, TestAction, typingTestReducer } from "@/lib/typing-test";
import { generateText } from "@/lib/utils";
import { useEffect, useReducer } from "react";

// Time mode starts with this many words and appends the same amount whenever it runs low
const TIME_MODE_CHUNK = 50;

function newTestAction(config: Config, words: string[]): TestAction {
  if (config.gameMode === "quote") return { type: "loading" };

  const nbWords = config.gameMode === "words" ? config.maxWords : TIME_MODE_CHUNK;

  return {
    type: "load",
    text: generateText(words, nbWords, config.punctuation, config.numbers),
    source: "",
    timeLimit: config.gameMode === "time" ? config.maxTime : null,
  };
}

export function useTypingTest(config: Config, words: string[]) {
  const [state, dispatch] = useReducer(typingTestReducer, undefined, () =>
    typingTestReducer(EMPTY_TEST, newTestAction(config, words))
  );

  // Quote mode: fetch a quote whenever the test is waiting for one
  useEffect(() => {
    if (state.status !== "loading") return;

    const controller = new AbortController();

    fetch(`/api/quote?size=${config.maxSize}`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch quote: ${res.status}`);
        return res.json() as Promise<{ text: string; source: string }>;
      })
      .then(quote => dispatch({ type: "load", text: quote.text, source: quote.source, timeLimit: null }))
      .catch(() => {
        if (!controller.signal.aborted) dispatch({ type: "error" });
      });

    return () => controller.abort();
  }, [state.status, config.maxSize]);

  useEffect(() => {
    if (state.status !== "running") return;

    // Tick faster than once a second so time mode ends close to its limit
    const interval = setInterval(() => dispatch({ type: "tick", now: Date.now() }), 200);

    return () => clearInterval(interval);
  }, [state.status]);

  function restart(nextConfig: Config) {
    dispatch(newTestAction(nextConfig, words));
  }

  function type(value: string) {
    dispatch({ type: "input", value, now: Date.now() });

    if (needsMoreText({ ...state, input: value })) {
      dispatch({ type: "extend", text: generateText(words, TIME_MODE_CHUNK, config.punctuation, config.numbers) });
    }
  }

  return { state, stats: getStats(state), restart, type };
}
