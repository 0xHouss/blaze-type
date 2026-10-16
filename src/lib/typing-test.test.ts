import { describe, expect, it } from "vitest";
import { EMPTY_TEST, getStats, needsMoreText, TestAction, TestState, typingTestReducer } from "./typing-test";

const load = (text: string, timeLimit: number | null = null) =>
  typingTestReducer(EMPTY_TEST, { type: "load", text, source: "", timeLimit });

const run = (state: TestState, ...actions: TestAction[]) => actions.reduce(typingTestReducer, state);

describe("typingTestReducer", () => {
  it("starts the test on the first character", () => {
    const state = run(load("hello"), { type: "input", value: "h", now: 1000 });

    expect(state.status).toBe("running");
    expect(state.startedAt).toBe(1000);
  });

  it("finishes a words test once the whole text is typed", () => {
    const state = run(load("hi"),
      { type: "input", value: "h", now: 0 },
      { type: "input", value: "hi", now: 500 },
    );

    expect(state.status).toBe("finished");
  });

  it("does not finish a time test when the text runs out", () => {
    const state = run(load("hi", 30),
      { type: "input", value: "h", now: 0 },
      { type: "input", value: "hi", now: 500 },
    );

    expect(state.status).toBe("running");
  });

  it("finishes a time test exactly at its limit", () => {
    const state = run(load("hello world", 15),
      { type: "input", value: "h", now: 0 },
      { type: "tick", now: 14_800 },
      { type: "tick", now: 15_100 },
    );

    expect(state.status).toBe("finished");
    expect(state.now).toBe(15_000);
  });

  it("ignores input typed after the time limit", () => {
    const state = run(load("hello", 15),
      { type: "input", value: "h", now: 0 },
      { type: "input", value: "he", now: 16_000 },
    );

    expect(state.status).toBe("finished");
    expect(state.input).toBe("h");
  });

  it("ignores input once finished", () => {
    const finished = run(load("a"), { type: "input", value: "a", now: 0 });

    expect(run(finished, { type: "input", value: "", now: 100 })).toBe(finished);
  });

  it("caps input at the text length", () => {
    const state = run(load("abc", 30), { type: "input", value: "abcdef", now: 0 });

    expect(state.input).toBe("abc");
  });

  it("counts mistakes in accuracy even after they are corrected", () => {
    const state = run(load("abc"),
      { type: "input", value: "x", now: 0 },
      { type: "input", value: "", now: 100 },
      { type: "input", value: "a", now: 200 },
    );

    expect(state.keystrokes).toBe(2);
    expect(state.correctKeystrokes).toBe(1);
  });

  it("appends text when extended", () => {
    const state = run(load("one", 30), { type: "extend", text: "two" });

    expect(state.text).toBe("one two");
  });
});

describe("getStats", () => {
  it("counts only correct characters towards WPM", () => {
    // 10 correct characters in 6 seconds = 2 words in 0.1 minutes = 20 WPM
    const state = run(load("aaaaaaaaaaaaaaaaaaaa"),
      { type: "input", value: "a", now: 0 },
      { type: "input", value: "aaaaaaaaaabbbbbbbbbb", now: 6000 },
    );

    expect(getStats(state).wpm).toBe(20);
  });

  it("reports full accuracy before anything is typed", () => {
    expect(getStats(load("abc"))).toEqual({ wpm: 0, accuracy: 100, seconds: 0 });
  });

  it("reports elapsed whole seconds", () => {
    const state = run(load("abc", 30),
      { type: "input", value: "a", now: 0 },
      { type: "tick", now: 2600 },
    );

    expect(getStats(state).seconds).toBe(2);
  });
});

describe("needsMoreText", () => {
  it("asks for more text in time mode when the end is near", () => {
    expect(needsMoreText(load("a".repeat(50), 30))).toBe(true);
    expect(needsMoreText(load("a".repeat(500), 30))).toBe(false);
  });

  it("never asks for more text outside time mode", () => {
    expect(needsMoreText(load("abc"))).toBe(false);
  });
});
