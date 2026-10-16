export type TestStatus = "loading" | "error" | "idle" | "running" | "finished";

export interface TestState {
  status: TestStatus;
  text: string;
  source: string;
  input: string;
  // Seconds before the test ends; null means it ends once the whole text is typed
  timeLimit: number | null;
  startedAt: number | null;
  now: number | null;
  keystrokes: number;
  correctKeystrokes: number;
}

export type TestAction =
  | { type: "load"; text: string; source: string; timeLimit: number | null }
  | { type: "loading" }
  | { type: "error" }
  | { type: "input"; value: string; now: number }
  | { type: "extend"; text: string }
  | { type: "tick"; now: number };

// Time mode appends more text once fewer than this many characters are left to type
export const EXTEND_THRESHOLD = 100;

export const EMPTY_TEST: TestState = {
  status: "loading",
  text: "",
  source: "",
  input: "",
  timeLimit: null,
  startedAt: null,
  now: null,
  keystrokes: 0,
  correctKeystrokes: 0,
};

const isActive = (state: TestState) => state.status === "idle" || state.status === "running";

function timeIsUp(state: TestState, now: number) {
  return state.timeLimit !== null && state.startedAt !== null && now - state.startedAt >= state.timeLimit * 1000;
}

function finishOnTime(state: TestState): TestState {
  return { ...state, status: "finished", now: state.startedAt! + state.timeLimit! * 1000 };
}

export function typingTestReducer(state: TestState, action: TestAction): TestState {
  switch (action.type) {
    case "load":
      return { ...EMPTY_TEST, status: "idle", text: action.text, source: action.source, timeLimit: action.timeLimit };

    case "loading":
      return { ...EMPTY_TEST, status: "loading" };

    case "error":
      return { ...EMPTY_TEST, status: "error" };

    case "input": {
      if (!isActive(state)) return state;
      if (timeIsUp(state, action.now)) return finishOnTime(state);

      const value = action.value.slice(0, state.text.length);
      if (value === state.input) return state;

      // Count each newly typed character against the character it was typed over
      let keystrokes = state.keystrokes;
      let correctKeystrokes = state.correctKeystrokes;
      for (let i = state.input.length; i < value.length; i++) {
        keystrokes++;
        if (value[i] === state.text[i]) correctKeystrokes++;
      }

      const next: TestState = {
        ...state,
        status: "running",
        input: value,
        startedAt: state.startedAt ?? action.now,
        now: action.now,
        keystrokes,
        correctKeystrokes,
      };

      if (state.timeLimit === null && value.length === state.text.length) {
        return { ...next, status: "finished" };
      }

      return next;
    }

    case "extend":
      if (!isActive(state)) return state;
      return { ...state, text: state.text + " " + action.text };

    case "tick":
      if (state.status !== "running") return state;
      if (timeIsUp(state, action.now)) return finishOnTime(state);
      return { ...state, now: action.now };
  }
}

export function needsMoreText(state: TestState) {
  return state.timeLimit !== null && state.text.length - state.input.length < EXTEND_THRESHOLD;
}

export interface TestStats {
  wpm: number;
  accuracy: number;
  seconds: number;
  // Seconds left in time mode (counts down to 0); null in modes without a time limit
  timeLeft: number | null;
}

export function getStats(state: TestState): TestStats {
  const elapsedMs = state.startedAt !== null && state.now !== null ? state.now - state.startedAt : 0;

  // Only characters that currently match the text count towards speed
  let correctChars = 0;
  for (let i = 0; i < state.input.length; i++) {
    if (state.input[i] === state.text[i]) correctChars++;
  }

  const wpm = elapsedMs >= 1000 ? Math.round(correctChars / 5 / (elapsedMs / 60000)) : 0;
  const accuracy = state.keystrokes ? Math.round((state.correctKeystrokes / state.keystrokes) * 100) : 100;

  const seconds = Math.floor(elapsedMs / 1000);
  const timeLeft = state.timeLimit === null ? null : Math.max(0, state.timeLimit - seconds);

  return { wpm, accuracy, seconds, timeLeft };
}
