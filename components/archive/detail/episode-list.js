import { useState, useMemo, memo } from "react"; // React.memo import edildi
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/icon";
import classNames from "classnames";

// Helper function (bileşen dışında veya ayrı bir dosyada olabilir)
const groupEpisodesBySeason = (episodes) => {
  if (!Array.isArray(episodes)) return {}; // Array kontrolü eklendi
  return episodes.reduce((acc, episode) => {
    const season = episode.season;
    // Sezon numarası geçerli bir sayı değilse atla
    if (typeof season !== "number" || isNaN(season)) return acc;
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(episode);
    return acc;
  }, {});
};

// Bölüm ögesini memoize et
const EpisodeItem = memo(({ episode }) => {
  const airdate = episode.airdate
    ? new Date(episode.airdate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "TBA"; // Tarih Yoksa Bilgisi

  // HTML etiketlerini temizle
  const summary = episode.summary
    ? episode.summary.replace(/<[^>]*>?/gm, "").trim() // trim() eklendi
    : "No summary available.";

  return (
    <motion.div
      className="py-4 px-5 bg-black/5 dark:bg-white/10 rounded-lg mb-3 last:mb-0" // dark:bg-white/10 yapıldı, last:mb-0 eklendi
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout // Animasyon sırasında düzen kaymalarını engellemek için
    >
      <div className="flex justify-between items-start mb-2 gap-4">
        {" "}
        {/* items-start ve gap eklendi */}
        <h4 className="text-sm font-semibold text-black dark:text-white flex-1">
          {" "}
          {/* flex-1 eklendi */}
          <span className="text-red-500 font-bold mr-1">
            E{episode.number}
          </span>{" "}
          - {episode.name || "Untitled Episode"}{" "}
          {/* İsim yoksa varsayılan metin */}
        </h4>
        <span className="text-xs text-black/60 dark:text-white/60 shrink-0 whitespace-nowrap pt-0.5">
          {" "}
          {/* pt eklendi */}
          {airdate}
        </span>
      </div>
      {summary !== "No summary available." && ( // Sadece özet varsa göster
        <p className="text-xs text-black/80 dark:text-white/80 leading-relaxed mt-1">
          {summary}
        </p>
      )}
    </motion.div>
  );
});
EpisodeItem.displayName = "EpisodeItem"; // Memo için displayName ekle

// Ana bileşen
export function EpisodeList({ episodes }) {
  const seasons = useMemo(() => groupEpisodesBySeason(episodes), [episodes]);
  const seasonNumbers = useMemo(
    () =>
      Object.keys(seasons)
        .map(Number) // Sayıya çevir
        .sort((a, b) => a - b),
    [seasons],
  );

  // Varsayılan olarak ilk sezonu veya null aç
  const [openSeason, setOpenSeason] = useState(
    seasonNumbers.length > 0 ? seasonNumbers[0] : null,
  );

  if (seasonNumbers.length === 0) {
    return (
      <p className="text-black/60 dark:text-white/60 italic">
        Episode list is not available.
      </p>
    );
  }

  const toggleSeason = (seasonNum) => {
    setOpenSeason((prevOpenSeason) =>
      prevOpenSeason === seasonNum ? null : seasonNum,
    );
  };

  return (
    <div className="space-y-4">
      {seasonNumbers.map((seasonNum) => {
        const isSeasonOpen = openSeason === seasonNum;
        return (
          <div
            key={seasonNum}
            className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-sm bg-white/5 dark:bg-black/10" // Arka plan eklendi
          >
            <button
              onClick={() => toggleSeason(seasonNum)}
              className="w-full flex justify-between items-center p-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition text-left" // text-left eklendi
              aria-expanded={isSeasonOpen} // Erişilebilirlik için
              aria-controls={`season-${seasonNum}-content`}
            >
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Season {seasonNum}
              </h3>
              <motion.div
                animate={{ rotate: isSeasonOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-black/70 dark:text-white/70" // Renk eklendi
              >
                <Icon icon="solar:alt-arrow-down-bold" size={20} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isSeasonOpen && (
                <motion.section // div yerine section kullanıldı
                  id={`season-${seasonNum}-content`} // Erişilebilirlik için id
                  key="content" // AnimatePresence için key
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto", y: 0 },
                    collapsed: { opacity: 0, height: 0, y: -10 },
                  }}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }} // Daha yumuşak ease
                  className="overflow-hidden" // height: 0 için gerekli
                >
                  <div className="p-2 md:p-4 border-t border-black/5 dark:border-white/5">
                    {" "}
                    {/* Üst çizgi eklendi */}
                    {seasons[seasonNum].map((episode) => (
                      <EpisodeItem key={episode.id} episode={episode} />
                    ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
