"use client";

import { useNavigationContext } from "@/contexts/navigation-context";
import Icon from "@/components/icon";
import { useEffect, useRef } from "react";

export default function SearchAction({ placeholder }) {
  const { searchQuery, setSearchQuery } = useNavigationContext();
  const inputRef = useRef();

  function handleFocus() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  return (
    <div
      className="h-auto rounded-[20px] mt-2.5 w-full flex items-center p-4 gap-3 bg-black/5 dark:bg-white/5"
      onClick={(event) => {
        event.stopPropagation();
        handleFocus();
      }}
    >
      <input
        className="w-full bg-transparent focus:outline-none placeholder-black/50 dark:placeholder-white/50"
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder || "search in posts"}
        value={searchQuery}
        ref={inputRef}
        type="text"
      />
    </div>
  );
}
