import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  READING_CONFIG,
  API_ENDPOINTS,
  REGEX_PATTERNS,
} from "@/config/constants";

// ============================================================================
// Class Name Utilities
// ============================================================================

/**
 * Merges Tailwind CSS classes with proper conflict resolution
 * @param {...(string | Object | Array)} inputs - Class names to merge
 * @returns {string} Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// Text & String Utilities
// ============================================================================

/**
 * Calculates estimated reading time for content
 * @param {string} content - Content to analyze
 * @param {number} [wordsPerMinute] - Reading speed (default: 225 WPM)
 * @returns {number} Estimated reading time in minutes
 */
export function calculateReadingTime(
  content,
  wordsPerMinute = READING_CONFIG.WORDS_PER_MINUTE,
) {
  if (!content || typeof content !== "string") {
    return 0;
  }

  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Generates a URL-friendly slug from text
 * @param {string} text - Text to convert
 * @returns {string} URL-safe slug
 */
export function generateSlug(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Capitalizes first letter of a string
 * @param {string} string - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalizeFirstLetter(string) {
  if (!string || typeof string !== "string") {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Truncates text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} [suffix='...'] - Suffix to append
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength, suffix = "...") {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - suffix.length).trim() + suffix;
}

// ============================================================================
// Date & Time Utilities
// ============================================================================

/**
 * Formats a date string with locale options
 * @param {string | Date} dateString - Date to format
 * @param {Object} [options] - Intl.DateTimeFormat options
 * @param {string} [locale='en-US'] - Locale string
 * @returns {string} Formatted date string
 */
export function formatDate(
  dateString,
  options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  locale = "en-US",
) {
  if (!dateString) {
    return "";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleDateString(locale, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

/**
 * Gets relative time string (e.g., "2 hours ago")
 * @param {string | Date} dateString - Date to compare
 * @returns {string} Relative time string
 */
export function getRelativeTime(dateString) {
  if (!dateString) {
    return "";
  }

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  } catch (error) {
    console.error("Error calculating relative time:", error);
    return "";
  }
}

// ============================================================================
// API & Data Utilities
// ============================================================================

/**
 * Creates API payload for blog post creation
 * @param {Object} formData - Form data object
 * @returns {Object} Formatted API payload
 */
export function createApiPayload(formData) {
  const now = new Date().toISOString();

  const tags = formData.tags
    ? formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  return {
    TITLE: formData.title?.trim() || "",
    SLUG: generateSlug(formData.title || ""),
    CONTENT: formData.content?.trim() || "",
    BANNER_BACKGROUND: formData.bannerBackground?.trim() || "",
    BACKGROUND: formData.background?.trim() || "",
    CATEGORY: formData.category?.trim() || "",
    TAGS: tags,
    AUTHOR: formData.author || {},
    CREATED_AT: now,
    UPDATED_AT: now,
  };
}

/**
 * Fetches currently playing Spotify track
 * @param {Object} [options] - Fetch options
 * @returns {Promise<Object>} Now playing data
 */
export async function getNowPlaying(options = {}) {
  const { signal } = options;
  const url = API_ENDPOINTS.SPOTIFY;

  try {
    console.log("[Spotify] Fetching now playing data from:", url);
    const res = await fetch(url, {
      cache: "no-store",
      signal,
      next: { revalidate: 0 },
    });

    console.log("[Spotify] Response status:", res.status, res.statusText);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[Spotify] API error response:", text);
      throw new Error(
        `Spotify API error: ${res.status} ${res.statusText} ${text}`,
      );
    }

    const data = await res.json();
    console.log("[Spotify] Received data:", data);

    const result = {
      NAME: data.NAME || null,
      ARTIST: data.ARTIST || null,
      ALBUM: data.ALBUM || null,
      COVER: data.COVER || null,
      PLAYING: data.PLAYING === true || data.PLAYING === "true" || false,
      LAST: data.LAST || null,
      RAW: data,
    };

    console.log("[Spotify] Parsed result:", result);
    return result;
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("[Spotify] Fetch aborted");
      return null;
    }
    console.error("[Spotify] Error:", err);
    throw new Error(`Failed to fetch now playing: ${err.message}`);
  }
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validates a URL string
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export function isValidUrl(url) {
  if (!url || typeof url !== "string") {
    return false;
  }
  return REGEX_PATTERNS.URL.test(url);
}

/**
 * Validates an email string
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export function isValidEmail(email) {
  if (!email || typeof email !== "string") {
    return false;
  }
  return REGEX_PATTERNS.EMAIL.test(email);
}

/**
 * Validates a slug string
 * @param {string} slug - Slug to validate
 * @returns {boolean} True if valid slug
 */
export function isValidSlug(slug) {
  if (!slug || typeof slug !== "string") {
    return false;
  }
  return REGEX_PATTERNS.SLUG.test(slug);
}

// ============================================================================
// Browser & Environment Utilities
// ============================================================================

/**
 * Checks if code is running in browser
 * @returns {boolean} True if in browser environment
 */
export function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * Safely gets value from localStorage
 * @param {string} key - Storage key
 * @param {*} [defaultValue=null] - Default value if key not found
 * @returns {*} Retrieved value or default
 */
export function getStorageItem(key, defaultValue = null) {
  if (!isBrowser()) {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Safely sets value in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} True if successful
 */
export function setStorageItem(key, value) {
  if (!isBrowser()) {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Safely removes value from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} True if successful
 */
export function removeStorageItem(key) {
  if (!isBrowser()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

// ============================================================================
// Array & Object Utilities
// ============================================================================

/**
 * Groups array items by a key function
 * @param {Array} array - Array to group
 * @param {Function} keyFn - Function to extract grouping key
 * @returns {Object} Grouped object
 */
export function groupBy(array, keyFn) {
  if (!Array.isArray(array)) {
    return {};
  }

  return array.reduce((result, item) => {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {});
}

/**
 * Removes duplicate items from array
 * @param {Array} array - Array to deduplicate
 * @param {Function} [keyFn] - Optional key function for complex objects
 * @returns {Array} Deduplicated array
 */
export function uniqueArray(array, keyFn) {
  if (!Array.isArray(array)) {
    return [];
  }

  if (!keyFn) {
    return [...new Set(array)];
  }

  const seen = new Set();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Deeply clones an object or array
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item));
  }

  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

// ============================================================================
// Debounce & Throttle Utilities
// ============================================================================

/**
 * Creates a debounced function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeoutId;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeoutId);
      func(...args);
    };

    clearTimeout(timeoutId);
    timeoutId = setTimeout(later, wait);
  };
}

/**
 * Creates a throttled function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 300) {
  let inThrottle;

  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// ============================================================================
// Number Utilities
// ============================================================================

/**
 * Clamps a number between min and max values
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Formats a number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
  if (typeof num !== "number" || isNaN(num)) {
    return "0";
  }
  return num.toLocaleString();
}
