import { useArchiveContext } from "@/contexts/archive-context";
import SearchAction from "./search-action";
import Icon from "@/components/icon";
import dynamic from "next/dynamic";

function Component() {
  const { mediaType, setMediaType } = useArchiveContext();

  const sections = [
    { id: "movie", icon: "solar:video-frame-play-horizontal-bold" },
    { id: "tv", icon: "solar:tv-bold" },
  ];

  return (
    <div
      className="h-auto rounded-secondary mt-2.5 w-full flex flex-col items-center"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="w-full flex items-center gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setMediaType(section.id)}
            className={`w-full h-12 cursor-pointer rounded-secondary flex items-center justify-center gap-2 transition-colors ${
              mediaType === section.id
                ? "bg-skin-primary text-white"
                : "hover:bg-black/10 dark:hover:bg-white/10"
            }`}
          >
            <Icon icon={section.icon} />
          </button>
        ))}
      </div>
      <SearchAction placeholder={"search in archive"} />
    </div>
  );
}

const ArchiveAction = dynamic(() => Promise.resolve(Component), {
  ssr: false,
});
export default ArchiveAction;
