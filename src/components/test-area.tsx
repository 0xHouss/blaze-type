'use client';

import { TestState, TestStats } from '@/lib/typing-test';
import { cn, formatTime } from '@/lib/utils';
import { useEffect, useEffectEvent, useRef } from 'react';
import { Input } from './ui/input';
import { WordsContainer } from './words-container';

// Below lg the stats drop under the logo, and on phones they also clear the button column
export const testAreaClassName = "w-full max-w-xl mx-auto p-4 max-lg:pt-24 max-sm:pr-14";

interface TestAreaProps {
  state: TestState;
  stats: TestStats;
  onType: (value: string) => void;
  onRestart: () => void;
}

export default function TestArea({ state, stats, onType, onRestart }: TestAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const finished = state.status === "finished";

  const onWindowKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key !== 'Enter') return;

    // Leave Enter alone on links, buttons and menus so they stay keyboard-accessible
    if (event.target !== document.body && event.target !== inputRef.current) return;

    event.preventDefault();
    onRestart();
    inputRef.current?.focus();
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => onWindowKeyDown(event);

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className={cn(testAreaClassName, "outline-none")}
      onClick={() => inputRef.current?.focus()}
    >
      <StatsBar {...stats} finished={finished} />

      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground flex flex-col gap-5 items-center'>
        {state.status === "loading" && <p className='text-lg'>Loading quote…</p>}
        {state.status === "error" && <p className='text-lg'>Couldn&apos;t load a quote. Press Enter to try again.</p>}

        {state.text && <WordsContainer finished={finished} text={state.text} input={state.input} />}

        {state.source && <div className='text-lg'> - {state.source}</div>}
      </div>

      <Input
        onChange={e => onType(e.target.value)}
        value={state.input}
        ref={inputRef}
        className="opacity-0"
        // Keep the caret at the end so typing always continues where the text left off
        onSelect={e => {
          const end = e.currentTarget.value.length;
          e.currentTarget.setSelectionRange(end, end);
        }}
        onPaste={e => e.preventDefault()}
        onDrop={e => e.preventDefault()}
        readOnly={finished}
        aria-label="Type the text shown on screen"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        autoFocus
      />
    </div>
  );
}

interface StatsBarProps extends TestStats {
  finished: boolean;
}

export function StatsBar({ wpm, seconds, accuracy, finished }: StatsBarProps) {
  const valueClass = cn("text-foreground", { "text-primary": finished });

  return (
    <div className="relative flex flex-wrap justify-between text-muted-foreground items-center">
      <div className="sm:text-lg">WPM: <span className={valueClass}>{wpm}</span></div>
      {/* On phones the timer takes its own row above the other stats */}
      <div role="timer" className={cn("max-sm:order-first max-sm:w-full max-sm:text-center sm:absolute sm:left-1/2 sm:-translate-x-1/2 text-4xl font-bold", valueClass)}>{formatTime(seconds)}</div>
      <div className='sm:text-lg'>Accuracy: <span className={valueClass}>{accuracy}%</span></div>
    </div>
  );
}
