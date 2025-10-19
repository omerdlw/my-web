import { Star } from "lucide-react";

export function RatingBadge({ source, value }) {
  let bgColor = "bg-yellow-500/10 dark:bg-yellow-400/10";
  let textColor = "text-yellow-600 dark:text-yellow-400";
  let borderColor = "border-yellow-500/20 dark:border-yellow-400/30";
  let IconComponent = Star;

  if (source.includes("Rotten Tomatoes")) {
    const score = parseInt(value);
    bgColor =
      score >= 60
        ? "bg-red-500/10 dark:bg-red-400/10"
        : "bg-green-500/10 dark:bg-green-400/10";
    textColor =
      score >= 60
        ? "text-red-600 dark:text-red-400"
        : "text-green-600 dark:text-green-400";
    borderColor =
      score >= 60
        ? "border-red-500/20 dark:border-red-400/30"
        : "border-green-500/20 dark:border-green-400/30";
    IconComponent = () => (
      <img
        src="https://cdn.brandfetch.io/idPcBBhPP1/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1757813313002"
        alt="Rotten Tomatoes"
        className="w-4 h-4 inline filter dark:brightness-[.8] dark:contrast-[1.2]"
      />
    );
  } else if (source.includes("Metacritic")) {
    const score = parseInt(value);
    bgColor =
      score >= 60
        ? "bg-green-500/10 dark:bg-green-400/10"
        : score >= 40
        ? "bg-yellow-500/10 dark:bg-yellow-400/10"
        : "bg-red-500/10 dark:bg-red-400/10";
    textColor =
      score >= 60
        ? "text-green-600 dark:text-green-400"
        : score >= 40
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400";
    borderColor =
      score >= 60
        ? "border-green-500/20 dark:border-green-400/30"
        : score >= 40
        ? "border-yellow-500/20 dark:border-yellow-400/30"
        : "border-red-500/20 dark:border-red-400/30";
    IconComponent = () => (
      <img
        src="https://cdn.brandfetch.io/idedq6knOg/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1760404009799"
        alt="Metacritic"
        className="w-4 h-4 inline p-0.5 filter dark:invert dark:brightness-90"
      />
    );
  } else if (source.includes("IMDb")) {
    bgColor = "bg-yellow-500/10 dark:bg-yellow-400/10";
    textColor = "text-yellow-600 dark:text-yellow-400";
    borderColor = "border-yellow-500/20 dark:border-yellow-400/30";
    IconComponent = () => (
      <img
        src="/imdb.png"
        alt="IMDb"
        className="w-5 h-5 inline filter dark:brightness-[.8] dark:contrast-[1.2]"
      />
    );
  }

  return (
    <div
      className={`flex items-center gap-2 ${bgColor} px-3 py-1.5 rounded-2xl backdrop-blur-sm border ${borderColor} shadow-sm`}
    >
      <IconComponent />
      <span className={`font-semibold text-sm ${textColor}`}>{value}</span>
    </div>
  );
}
