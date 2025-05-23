'use client'

import { MenuBar } from "@/components/menu-bar";
import TestArea from "@/components/test-area";
import { GameMode, MaxSize, MaxTime, MaxWords, Quote } from "@/lib/definitions";
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/utils";
import { useEffect, useState } from "react";

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
    <>
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
    </>
  )
}

