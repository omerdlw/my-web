"use client";
import { createContext, useContext, useState } from "react";

const DatabaseContext = createContext();

export function DatabaseProvider({ children, initialPost }) {
  const [post, setPost] = useState(initialPost || null);

  return (
    <DatabaseContext.Provider value={{ post, setPost }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("Database Context ERROR");
  }
  return context;
}
