"use client"


import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Palette } from "lucide-react"
import { useEffect, useState } from "react"

const themes = [
  "amber-theme",
  "crimson-theme",
  "rosewood-theme",
  "emerald-theme",
  "sapphire-theme",
  "amethyst-theme"
]

export function ThemeColorToggle() {
  const [themeColor, setThemeColor] = useState(themes[0])

  useEffect(() => {
    const root = document.documentElement
    themes.forEach(t => root.classList.remove(t))
    root.classList.add(themeColor)
  }, [themeColor])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setThemeColor(themes[0])} className={cn({ "bg-accent": themeColor === themes[0] })}>
          <span className="h-2 w-2 rounded-full bg-[#ff6900]" />
          Amber
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setThemeColor(themes[1])} className={cn({ "bg-accent": themeColor === themes[1] })}>
          <span className="h-2 w-2 rounded-full bg-[#fb2c36]" />
          Crimson
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setThemeColor(themes[2])} className={cn({ "bg-accent": themeColor === themes[2] })}>
          <span className="h-2 w-2 rounded-full bg-[#ff2056]" />
          Rosewood
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setThemeColor(themes[3])} className={cn({ "bg-accent": themeColor === themes[3] })}>
          <span className="h-2 w-2 rounded-full bg-[#00c951]" />
          Emerald
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setThemeColor(themes[4])} className={cn({ "bg-accent": themeColor === themes[4] })}>
          <span className="h-2 w-2 rounded-full bg-[#2b7fff]" />
          Sapphire
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setThemeColor(themes[5])} className={cn({ "bg-accent": themeColor === themes[5] })}>
          <span className="h-2 w-2 rounded-full bg-[#8e51ff]" />
          Amethyst
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
