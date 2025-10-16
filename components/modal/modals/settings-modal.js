"use client";

import { useSettings } from "@/contexts/settings-context";

export default function SettingsModal() {
    const { theme, setTheme } = useSettings();

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Tema</span>
                <div className="grid grid-cols-3 gap-2">
                    {["light", "dark", "system"].map((themeOption) => (
                        <button
                            key={themeOption}
                            onClick={() => setTheme(themeOption)}
                            className={`px-4 py-2 rounded-lg text-sm capitalize ${
                                theme === themeOption
                                    ? "bg-neutral-200 dark:bg-neutral-700"
                                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            }`}
                        >
                            {themeOption}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}