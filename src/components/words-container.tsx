import { cn, getDetailedLines } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

// Measured in the text's own font to work out how many characters fit on a line
const MEASURE_SAMPLE = "0123456789";

interface WordsContainerProps {
  text: string;
  input: string;
  finished: boolean;
}

export function WordsContainer({ text, input, finished }: WordsContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const [maxChars, setMaxChars] = useState<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure) return

    const observer = new ResizeObserver(() => {
      const charWidth = measure.getBoundingClientRect().width / MEASURE_SAMPLE.length
      // Leave room for the trailing space each wrapped line keeps
      setMaxChars(Math.max(10, Math.floor(container.clientWidth / charWidth) - 1))
    })

    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  const detailedLines = useMemo(() => maxChars ? getDetailedLines(text, maxChars) : [], [text, maxChars])

  const currentCharIndex = input.length;
  const foundLineIndex = detailedLines.findIndex(line => line.some(([, idx]) => idx === currentCharIndex));
  const currentLineIndex = foundLineIndex === -1 ? detailedLines.length - 1 : foundLineIndex;

  const getCharClass = (idx: number) => {
    if (!input[idx]) return null;
    if (input[idx] === text[idx]) return 'text-foreground';
    return 'text-destructive';
  };

  return (
    <div ref={containerRef} className='relative w-[calc(100vw-7rem)] sm:w-[calc(100vw-8rem)] max-w-5xl font-mono text-2xl max-h-[4.8em] overflow-y-clip'>
      <span ref={measureRef} aria-hidden className="invisible absolute whitespace-pre">{MEASURE_SAMPLE}</span>

      <div className='w-fit h-fit mx-auto'>
        {detailedLines.map((line, lineIdx) => (
          <div key={"line-" + lineIdx} className={cn('flex w-fit', {
            "hidden": lineIdx < currentLineIndex - 1 || lineIdx > currentLineIndex + 2,
          })}>
            {line.map(([char, charIdx]) => (
              <span key={"char-" + charIdx} className={cn("relative text-[1em]/[1em] my-[0.3em]", getCharClass(charIdx))}>
                {charIdx === input.length && !finished && <Caret />}

                {char === " " ? " " : char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function Caret() {
  return (
    <div className="absolute h-[1.2em] w-[0.1em] bg-primary animate-blink rounded-full -left-[2px]" />
  )
}
