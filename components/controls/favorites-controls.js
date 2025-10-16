import ControlsButton from "./button";
import { useFavorites } from "@/hooks/use-favorites";

export default function FavoritesControls() {
  const {
    selectedSection,
    onSectionChange,
    getNextSection,
    getPreviousSection,
  } = useFavorites();
  const nextSection = getNextSection();
  const previousSection = getPreviousSection();

  return (
    <div className="w-full h-full flex space-x-3">
      <div className="w-full h-full flex items-center justify-end space-x-3">
        {previousSection && (
          <ControlsButton
            text={
              previousSection.charAt(0).toUpperCase() + previousSection.slice(1)
            }
            onClick={() => onSectionChange(previousSection, false)}
            icon={"solar:map-arrow-left-bold"}
            isActive={false}
          />
        )}
      </div>
      <div className="w-[300px] h-full shrink-0"></div>
      <div className="w-full h-full flex items-center justify-start space-x-3">
        {nextSection && (
          <ControlsButton
            text={nextSection.charAt(0).toUpperCase() + nextSection.slice(1)}
            onClick={() => onSectionChange(nextSection)}
            icon={"solar:map-arrow-right-bold"}
            isActive={false}
          />
        )}
      </div>
    </div>
  );
}
