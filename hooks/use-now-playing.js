"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getNowPlaying } from "@/lib/utils";
import { API_CONFIG } from "@/config/constants";

/**
 * Custom hook for fetching and managing Spotify now playing data
 * @param {Object} options - Configuration options
 * @param {number} [options.refreshInterval] - Polling interval in milliseconds
 * @param {boolean} [options.enabled=true] - Whether to enable auto-refresh
 * @returns {Object} Now playing state and utilities
 */
export function useNowPlaying(options = {}) {
  const {
    refreshInterval = API_CONFIG.SPOTIFY_REFRESH_INTERVAL,
    enabled = true,
  } = options;

  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  /**
   * Fetches now playing data from Spotify API
   */
  const fetchData = useCallback(async () => {
    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setState((prev) => ({
      ...prev,
      loading: !prev.data, // Only show loading on initial fetch
      error: null,
    }));

    try {
      const data = await getNowPlaying({
        signal: abortControllerRef.current.signal,
      });

      if (isMountedRef.current && data) {
        setState({
          data,
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      // Ignore abort errors
      if (err.name === "AbortError") {
        return;
      }

      if (isMountedRef.current) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message || "Failed to fetch now playing data",
        }));
      }

      console.error("Error fetching now playing:", err);
    }
  }, []);

  /**
   * Manually refetch the data
   */
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Clears the current data and error
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  // Initial fetch and polling setup
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Initial fetch
    fetchData();

    // Set up polling interval
    const intervalId = setInterval(() => {
      if (isMountedRef.current) {
        fetchData();
      }
    }, refreshInterval);

    // Cleanup function
    return () => {
      clearInterval(intervalId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, refreshInterval, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    // State
    data: state.data,
    loading: state.loading,
    error: state.error,
    isPlaying: state.data?.PLAYING || false,
    hasData: state.data !== null,

    // Utilities
    refetch,
    reset,
  };
}

/**
 * Simplified hook that only returns the current playing status
 * @returns {boolean} Whether music is currently playing
 */
export function useIsPlaying() {
  const { isPlaying } = useNowPlaying();
  return isPlaying;
}

/**
 * Hook that returns formatted now playing information
 * @returns {Object} Formatted now playing data
 */
export function useNowPlayingFormatted() {
  const { data, loading, error } = useNowPlaying();

  if (!data || error) {
    return {
      formatted: null,
      loading,
      error,
    };
  }

  const formatted = {
    title: data.NAME,
    artist: data.ARTIST,
    album: data.ALBUM,
    cover: data.COVER,
    isPlaying: data.PLAYING,
    displayText:
      data.NAME && data.ARTIST ? `${data.NAME} - ${data.ARTIST}` : null,
  };

  return {
    formatted,
    loading,
    error,
  };
}
