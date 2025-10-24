import { Star } from "lucide-react";
import classNames from "classnames";

// Sabitler ve Yapılandırma
const RATING_SOURCES = {
  ROTTEN_TOMATOES: "Rotten Tomatoes",
  METACRITIC: "Metacritic",
  IMDB: "IMDb",
};

const rottenTomatoesConfig = (score) => {
  const isFresh = score >= 60;
  return {
    bgColor: isFresh
      ? "bg-red-500/10 dark:bg-red-400/10"
      : "bg-green-500/10 dark:bg-green-400/10",
    textColor: isFresh
      ? "text-red-600 dark:text-red-400"
      : "text-green-600 dark:text-green-400",
    borderColor: isFresh
      ? "border-red-500/20 dark:border-red-400/30"
      : "border-green-500/20 dark:border-green-400/30",
    Icon: () => (
      <img
        src="https://cdn.brandfetch.io/idPcBBhPP1/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1757813313002"
        alt="Rotten Tomatoes"
        className="w-4 h-4 inline filter dark:brightness-[.8] dark:contrast-[1.2]"
        loading="lazy" // lazy loading
      />
    ),
  };
};

const metacriticConfig = (score) => {
  let configKey = "poor";
  if (score >= 60) configKey = "good";
  else if (score >= 40) configKey = "average";

  const configs = {
    good: {
      bgColor: "bg-green-500/10 dark:bg-green-400/10",
      textColor: "text-green-600 dark:text-green-400",
      borderColor: "border-green-500/20 dark:border-green-400/30",
    },
    average: {
      bgColor: "bg-yellow-500/10 dark:bg-yellow-400/10",
      textColor: "text-yellow-600 dark:text-yellow-400",
      borderColor: "border-yellow-500/20 dark:border-yellow-400/30",
    },
    poor: {
      bgColor: "bg-red-500/10 dark:bg-red-400/10",
      textColor: "text-red-600 dark:text-red-400",
      borderColor: "border-red-500/20 dark:border-red-400/30",
    },
  };

  return {
    ...configs[configKey],
    Icon: () => (
      <img
        src="https://cdn.brandfetch.io/idedq6knOg/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1760404009799"
        alt="Metacritic"
        className="w-4 h-4 inline p-0.5 filter dark:invert dark:brightness-90"
        loading="lazy"
      />
    ),
  };
};

const imdbConfig = () => ({
  bgColor: "bg-yellow-500/10 dark:bg-yellow-400/10",
  textColor: "text-yellow-600 dark:text-yellow-400",
  borderColor: "border-yellow-500/20 dark:border-yellow-400/30",
  Icon: () => (
    <img
      src="/imdb.png" // public klasöründeki dosya
      alt="IMDb"
      className="w-5 h-5 inline filter dark:brightness-[.8] dark:contrast-[1.2]"
      loading="lazy"
    />
  ),
});

const defaultConfig = () => ({
  bgColor: "bg-yellow-500/10 dark:bg-yellow-400/10",
  textColor: "text-yellow-600 dark:text-yellow-400",
  borderColor: "border-yellow-500/20 dark:border-yellow-400/30",
  Icon: Star, // Varsayılan ikon
});

const getRatingConfig = (source, value) => {
  // Skor değerini başta parse et
  const score = parseInt(value); // Yüzdelik (%) veya /10 gibi formatları da handle etmek gerekebilir

  if (source.includes(RATING_SOURCES.ROTTEN_TOMATOES) && !isNaN(score)) {
    // Rotten Tomatoes genellikle % üzerinden, score'u ona göre ayarla (varsayılan 100 üzerinden)
    // Eğer value '95%' gibiyse, sadece sayıyı al: parseInt(value.replace('%', ''))
    return rottenTomatoesConfig(score);
  }
  if (source.includes(RATING_SOURCES.METACRITIC) && !isNaN(score)) {
    // Metacritic genellikle 100 üzerinden
    return metacriticConfig(score);
  }
  if (source.includes(RATING_SOURCES.IMDB)) {
    // IMDb genellikle /10 üzerinden, config'de skor kontrolü yok
    return imdbConfig();
  }
  // Diğer veya bilinmeyen kaynaklar için varsayılan
  return defaultConfig();
};

export function RatingBadge({ source, value }) {
  // Kaynak veya değer yoksa null dön
  if (!source || !value) return null;

  const { bgColor, textColor, borderColor, Icon } = getRatingConfig(
    source,
    value,
  );

  return (
    <div
      className={classNames(
        "flex items-center gap-2 px-3 py-1.5 rounded-full", // rounded-2xl yerine rounded-full daha yaygın
        "backdrop-blur-sm border shadow-sm",
        bgColor,
        borderColor,
      )}
      title={`${source}: ${value}`} // title attribute eklendi
    >
      {/* Icon bileşenini çağır */}
      <Icon className="w-4 h-4" /> {/* Boyut ve stil tutarlılığı */}
      <span className={classNames("font-semibold text-sm", textColor)}>
        {/* Değeri temizle (örn. '/10' kısmını kaldır) */}
        {value.split("/")[0]}
      </span>
    </div>
  );
}
