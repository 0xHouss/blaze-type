"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DEFAULT_THEME_COLOR, THEME_COLOR_STORAGE_KEY, THEME_COLORS, ThemeColor } from "@/lib/theme-colors"
import { cn } from "@/lib/utils"
import { Palette } from "lucide-react"
import { useState } from "react"

// The inline script in the root layout has already applied the saved color class by now
function getAppliedThemeColor(): ThemeColor {
  if (typeof document === "undefined") return DEFAULT_THEME_COLOR

  const classes = document.documentElement.classList

  return THEME_COLORS.find(t => classes.contains(t.id))?.id ?? DEFAULT_THEME_COLOR
}

export function ThemeColorToggle() {
  const [themeColor, setThemeColor] = useState(getAppliedThemeColor)

  function selectThemeColor(color: ThemeColor) {
    const root = document.documentElement
    THEME_COLORS.forEach(t => root.classList.remove(t.id))
    root.classList.add(color)

    try {
      localStorage.setItem(THEME_COLOR_STORAGE_KEY, color)
    } catch {
      // Storage unavailable; the color still applies for this visit
    }

    setThemeColor(color)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEME_COLORS.map(color => (
          <DropdownMenuItem key={color.id} onClick={() => selectThemeColor(color.id)} className={cn({ "bg-accent": themeColor === color.id })}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color.swatch }} />
            {color.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
