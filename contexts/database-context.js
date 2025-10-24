"use client";
import { createContext, useContext, useState, useMemo } from "react";

const DatabaseContext = createContext(undefined);

export function DatabaseProvider({ children, initialPost = null }) {
  const [post, setPost] = useState(initialPost);

  const value = useMemo(() => ({ post, setPost }), [post]);

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
