export const THEME_COLORS = [
  { id: "amber-theme", label: "Amber", swatch: "#ff6900" },
  { id: "crimson-theme", label: "Crimson", swatch: "#fb2c36" },
  { id: "rosewood-theme", label: "Rosewood", swatch: "#ff2056" },
  { id: "emerald-theme", label: "Emerald", swatch: "#00c951" },
  { id: "sapphire-theme", label: "Sapphire", swatch: "#2b7fff" },
  { id: "amethyst-theme", label: "Amethyst", swatch: "#8e51ff" },
] as const;

export type ThemeColor = (typeof THEME_COLORS)[number]["id"];

export const DEFAULT_THEME_COLOR: ThemeColor = "amber-theme";

export const THEME_COLOR_STORAGE_KEY = "theme-color";

// Inlined in <head> so the saved color is applied before the first paint, without a flash
export const themeColorScript = `try{var c=localStorage.getItem(${JSON.stringify(THEME_COLOR_STORAGE_KEY)});if(${JSON.stringify(THEME_COLORS.map(t => t.id))}.indexOf(c)>-1)document.documentElement.classList.add(c)}catch(e){}`;
