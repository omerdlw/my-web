import Icon from "@/components/icon";
import { useSettings } from "@/contexts/settings-context";

const THEME_OPTIONS = [
  { value: "light", label: "Açık", icon: <Icon icon={"solar:sun-2-bold"} /> },
  { value: "dark", label: "Koyu", icon: <Icon icon={"solar:moon-bold"} /> },
  {
    value: "system",
    label: "Sistem",
    icon: <Icon icon={"solar:screencast-2-bold"} />,
  },
];

export default function SettingsModal() {
  const { theme, setTheme } = useSettings();

  return (
    <div className="w-full flex items-center gap-4 p-3">
      {THEME_OPTIONS.map(({ value, label, icon }) => (
        <button
          className="py-3 px-8 rounded-secondary bg-black/5 dark:bg-white/5 hover:bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 cursor-pointer"
          aria-label={`${label} temasını seç`}
          onClick={() => setTheme(value)}
          aria-pressed={theme === value}
          type="button"
          key={value}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
