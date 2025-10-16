"use client";

import { useSettings } from "@/contexts/settings-context";

export default function SettingsModal() {
  const { theme, setTheme } = useSettings();

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <div className="grid grid-cols-3 gap-2">
        {["light", "dark", "system"].map((themeOption) => (
          <button
            key={themeOption}
            onClick={() => setTheme(themeOption)}
            className={`p-4 rounded-[20px] ${
              theme === themeOption
                ? "bg-black/5 dark:bg-white/5"
                : "hover:bg-black/10 dark:hover:bg-white/10"
            }`}
          >
            {themeOption}
          </button>
        ))}
      </div>
    </div>
  );
}
