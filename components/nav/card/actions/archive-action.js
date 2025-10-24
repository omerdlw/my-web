"use client";

import { useArchiveContext } from "@/contexts/archive-context";
import SearchAction from "./search-action";
import Icon from "@/components/icon";

export default function ArchiveAction() {
  const { mediaType, setMediaType } = useArchiveContext();

  const sections = [
    { id: "movie", icon: "solar:video-frame-play-horizontal-bold" },
    { id: "tv", icon: "solar:tv-bold" },
  ];

  return (
    <div
      className="h-auto rounded-[20px] mt-2.5 w-full flex flex-col items-center gap-3"
      onClick={(event) => event.stopPropagation()}
    >
      <SearchAction placeholder={"search in archive"} />
      <div className="w-full flex items-center space-x-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setMediaType(section.id)}
            className={`w-full h-12 cursor-pointer rounded-[20px] flex items-center justify-center gap-2 transition-colors ${
              mediaType === section.id
                ? "bg-skin-primary text-white"
                : "hover:bg-black/10 dark:hover:bg-white/10"
            }`}
          >
            <Icon icon={section.icon} />
          </button>
        ))}
      </div>
    </div>
  );
}
