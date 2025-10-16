import { useCallback } from "react";
import { useFavoritesContext } from "@/contexts/favorites-context";

const sections = ["movies", "series", "games"];

export const useFavorites = () => {
  const { selectedSection, setSelectedSection, direction, setDirection } =
    useFavoritesContext();

  const onSectionChange = useCallback(
    (section, isNext = true) => {
      setDirection(isNext ? "right" : "left");
      setSelectedSection(section);
    },
    [setSelectedSection, setDirection]
  );

  const getNextSection = useCallback(() => {
    const currentIndex = sections.indexOf(selectedSection);
    return currentIndex < sections.length - 1
      ? sections[currentIndex + 1]
      : null;
  }, [selectedSection]);

  const getPreviousSection = useCallback(() => {
    const currentIndex = sections.indexOf(selectedSection);
    return currentIndex > 0 ? sections[currentIndex - 1] : null;
  }, [selectedSection]);

  return {
    selectedSection,
    direction,
    onSectionChange,
    getNextSection,
    getPreviousSection,
  };
};
