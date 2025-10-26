import { useFavorites } from "@/hooks/use-favorites";
import ControlsButton from "../button";

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function FavoritesControls() {
  const { onSectionChange, getNextSection, getPreviousSection } =
    useFavorites();

  const nextSection = getNextSection();
  const previousSection = getPreviousSection();

  return (
    <div className="w-full h-full flex items-center pointer-events-auto space-x-4">
      <div className="w-full flex items-center justify-end gap-3">
        {previousSection && (
          <ControlsButton
            text={capitalizeFirstLetter(previousSection)}
            onClick={() => onSectionChange(previousSection, false)}
            icon={"solar:map-arrow-left-bold"}
          />
        )}
      </div>
      <div className="w-[300px] h-full shrink-0"></div>
      <div className="w-full flex items-center justify-start gap-3">
        {nextSection && (
          <ControlsButton
            onClick={() => onSectionChange(nextSection, true)}
            text={capitalizeFirstLetter(nextSection)}
            icon={"solar:map-arrow-right-bold"}
          />
        )}
      </div>
    </div>
  );
}
