// src/context/ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeName = "light" | "dark";

type ThemeColors = {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
  primary: string;
  accent: string; 
};

type Theme = {
  name: ThemeName;
  colors: ThemeColors;
};

type ThemeContextValue = {
  themeName: ThemeName;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (name: ThemeName) => void;
};

const STORAGE_KEY = "streamcompass_theme";

const lightTheme: Theme = {
  name: "light",
  colors: {
    background: "#f3f4f6",
    card: "#ffffff",
    text: "#111827",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    tabBarBackground: "#d4c7cf",
    tabBarActive: "#f97316",
    tabBarInactive: "#9ca3af",
    primary: "#111827",
    accent: "#d66b13",
  },
};

const darkTheme: Theme = {
  name: "dark",
  colors: {
    background: "#020617",
    card: "#020617",
    text: "#f9fafb",
    textSecondary: "#9ca3af",
    border: "#111827",
    tabBarBackground: "#020617",
    tabBarActive: "#f9fafb",
    tabBarInactive: "#6b7280",
    primary: "#f97316",
    accent: "#f97316",
  },
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(lightTheme);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === "dark") {
          setThemeState(darkTheme);
        }
      } catch (e) {
        console.log("[Theme] Failed to load stored theme:", e);
      }
    })();
  }, []);

  const setTheme = (name: ThemeName) => {
    const next = name === "dark" ? darkTheme : lightTheme;
    setThemeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next.name).catch((e) =>
      console.log("[Theme] Failed to store theme:", e)
    );
  };

  const toggleTheme = () => {
    setTheme(theme.name === "light" ? "dark" : "light");
  };

  const value: ThemeContextValue = {
    themeName: theme.name,
    colors: theme.colors,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
