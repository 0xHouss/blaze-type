'use client'

import { MenuBar } from "@/components/menu-bar";
import TestArea, { StatsBar, testAreaClassName } from "@/components/test-area";
import { useTypingTest } from "@/hooks/use-typing-test";
import { Config, parseConfig } from "@/lib/definitions";
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/utils";
import { useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};

export default function Game({ words }: { words: string[] }) {
  // The test text is random and settings live in localStorage, so the interactive game only
  // renders in the browser. The server sends the same layout with empty stats in its place.
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);

  if (!isClient) {
    return (
      <>
        <div className={testAreaClassName}>
          <StatsBar wpm={0} seconds={0} timeLeft={null} accuracy={100} finished={false} />
        </div>

        <BottomBar />
      </>
    );
  }

  return <ClientGame words={words} />;
}

function ClientGame({ words }: { words: string[] }) {
  const [config, setConfig] = useState(() => parseConfig(getFromLocalStorage("config")));
  const test = useTypingTest(config, words);

  function updateConfig(patch: Partial<Config>) {
    const next = { ...config, ...patch };

    setConfig(next);
    saveToLocalStorage("config", next);
    test.restart(next);
  }

  return (
    <>
      <TestArea state={test.state} stats={test.stats} onType={test.type} onRestart={() => test.restart(config)} />

      <BottomBar>
        <MenuBar config={config} onChange={updateConfig} />
      </BottomBar>
    </>
  );
}

function BottomBar({ children }: { children?: React.ReactNode }) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-5 items-center">
      <div className="opacity-90 whitespace-nowrap">
        Press <span className="px-2 py-1 bg-muted rounded-xs">Enter</span>
        <span> to restart.</span>
      </div>

      {children}
    </div>
  );
}
