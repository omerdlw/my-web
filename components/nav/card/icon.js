"use client";

import Iconify from "@/components/icon";

export const Icon = ({ icon }) => {
  if (typeof icon === "string" && icon.startsWith("http")) {
    return (
      <div
        className="w-[52px] h-[52px] rounded-[20px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${icon})` }}
      />
    );
  }

  return (
    <div className="flex items-center justify-center size-[52px] rounded-[20px] bg-black/5 dark:bg-white/5">
      <span className="text-2xl">
        <Iconify icon={icon} />
      </span>
    </div>
  );
};
