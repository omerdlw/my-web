import { useCallback } from "react";
import { useFavoritesContext } from "@/contexts/favorites-context";
import { FAVORITES_SECTIONS } from "@/config/constants";

const SECTIONS = Object.values(FAVORITES_SECTIONS);

/**
 * Custom hook for managing favorites sections navigation
 * @returns {Object} Favorites navigation utilities
 */
export const useFavorites = () => {
  const { selectedSection, setSelectedSection, direction, setDirection } =
    useFavoritesContext();

  /**
   * Changes the current section with direction animation
   * @param {string} section - Section to navigate to
   * @param {boolean} [isNext=true] - Whether navigating forward
   */
  const onSectionChange = useCallback(
    (section, isNext = true) => {
      if (!SECTIONS.includes(section)) {
        console.warn(`Invalid section provided: ${section}`);
        return;
      }

      setDirection(isNext ? "right" : "left");
      setSelectedSection(section);
    },
    [setSelectedSection, setDirection],
  );

  /**
   * Gets the index of the current section
   * @returns {number} Current section index
   */
  const getSectionIndex = useCallback(
    () => SECTIONS.indexOf(selectedSection),
    [selectedSection],
  );

  /**
   * Gets the next section or null if at the end
   * @returns {string|null} Next section name
   */
  const getNextSection = useCallback(() => {
    const currentIndex = getSectionIndex();
    return currentIndex < SECTIONS.length - 1
      ? SECTIONS[currentIndex + 1]
      : null;
  }, [getSectionIndex]);

  /**
   * Gets the previous section or null if at the start
   * @returns {string|null} Previous section name
   */
  const getPreviousSection = useCallback(() => {
    const currentIndex = getSectionIndex();
    return currentIndex > 0 ? SECTIONS[currentIndex - 1] : null;
  }, [getSectionIndex]);

  /**
   * Navigates to the next section
   */
  const goToNextSection = useCallback(() => {
    const next = getNextSection();
    if (next) {
      onSectionChange(next, true);
    }
  }, [getNextSection, onSectionChange]);

  /**
   * Navigates to the previous section
   */
  const goToPreviousSection = useCallback(() => {
    const previous = getPreviousSection();
    if (previous) {
      onSectionChange(previous, false);
    }
  }, [getPreviousSection, onSectionChange]);

  /**
   * Checks if currently at first section
   * @returns {boolean}
   */
  const isFirstSection = useCallback(() => {
    return getSectionIndex() === 0;
  }, [getSectionIndex]);

  /**
   * Checks if currently at last section
   * @returns {boolean}
   */
  const isLastSection = useCallback(() => {
    return getSectionIndex() === SECTIONS.length - 1;
  }, [getSectionIndex]);

  return {
    // Current state
    selectedSection,
    direction,
    sections: SECTIONS,

    // Navigation functions
    onSectionChange,
    goToNextSection,
    goToPreviousSection,

    // Query functions
    getNextSection,
    getPreviousSection,
    getSectionIndex,
    isFirstSection,
    isLastSection,
  };
};
