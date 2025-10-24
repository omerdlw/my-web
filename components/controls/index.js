"use client";
import { usePathname } from "next/navigation";
import Icon from "../icon";
import { useModal } from "@/contexts/modal-context";
import FavoritesControls from "./views/favorites-controls";
import PostControls from "./views/post-controls";
import HomeControls from "./views/home-controls";

export default function Controls() {
  const pathname = usePathname();
  const { openModal } = useModal();

  const renderViewSpecificControls = () => {
    if (pathname === "/") {
      return <HomeControls />;
    }
    if (pathname.startsWith("/blog/")) {
      return <PostControls />;
    }
    if (pathname.startsWith("/favorites")) {
      return <FavoritesControls />;
    }
    return null;
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => openModal("SETTINGS_MODAL")}
          className="size-14 center cursor-pointer backdrop-blur-lg rounded-full border border-black/10 dark:border-white/10 hover:border-skin-primary bg-white/60 dark:bg-black/40 hover:bg-white/80 dark:hover:bg-black/50 transition-colors duration-200 ease-linear"
          aria-label="Open settings"
        >
          <Icon size={20} icon={"solar:settings-bold"} />
        </button>
      </div>
      <div className="fixed left-0 right-0 bottom-0 w-full h-[85px] z-30 pointer-events-none">
        {renderViewSpecificControls()}
      </div>
    </>
  );
}
