/**
 * Favorites Data Constants
 * Media type constants for favorites data structure
 *
 * Note: These re-export from global constants for consistency
 */

import { MEDIA_TYPES as GLOBAL_MEDIA_TYPES } from "@/config/constants";

export const MEDIA_TYPES = {
  MOVIE: GLOBAL_MEDIA_TYPES.MOVIE,
  SERIES: GLOBAL_MEDIA_TYPES.SERIES,
  GAME: GLOBAL_MEDIA_TYPES.GAME,
  GAME_SERIES: GLOBAL_MEDIA_TYPES.GAME_SERIES,
};

// Export individual types for convenience
export const { MOVIE, SERIES, GAME, GAME_SERIES } = MEDIA_TYPES;
