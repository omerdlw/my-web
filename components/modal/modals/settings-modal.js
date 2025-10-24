import Icon from "@/components/icon";
import { useSettings } from "@/contexts/settings-context";

const THEME_OPTIONS = [
  { value: "light", label: "Açık", icon: <Icon icon={"solar:sun-2-bold"} /> },
  { value: "dark", label: "Koyu", icon: <Icon icon={"solar:sun-2-bold"} /> },
  {
    value: "system",
    label: "Sistem",
    icon: <Icon icon={"solar:sun-2-bold"} />,
  },
];

export default function SettingsModal() {
  const { theme, setTheme } = useSettings();

  return (
    <div className="w-full flex flex-col items-center py-8">
      {THEME_OPTIONS.map(({ value, label, icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={`
              flex flex-col items-center gap-1 px-6 py-3 rounded-xl transition-all
              border-2 ${
                theme === value
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/40 shadow-md scale-105"
                  : "border-transparent hover:border-blue-300 hover:bg-blue-100/60 dark:hover:bg-blue-900/20"
              }
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
            `}
          aria-pressed={theme === value}
          aria-label={`${label} temasını seç`}
        >
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}
