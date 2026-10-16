"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const modes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
]

export function ThemeModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] text-black dark:hidden" />
          <Moon className="h-[1.2rem] w-[1.2rem] hidden dark:block" />
          <span className="sr-only">Toggle theme mode</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {modes.map(mode => (
          <DropdownMenuItem key={mode.value} onClick={() => setTheme(mode.value)} className={cn({ "bg-accent": theme === mode.value })}>
            {mode.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
