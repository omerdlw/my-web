"use client";

import { useNavigationContext } from "@/contexts/navigation-context";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

function Component({ placeholder }) {
  const { searchQuery, setSearchQuery } = useNavigationContext();
  const [focus, setFocus] = useState(false);
  const inputRef = useRef();
  const containerRef = useRef();

  function handleFocus() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setFocus(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={classNames(
        "h-auto rounded-secondary mt-2.5 w-full flex items-center p-3 gap-3 border border-transparent bg-black/5 dark:bg-white/5",
        {
          "!border-skin-primary": focus,
        },
      )}
      onClick={(event) => {
        event.stopPropagation();
        setFocus(true);
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
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
      />
    </div>
  );
}

const SearchAction = dynamic(() => Promise.resolve(Component), {
  ssr: false,
});
export default SearchAction;
