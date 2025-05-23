import { GameMode, MaxSize, MaxTime, MaxWords } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { Toggle } from "./ui/toggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont, faHashtag, faQuestion, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { ClockIcon } from "lucide-react";

interface MenuBarProps {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  maxTime: MaxTime;
  setMaxTime: (time: MaxTime) => void;
  maxWords: MaxWords;
  setMaxWords: (words: MaxWords) => void;
  maxSize: MaxSize;
  setMaxSize: (size: MaxSize) => void;
  numbers: boolean;
  setNumbers: (numbers: boolean) => void;
  punctuation: boolean;
  setPunctuation: (punctuation: boolean) => void;
}

export function MenuBar({ gameMode, setGameMode, maxTime, setMaxTime, maxWords, setMaxWords, maxSize, setMaxSize, numbers, setNumbers, punctuation, setPunctuation }: MenuBarProps) {
  return (
    <div className="relative flex w-fit px-3 justify-center items-center rounded-md bg-secondary gap-3 transition-all">
      <div className={cn("absolute right-[105%] rounded-md bg-secondary flex px-2 opacity-100 transition-all", {
        "opacity-0": gameMode === "quote"
      })}>
        <Toggle pressed={punctuation} onPressedChange={setPunctuation} className="gap-1">
          <FontAwesomeIcon icon={faQuestion} />
          <span>Punctuation</span>
        </Toggle>

        <Toggle pressed={numbers} onPressedChange={setNumbers} className="gap-1">
          <FontAwesomeIcon icon={faHashtag} />
          <span>Numbers</span>
        </Toggle>
      </div>

      <ToggleGroup type="single" defaultValue={gameMode} value={gameMode} onValueChange={(value: GameMode) => value ? setGameMode(value) : {}}>
        <ToggleGroupItem value="time" className="gap-1">
          <ClockIcon />
          <span>Time</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="words" className="gap-1">
          <FontAwesomeIcon icon={faFont} />
          <span>Words</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="quote" className="gap-1">
          <FontAwesomeIcon icon={faQuoteLeft} />
          <span>Quote</span>
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="absolute left-[105%] flex items-center rounded-md bg-secondary px-2">
        {gameMode === "time" && (
          <ToggleGroup type="single" defaultValue={`${maxTime}s`} value={`${maxTime}s`} onValueChange={value => value ? setMaxTime(+value.replace('s', '') as MaxTime) : {}}>
            <ToggleGroupItem value="15s">15s</ToggleGroupItem>
            <ToggleGroupItem value="30s">30s</ToggleGroupItem>
            <ToggleGroupItem value="60s">60s</ToggleGroupItem>
            <ToggleGroupItem value="120s">120s</ToggleGroupItem>
          </ToggleGroup>
        )}

        {gameMode === "words" && (
          <ToggleGroup type="single" defaultValue={"" + maxWords} value={"" + maxWords} onValueChange={value => value ? setMaxWords(+value as MaxWords) : {}}>
            <ToggleGroupItem value="10">10</ToggleGroupItem>
            <ToggleGroupItem value="25">25</ToggleGroupItem>
            <ToggleGroupItem value="50">50</ToggleGroupItem>
            <ToggleGroupItem value="100">100</ToggleGroupItem>
          </ToggleGroup>
        )}

        {gameMode === "quote" && (
          <ToggleGroup type="single" defaultValue={maxSize} value={maxSize} onValueChange={value => value ? setMaxSize(value as MaxSize) : {}}>
            <ToggleGroupItem value="all">all</ToggleGroupItem>
            <ToggleGroupItem value="short">short</ToggleGroupItem>
            <ToggleGroupItem value="medium">medium</ToggleGroupItem>
            <ToggleGroupItem value="long">long</ToggleGroupItem>
          </ToggleGroup>
        )}
      </div>
    </div>
  )
}