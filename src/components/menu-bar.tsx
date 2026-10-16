import { Config, GameMode, MAX_SIZES, MAX_TIMES, MAX_WORDS, MaxSize, MaxTime, MaxWords } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { AtSign, ClockIcon, Hash, QuoteIcon, Type } from "lucide-react";
import { Toggle } from "./ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface MenuBarProps {
  config: Config;
  onChange: (patch: Partial<Config>) => void;
}

export function MenuBar({ config, onChange }: MenuBarProps) {
  const { gameMode, maxTime, maxWords, maxSize, numbers, punctuation } = config;

  // Stacked rows on small screens; on md+ the side panels sit either side of the mode switch
  return (
    <div className="flex flex-col items-center gap-2 md:relative md:block">
      <div className={cn("flex rounded-md bg-secondary px-2 opacity-100 transition-all md:absolute md:right-[105%] md:top-0", {
        "max-md:hidden md:invisible md:opacity-0": gameMode === "quote"
      })}>
        <Toggle pressed={punctuation} onPressedChange={punctuation => onChange({ punctuation })} className="gap-1">
          <AtSign />
          <span>Punctuation</span>
        </Toggle>

        <Toggle pressed={numbers} onPressedChange={numbers => onChange({ numbers })} className="gap-1">
          <Hash />
          <span>Numbers</span>
        </Toggle>
      </div>

      <div className="flex w-fit px-3 justify-center items-center rounded-md bg-secondary">
        <ToggleGroup type="single" value={gameMode} onValueChange={(value: GameMode) => value && onChange({ gameMode: value })}>
          <ToggleGroupItem value="time" className="gap-1">
            <ClockIcon />
            <span>Time</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="words" className="gap-1">
            <Type />
            <span>Words</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="quote" className="gap-1">
            <QuoteIcon />
            <span>Quote</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center rounded-md bg-secondary px-2 md:absolute md:left-[105%] md:top-0">
        {gameMode === "time" && (
          <ToggleGroup type="single" value={`${maxTime}`} onValueChange={value => value && onChange({ maxTime: +value as MaxTime })}>
            {MAX_TIMES.map(time => <ToggleGroupItem key={time} value={`${time}`}>{time}s</ToggleGroupItem>)}
          </ToggleGroup>
        )}

        {gameMode === "words" && (
          <ToggleGroup type="single" value={`${maxWords}`} onValueChange={value => value && onChange({ maxWords: +value as MaxWords })}>
            {MAX_WORDS.map(words => <ToggleGroupItem key={words} value={`${words}`}>{words}</ToggleGroupItem>)}
          </ToggleGroup>
        )}

        {gameMode === "quote" && (
          <ToggleGroup type="single" value={maxSize} onValueChange={value => value && onChange({ maxSize: value as MaxSize })}>
            {MAX_SIZES.map(size => <ToggleGroupItem key={size} value={size}>{size}</ToggleGroupItem>)}
          </ToggleGroup>
        )}
      </div>
    </div>
  )
}
