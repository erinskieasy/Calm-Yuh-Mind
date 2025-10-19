import { createContext, useContext, useEffect, useState } from "react";

type Theme = "default" | "midnight-breeze" | "tropical-sunset" | "meadow-fields" | "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultTheme = "default",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || defaultTheme
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

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
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
