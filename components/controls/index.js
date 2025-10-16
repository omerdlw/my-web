"use client";
import { usePathname } from "next/navigation";
import PostControls from "./post-controls";
import FavoritesControls from "./favorites-controls";
import HomeControls from "./home-controls";
import Icon from "../icon";
import { useModal } from "@/contexts/modal-context";

export default function Controls() {
  const pathname = usePathname();
  const { openModal } = useModal();

  return (
    <div className="fixed left-0 right-0 bottom-0 w-auto h-[100px] dark:border-white/10 z-30 select-none">
      <div className="fixed bottom-4.5 left-4.5">
        <div
          onClick={() => openModal("SETTINGS_MODAL")}
          className="w-10 h-10 center cursor-pointer rounded-full border border-black/10 dark:border-white/10"
        >
          <Icon size={20} icon={"solar:settings-bold"} />
        </div>
      </div>
      {pathname.startsWith("/blog/") && <PostControls />}
      {pathname.startsWith("/favorites") && <FavoritesControls />}
    </div>
  );
}
