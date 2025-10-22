"use client"; // Bu satırı ekleyin

import { useRouter } from "next/navigation";
import { useFavorites } from "@/hooks/use-favorites";

export default function FavoritesAction() {
  const router = useRouter();
  const { selectedSection } = useFavorites();

  const handleClick = (e) => {
    e.stopPropagation();
    router.push("/archive");
  };

  if (selectedSection === "games") {
    return null;
  }

  return (
    <div
      className="h-auto rounded-[20px] mt-2.5 w-full flex items-center p-3 gap-3 bg-black/5 dark:bg-white/5 hover:bg-skin-primary group transition-colors duration-200 ease-linear"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="w-full focus:outline-none text-center group-hover:text-white">
        view my archive
      </div>
    </div>
  );
}
