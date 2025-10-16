"use client";

import { useArchiveContext } from "@/contexts/archive-context";
import Icon from "@/components/icon";
import { useNavigationContext } from "@/contexts/navigation-context";

export default function ArchiveAction() {
  const { mediaType, setMediaType } = useArchiveContext();
  const { searchQuery, setSearchQuery } = useNavigationContext();

  const sections = [
    { id: "movie", icon: "solar:video-frame-play-horizontal-bold" },
    { id: "tv", icon: "solar:tv-bold" },
  ];

  return (
    <div
      className="h-auto rounded-[20px] mt-2.5 w-full flex flex-col items-center gap-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full flex items-center space-x-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setMediaType(section.id)}
            className={`w-full h-12 cursor-pointer rounded-[20px] flex items-center justify-center gap-2 transition-colors ${
              mediaType === section.id
                ? "bg-black/5 dark:bg-white/5"
                : "hover:bg-black/10 dark:hover:bg-white/10"
            }`}
          >
            <Icon icon={section.icon} />
          </button>
        ))}
      </div>
      <div
        className="h-auto rounded-[20px] w-full py-3 px-4 bg-black/5 dark:bg-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          className="w-full bg-transparent focus:outline-none placeholder-black/50 dark:placeholder-white/50"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts"
          value={searchQuery}
          type="text"
        />
      </div>
    </div>
  );
}
