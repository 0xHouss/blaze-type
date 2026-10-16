import Logo from "@/components/logo";
import { DiscordButton, GithubButton, SupportButton } from "@/components/socials-buttons";
import { ThemeColorToggle } from "@/components/theme-color-toggle";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { getWords } from "@/lib/data";
import Game from "./game";

export default async function Home() {
  const words = await getWords();

  return (
    <main className="relative h-[100svh]">
      <h1 className="sr-only">Blaze Type</h1>

      <Logo className="absolute top-4 left-4 aspect-auto w-50" width={200} />

      <div className="absolute right-2 top-2 bottom-2 flex flex-col gap-3 md:justify-between">
        <div className="flex flex-col gap-3">
          <GithubButton />
          <DiscordButton />
          <SupportButton />
        </div>

        <div className="flex flex-col gap-3">
          <ThemeModeToggle />
          <ThemeColorToggle />
        </div>
      </div>

      <Game words={words} />
    </main>
  );
}
