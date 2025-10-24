"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { THEMES, VALID_THEMES, STORAGE_KEYS } from "@/config/constants";
import { getStorageItem, setStorageItem } from "@/lib/utils";

const SettingsContext = createContext(undefined);

const DEFAULT_SETTINGS = {
  theme: THEMES.SYSTEM,
};

/**
 * Gets settings from localStorage with fallback to defaults
 */
const getStoredSettings = () => {
  const stored = getStorageItem(STORAGE_KEYS.SETTINGS);
  return stored ? { ...DEFAULT_SETTINGS, ...stored } : DEFAULT_SETTINGS;
};

/**
 * Saves settings to localStorage
 */
const saveSettings = (settings) => {
  return setStorageItem(STORAGE_KEYS.SETTINGS, settings);
};

/**
 * Applies theme to document element
 */
const applyThemePreference = (theme) => {
  if (typeof window === "undefined") return;

  let effectiveTheme = theme;

  if (theme === THEMES.SYSTEM) {
    effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? THEMES.DARK
      : THEMES.LIGHT;
  }

  document.documentElement.className = effectiveTheme;
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSettings(getStoredSettings());
      setIsInitialized(true);
    }
  }, []);

  // Apply theme changes and listen to system preference changes
  useEffect(() => {
    if (!isInitialized) return;

    applyThemePreference(settings.theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (settings.theme === THEMES.SYSTEM) {
        applyThemePreference(THEMES.SYSTEM);
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [settings.theme, isInitialized]);

  /**
   * Updates settings and persists to localStorage
   */
  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  }, []);

  /**
   * Sets theme with validation
   */
  const setTheme = useCallback(
    (newTheme) => {
      if (!VALID_THEMES.includes(newTheme)) {
        console.error(`Invalid theme: ${newTheme}`);
        return;
      }
      updateSettings({ theme: newTheme });
    },
    [updateSettings],
  );

  /**
   * Toggles between light and dark theme
   */
  const toggleTheme = useCallback(() => {
    const newTheme =
      settings.theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
  }, [settings.theme, setTheme]);

  /**
   * Resets settings to defaults
   */
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  }, []);

  const contextValue = useMemo(
    () => ({
      settings,
      updateSettings,
      theme: settings.theme,
      setTheme,
      toggleTheme,
      resetSettings,
      isInitialized,
    }),
    [
      settings,
      updateSettings,
      setTheme,
      toggleTheme,
      resetSettings,
      isInitialized,
    ],
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
