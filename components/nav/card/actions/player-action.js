"use client";

import { useNowPlaying } from "@/hooks/use-now-playing";
import Icon from "@/components/icon";
import dynamic from "next/dynamic";

function Component() {
  const { data, loading, error } = useNowPlaying();

  if (loading || error) {
    return (
      <div
        className={`h-auto rounded-[20px] mt-2.5 w-full flex items-center p-2 gap-3 bg-black/5 dark:bg-white/5 animate-pulse`}
      >
        <div
          className={`h-12 w-12 rounded-[14px] bg-black/10 dark:bg-white/10`}
        />
        <div className="flex-1 space-y-2">
          <div
            className={`w-32 h-3 rounded-full bg-black/10 dark:bg-white/10`}
          ></div>
          <div
            className={`w-20 h-2 rounded-full bg-black/10 dark:bg-white/10`}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto rounded-[20px] mt-2.5 w-full flex items-center p-2 gap-3 bg-black/5 dark:bg-white/5">
      <img
        src={data.COVER}
        alt={`${data.NAME} cover`}
        className="h-12 w-12 rounded-[14px] object-cover"
        crossOrigin="anonymous"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-1">
          <Icon icon="mdi:spotify" size={18} color="#1DB954" />
          <div className="text-sm font-semibold truncate">{data.NAME}</div>
        </div>
        <div className="text-xs opacity-75 truncate">{data.ARTIST}</div>
      </div>
    </div>
  );
}

const PlayerAction = dynamic(() => Promise.resolve(Component), {
  ssr: false,
});
export default PlayerAction;
