import { createContext, useContext, useEffect, useState } from "react";

type Theme = "default" | "midnight-breeze" | "tropical-sunset" | "meadow-fields" | "light" | "dark";
type FontStyle = "inter" | "georgia" | "comic-sans" | "open-dyslexic";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultFont?: FontStyle;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontStyle: FontStyle;
  setFontStyle: (fontStyle: FontStyle) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultTheme = "default",
  defaultFont = "inter",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || defaultTheme
  );
  
  const [fontStyle, setFontStyle] = useState<FontStyle>(
    () => (localStorage.getItem("fontStyle") as FontStyle) || defaultFont
  );

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("default", "midnight-breeze", "tropical-sunset", "meadow-fields", "light", "dark");
    
    // Handle legacy light/dark themes
    if (theme === "light" || theme === "dark") {
      root.classList.add("default");
      localStorage.setItem("theme", "default");
      setTheme("default");
    } else {
      root.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all font classes
    root.classList.remove("font-inter", "font-georgia", "font-comic-sans", "font-open-dyslexic");
    
    // Add selected font class
    root.classList.add(`font-${fontStyle}`);
    localStorage.setItem("fontStyle", fontStyle);
  }, [fontStyle]);

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, fontStyle, setFontStyle }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
