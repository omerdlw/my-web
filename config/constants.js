/**
 * Application-wide constants
 * Centralized configuration for magic numbers, strings, and common values
 */

// ============================================================================
// API & External Services
// ============================================================================

export const API_ENDPOINTS = {
  SPOTIFY: "https://omerdlw-api.netlify.app/spotify",
  TMDB_BASE: "https://api.themoviedb.org/3",
  TMDB_IMAGE: "https://image.tmdb.org/t/p",
  RAWG_BASE: "https://api.rawg.io/api",
};

export const API_CONFIG = {
  SPOTIFY_REFRESH_INTERVAL: 15000, // 15 seconds
  FETCH_TIMEOUT: 30000, // 30 seconds
};

// ============================================================================
// Media & Content
// ============================================================================

export const MEDIA_TYPES = {
  MOVIE: "movie",
  SERIES: "tv",
  GAME: "game",
  GAME_SERIES: "game-series",
};

export const IMAGE_SIZES = {
  POSTER: {
    SMALL: "w200",
    MEDIUM: "w500",
    LARGE: "original",
  },
  BACKDROP: {
    SMALL: "w780",
    MEDIUM: "w1280",
    LARGE: "original",
  },
};

// ============================================================================
// Reading & Content Calculation
// ============================================================================

export const READING_CONFIG = {
  WORDS_PER_MINUTE: 225,
};

// ============================================================================
// Navigation & Routing
// ============================================================================

export const ROUTES = {
  HOME: "/",
  BLOG: "/blog",
  BLOG_NEW: "/blog/new",
  BLOG_POST: (slug) => `/blog/${slug}`,
  FAVORITES: "/favorites",
  ARCHIVE: "/archive",
  ARCHIVE_DETAIL: (mediaType, id) => `/archive/${mediaType}/${id}`,
};

export const FAVORITES_SECTIONS = {
  MOVIES: "movies",
  SERIES: "series",
  GAMES: "games",
};

// ============================================================================
// UI & Animation
// ============================================================================

export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 600,
};

export const Z_INDEX = {
  BACKGROUND: -20,
  BASE: 0,
  DROPDOWN: 10,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  TOOLTIP: 60,
};

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
};

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  SETTINGS: "SETTINGS",
  USER_ID: "USER_ID",
  THEME: "THEME",
};

// ============================================================================
// Theme Configuration
// ============================================================================

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

export const VALID_THEMES = Object.values(THEMES);

// ============================================================================
// Form & Validation
// ============================================================================

export const FORM_LIMITS = {
  POST_TITLE_MAX: 200,
  POST_CONTENT_MAX: 50000,
  COMMENT_MAX: 1000,
  AUTHOR_NAME_MAX: 100,
};

// ============================================================================
// Date & Time Formats
// ============================================================================

export const DATE_FORMATS = {
  FULL: {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  SHORT: {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
  YEAR_ONLY: {
    year: "numeric",
  },
};

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  GENERIC: "An unexpected error occurred. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  NOT_FOUND: "The requested resource was not found.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  VALIDATION: "Please check your input and try again.",
  SERVER: "A server error occurred. Please try again later.",
};

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
  POST_CREATED: "Post created successfully!",
  POST_UPDATED: "Post updated successfully!",
  POST_DELETED: "Post deleted successfully!",
  COMMENT_ADDED: "Comment added successfully!",
  SETTINGS_SAVED: "Settings saved successfully!",
};

// ============================================================================
// Placeholder Values
// ============================================================================

export const PLACEHOLDERS = {
  AVATAR:
    "https://i.pinimg.com/736x/aa/d5/d3/aad5d38e5e0c7200301255d69d11dbd9.jpg",
  NO_IMAGE: "/images/placeholder.jpg",
};

// ============================================================================
// Regex Patterns
// ============================================================================

export const REGEX_PATTERNS = {
  URL: /^https?:\/\/.+/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};

// ============================================================================
// HTTP Status Codes
// ============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
