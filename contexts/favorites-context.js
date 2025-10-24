"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { FAVORITES_SECTIONS } from "@/config/constants";

const FavoritesContext = createContext(undefined);

const SECTIONS = Object.values(FAVORITES_SECTIONS);
const DEFAULT_SECTION = FAVORITES_SECTIONS.MOVIES;

export function FavoritesProvider({ children }) {
  const [selectedSection, setSelectedSection] = useState(DEFAULT_SECTION);
  const [direction, setDirection] = useState("right");

  const handleSectionChange = useCallback((section, isNext = true) => {
    if (!SECTIONS.includes(section)) {
      console.warn(`Invalid section: ${section}`);
      return;
    }
    setDirection(isNext ? "right" : "left");
    setSelectedSection(section);
  }, []);

  const value = useMemo(
    () => ({
      selectedSection,
      setSelectedSection,
      direction,
      setDirection,
      handleSectionChange,
    }),
    [selectedSection, direction, handleSectionChange],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error(
      "useFavoritesContext must be used within a FavoritesProvider",
    );
  }
  return context;
}
