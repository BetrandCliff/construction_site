"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type ThemeMode = "light" | "dark";
type ThemeScope = "website" | "admin";
type ThemeContextValue = {
  websiteTheme: ThemeMode;
  adminTheme: ThemeMode;
  currentTheme: ThemeMode;
  setTheme: (scope: ThemeScope, theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const storageKey = "buildvision-themes";

export function useAppTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useAppTheme must be used within ThemeProvider");
  return value;
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [themes, setThemes] = useState<{ website: ThemeMode; admin: ThemeMode }>({ website: "light", admin: "light" });
  const isAdmin = pathname.startsWith("/admin");
  const currentTheme = isAdmin ? themes.admin : themes.website;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}") as Partial<typeof themes>;
      setThemes({ website: saved.website === "dark" ? "dark" : "light", admin: saved.admin === "dark" ? "dark" : "light" });
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme;
    document.documentElement.dataset.appSection = isAdmin ? "admin" : "public";
    document.documentElement.style.colorScheme = currentTheme;
  }, [currentTheme, isAdmin]);

  function setTheme(scope: ThemeScope, theme: ThemeMode) {
    setThemes((previous) => {
      const next = { ...previous, [scope]: theme };
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }

  return <ThemeContext.Provider value={{ websiteTheme: themes.website, adminTheme: themes.admin, currentTheme, setTheme }}>{children}</ThemeContext.Provider>;
}
