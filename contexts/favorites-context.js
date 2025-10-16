"use client";

import { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [selectedSection, setSelectedSection] = useState("movies");
  const [direction, setDirection] = useState("right");

  return (
    <FavoritesContext.Provider
      value={{
        selectedSection,
        setSelectedSection,
        direction,
        setDirection,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error(
      "useFavoritesContext must be used within a FavoritesProvider"
    );
  }
  return context;
};
