"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
};

const ThemeProviderContext =
  React.createContext<ThemeProviderState>(initialState);

/**
 * ThemeProvider
 * -------------
 * Lightweight dark/light mode controller (no external deps).
 * - Persists the user choice to localStorage.
 * - Adds/removes the `.dark` class on <html> so the existing CSS variables
 *   defined in globals.css (under `:root` and `.dark`) take effect.
 * - Respects the OS preference when the stored choice is "system".
 * - Re-evaluates automatically if the OS theme changes while in "system" mode.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "xavier-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    "light"
  );

  // Pick up the stored preference on first mount (client only).
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      if (stored === "light" || stored === "dark" || stored === "system") {
        setThemeState(stored);
      }
    } catch {
      /* localStorage unavailable — keep default */
    }
  }, [storageKey]);

  // Apply the resolved theme to <html> and keep state in sync.
  const applyTheme = React.useCallback(
    (next: Theme) => {
      const root = window.document.documentElement;
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const isDark = next === "dark" || (next === "system" && systemDark);

      root.classList.toggle("dark", isDark);
      root.classList.toggle("light", !isDark);
      root.style.colorScheme = isDark ? "dark" : "light";
      setResolvedTheme(isDark ? "dark" : "light");
    },
    []
  );

  React.useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Listen for OS theme changes while in "system" mode.
  React.useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme, applyTheme]);

  const setTheme = React.useCallback(
    (next: Theme) => {
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* ignore write failures */
      }
      setThemeState(next);
    },
    [storageKey]
  );

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const value = React.useMemo<ThemeProviderState>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Custom hook to access the current theme + setters from any client component.
export function useTheme() {
  const context = React.useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
