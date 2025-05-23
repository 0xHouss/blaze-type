'use client'

import Logo from "@/components/logo";
import TestArea from "@/components/test-area";
import { ThemeColorToggle } from "@/components/theme-color-toggle";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import Tooltiped from "@/components/tooltiped";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn, getFromLocalStorage, saveToLocalStorage } from "@/lib/utils";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faFont, faHashtag, faQuestion, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClockIcon, HandHeartIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Quote } from "./actions";

export type GameMode = "time" | "words" | "quote";
export type MaxTime = 15 | 30 | 60 | 120;
export type MaxWords = 10 | 25 | 50 | 100;
export type MaxSize = "all" | "short" | "medium" | "long";

export default function Game({ quotes, words }: { quotes: Quote[]; words: string[] }) {
  const [isMounted, setIsMounted] = useState(false)

  const [gameMode, setGameMode] = useState<GameMode>("words")
  const [maxTime, setMaxTime] = useState<MaxTime>(30)
  const [maxWords, setMaxWords] = useState<MaxWords>(50)
  const [maxSize, setMaxSize] = useState<MaxSize>("all")
  const [numbers, setNumbers] = useState(false)
  const [punctuation, setPunctuation] = useState(false)

  useEffect(() => {
    if (isMounted) {
      return saveToLocalStorage("config", {
        gameMode,
        maxTime,
        maxWords,
        maxSize,
        numbers,
        punctuation
      })
    }

    const config = getFromLocalStorage("config", {
      gameMode: "words",
      maxTime: 30,
      maxWords: 50,
      maxSize: "all",
      numbers: false,
      punctuation: false
    } as const)

    setGameMode(config.gameMode)
    setMaxTime(config.maxTime)
    setMaxWords(config.maxWords)
    setMaxSize(config.maxSize)
    setNumbers(config.numbers)
    setPunctuation(config.punctuation)
    setIsMounted(true)
  }, [gameMode, maxTime, maxWords, maxSize, numbers, punctuation])

  if (!isMounted) return <></>

  return (
    <div className="relative h-[100svh]">
      <Logo className="absolute text-white top-4 left-4 aspect-auto w-50" width={200} />

      <div className="absolute right-2 top-2 flex flex-col gap-3">
        <TeamButton />
        <GithubButton />
        <DiscordButton />
        <SupportButton />
      </div>

      <div className="absolute right-2 bottom-2 flex flex-col gap-3">
        <ThemeModeToggle />
        <ThemeColorToggle />
      </div>

      <TestArea quotes={quotes} words={words} gameMode={gameMode} maxTime={maxTime} maxWords={maxWords} maxSize={maxSize} numbers={numbers} punctuation={punctuation} />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-5 items-center">
        <div className="opacity-90">
          Press <span className="px-2 py-1 bg-muted rounded-xs">Enter</span>
          <span> to restart.</span>
        </div>

        <MenuBar
          gameMode={gameMode}
          setGameMode={setGameMode}
          maxTime={maxTime}
          setMaxTime={setMaxTime}
          maxWords={maxWords}
          setMaxWords={setMaxWords}
          maxSize={maxSize}
          setMaxSize={setMaxSize}
          numbers={numbers}
          setNumbers={setNumbers}
          punctuation={punctuation}
          setPunctuation={setPunctuation}
        />
      </div>
    </div>
  )
}

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

function MenuBar({ gameMode, setGameMode, maxTime, setMaxTime, maxWords, setMaxWords, maxSize, setMaxSize, numbers, setNumbers, punctuation, setPunctuation }: MenuBarProps) {
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

function TeamButton() {
  return (
    <Dialog>
      <DialogTrigger>
        <Tooltiped content="Our Team" side="left">
          <div className={buttonVariants({ variant: "outline", size: "icon" })}>
            <UsersIcon />
            <span className="sr-only">Our Team</span>
          </div>
        </Tooltiped>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Team Members</DialogTitle>
          <DialogDescription>
            Takorabet Houssam (242431430718)  {/* (takorabet.houssam.242431430718@gmail.com) */}
            <br />
            Garid Raouf (242431574410) {/* (raoufgrd98@gmail.com) */}
            <br />
            Benkritly Hakim (242431621020) {/* (kimokima381@gmail.com) */}
            <br />
            Saadbouzid Syliane (242431750012) {/* (Syliane2006@gmail.com) */}
            <br />
            Machane Yanis (232331406304) {/* (yanismac74@gmail.com) */}
            <br />
            Tandi Tashinga (23238ZWE19487) {/* (tanditashinga@gmail.com) */}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function GithubButton() {
  return (
    <Tooltiped content="Checkout our Githubs" side="left">
      <Link className={buttonVariants({ variant: "outline", size: "icon" })} href={"https://github.com/0xHouss"} target="_blank">
        <FontAwesomeIcon icon={faGithub} size="xl" />
        <span className="sr-only">Github profile</span>
      </Link>
    </Tooltiped>
  );
}

function DiscordButton() {
  return (
    <Tooltiped content="Visit the discord" side="left">
      <Link className={buttonVariants({ variant: "outline", size: "icon" })} href={"https://discord.gg/xcqH6TeFV3"} target="_blank">
        <FontAwesomeIcon icon={faDiscord} size="xl" />
        <span className="sr-only">Discord Server</span>
      </Link>
    </Tooltiped>
  );
}

function SupportButton() {
  return (
    <Dialog>
      <DialogTrigger>
        <Tooltiped content="Support us" side="left">
          <div className={buttonVariants({ variant: "outline", size: "icon" })}>
            <HandHeartIcon />
            <span className="sr-only">Support us</span>
          </div>
        </Tooltiped>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Support TypeFast</DialogTitle>
          <DialogDescription>
            Thank you so much for thinking about supporting us!
            If you really want to support us, please consider giving us a 20/20.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}