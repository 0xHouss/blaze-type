'use client';

import { Quote } from '@/app/actions';
import { GameMode, MaxSize, MaxTime, MaxWords } from '@/app/game';
import { cn, getRandomText } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';

interface TestAreaProps {
  quotes: Quote[];
  words: string[];
  gameMode: GameMode;
  maxTime: MaxTime;
  maxWords: MaxWords;
  maxSize: MaxSize;
  numbers: boolean;
  punctuation: boolean;
}

export default function TestArea({ quotes, words, gameMode, maxTime, maxSize, maxWords, numbers, punctuation }: TestAreaProps) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("")
  const [input, setInput] = useState("")

  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100);

  const [seconds, setSeconds] = useState(0);
  const [correctChars, setCorrectChars] = useState(0)
  const [typedChars, setTypedChars] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function reset() {
    setRunning(false);
    setSeconds(0);
    setInput("");
    setFinished(false);
    setAccuracy(100);
    setWpm(0);
    setCorrectChars(0);
    setTypedChars(0);
    if (intervalRef.current) clearInterval(intervalRef.current);

    const { text, source } = getRandomText(quotes, words, gameMode, maxWords, maxSize, punctuation, numbers);
    setText(text);
    setSource(source);
  }

  useEffect(() => {
    reset()
  }, [gameMode, numbers, punctuation, maxWords, quotes, words, maxSize]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(prev => prev + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (!seconds) return;

    const nwpm = Math.round((input.length / 5) / (seconds / 60))
    setWpm(nwpm);

    if (gameMode === "time" && seconds >= maxTime) {
      stop()
    }
  }, [seconds])

  useEffect(() => {
    if (!typedChars) return

    const acc = Math.round((correctChars / typedChars) * 100)
    setAccuracy(acc);
  }, [typedChars, correctChars])

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  const inputRef = useRef<HTMLInputElement>(null);

  function start() {
    if (!running)
      setRunning(true);
  };

  function stop() {
    if (running) {
      setRunning(false);
      setFinished(true);

      const nwpm = Math.round((input.length / 5) / (seconds / 60))
      setWpm(nwpm);
    }
  }

  useEffect(() => {
    if (finished) return;
    if (!running && input.length) return start()
    if (input.length === text.length) return stop()
  }, [input])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();

        reset()
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quotes, words, gameMode, maxWords, maxSize, punctuation, numbers]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (finished) return;

    const key = e.key;

    if (key.length === 1) {
      const expectedChar = text[input.length];

      if (key === expectedChar) setCorrectChars(prev => prev + 1);

      setTypedChars(prev => prev + 1);
    }
  }

  const getCharClass = (idx: number) => {
    if (!input[idx]) return null;
    if (input[idx] === text[idx]) return 'text-green-700';
    return 'text-red-700';
  };

  return (
    <div
      className="w-full max-w-3xl mx-auto text-2xl p-4 outline-none"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="relative flex justify-between text-muted-foreground items-center">
        <div className="text-lg font-bold">WPM: <span className="text-primary">{wpm}</span></div>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-4xl font-bold">{formatTime(seconds)}</h1>
        <h1 className='text-lg font-bold'>Accuracy: <span className="text-primary">{accuracy}%</span></h1>
      </div>

      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-400 flex flex-col gap-5'>
        <div>
          {text.split('').map((char, idx) =>
            <span key={idx} className={cn("relative text-5xl", getCharClass(idx))}>
              <span className={cn("absolute h-[80%] w-1 -left-0.5 bg-primary animate-blink", {
                "hidden": idx !== input.length || finished,
              })} />

              {char}
            </span>
          )}
        </div>

        {source && <div className='text-lg'> - {source}</div>}
      </div>

      <Input
        onChange={e => setInput(e.target.value)}
        value={input}
        ref={inputRef}
        className={cn("opacity-0", {
          "hidden": finished,
        })}
        onKeyDown={handleKeyDown}
        disabled={finished}
        autoFocus
      />
    </div>
  );
}