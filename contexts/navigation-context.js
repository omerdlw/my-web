"use client";
import { createContext, useContext, useState, useMemo } from "react";

const NavigationContext = createContext(undefined);

export function NavigationProvider({ children }) {
  const [dynamicNavItem, setDynamicNavItem] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const value = useMemo(
    () => ({
      dynamicNavItem,
      setDynamicNavItem,
      expanded,
      setExpanded,
      searchQuery,
      setSearchQuery,
    }),
    [dynamicNavItem, expanded, searchQuery],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error(
      "useNavigationContext must be used within a NavigationProvider",
    );
  }
  return context;
}
