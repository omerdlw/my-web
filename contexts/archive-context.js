"use client";

import { createContext, useContext, useState } from "react";

const ArchiveContext = createContext();

export function ArchiveProvider({ children }) {
  const [mediaType, setMediaType] = useState("movie");

  return (
    <ArchiveContext.Provider
      value={{
        mediaType,
        setMediaType,
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
}

export const useArchiveContext = () => {
  const context = useContext(ArchiveContext);
  if (!context) {
    throw new Error("useArchiveContext must be used within a ArchiveProvider");
  }
  return context;
};
