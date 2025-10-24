"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { MEDIA_TYPES } from "@/config/constants";

const ArchiveContext = createContext(undefined);

const VALID_MEDIA_TYPES = [MEDIA_TYPES.MOVIE, MEDIA_TYPES.SERIES];
const DEFAULT_MEDIA_TYPE = MEDIA_TYPES.MOVIE;

export function ArchiveProvider({ children }) {
  const [mediaType, setMediaTypeState] = useState(DEFAULT_MEDIA_TYPE);

  const setMediaType = useCallback((type) => {
    if (!VALID_MEDIA_TYPES.includes(type)) {
      console.warn(`Invalid media type: ${type}. Using default.`);
      setMediaTypeState(DEFAULT_MEDIA_TYPE);
      return;
    }
    setMediaTypeState(type);
  }, []);

  const toggleMediaType = useCallback(() => {
    setMediaTypeState((current) =>
      current === MEDIA_TYPES.MOVIE ? MEDIA_TYPES.SERIES : MEDIA_TYPES.MOVIE,
    );
  }, []);

  const isMovie = useMemo(() => mediaType === MEDIA_TYPES.MOVIE, [mediaType]);

  const isSeries = useMemo(() => mediaType === MEDIA_TYPES.SERIES, [mediaType]);

  const value = useMemo(
    () => ({
      mediaType,
      setMediaType,
      toggleMediaType,
      isMovie,
      isSeries,
    }),
    [mediaType, setMediaType, toggleMediaType, isMovie, isSeries],
  );

  return (
    <ArchiveContext.Provider value={value}>{children}</ArchiveContext.Provider>
  );
}

export function useArchiveContext() {
  const context = useContext(ArchiveContext);
  if (context === undefined) {
    throw new Error("useArchiveContext must be used within an ArchiveProvider");
  }
  return context;
}
