import Logo from "@/components/logo";
import { DiscordButton, GithubButton, SupportButton, TeamButton } from "@/components/socials-buttons";
import { ThemeColorToggle } from "@/components/theme-color-toggle";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { getQuotes, getWords } from "./actions";
import Game from "./game";

export default async function Home() {
  const quotes = await getQuotes();
  const words = await getWords();

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

      <Game quotes={quotes} words={words} />
    </div>
  );
}

