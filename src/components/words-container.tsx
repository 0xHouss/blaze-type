import { cn, getDetailedLines } from "@/lib/utils";
import { useEffect, useState } from "react";

interface WordsContainerProps {
  text: string;
  input: string;
  finished: boolean;
}

export function WordsContainer({ text, input, finished }: WordsContainerProps) {
  const [detailedLines, setDetailedLines] = useState(getDetailedLines(text))

  useEffect(() => {
    setDetailedLines(getDetailedLines(text))
  }, [text])


  const currentCharIndex = input.length;
  const currentLineIndex = detailedLines.findIndex(line => line.some(([, idx]) => idx === currentCharIndex));

  const getCharClass = (idx: number) => {
    if (!input[idx]) return null;
    if (input[idx] === text[idx]) return 'text-green-700';
    return 'text-red-700';
  };

  return (
    <div className='text-2xl max-h-[4.8em] overflow-y-clip'>
      <div className='w-min h-fit'>
        {detailedLines.map((line, lineIdx) => (
          <div key={"line-" + lineIdx} className={cn('flex w-fit', {
            "hidden": lineIdx < currentLineIndex - 1 || lineIdx > currentLineIndex + 2,
          })}>
            {line.map(([char, charIdx]) => (
              <span key={"char-" + charIdx} className={cn("relative text-[1em]/[1em] my-[0.3em]", getCharClass(charIdx))}>
                {charIdx === input.length && !finished && <Caret />}

                {char === " " ? "\u00A0" : char}
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
