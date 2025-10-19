import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/icon";

const groupEpisodesBySeason = (episodes) => {
  if (!episodes) return {};
  return episodes.reduce((acc, episode) => {
    const season = episode.season;
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(episode);
    return acc;
  }, {});
};

const EpisodeItem = ({ episode }) => {
  const airdate = episode.airdate
    ? new Date(episode.airdate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "TBA";
  const summary = episode.summary
    ? episode.summary.replace(/<[^>]*>?/gm, "")
    : "No summary available.";

  return (
    <motion.div
      className="py-4 px-5 bg-black/5 dark:bg-white/5 rounded-lg mb-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-semibold text-black dark:text-white">
          <span className="text-red-500 font-bold">E{episode.number}</span> -{" "}
          {episode.name}
        </h4>
        <span className="text-xs text-black/60 dark:text-white/60 shrink-0 ml-4">
          {airdate}
        </span>
      </div>
      <p className="text-xs text-black/80 dark:text-white/80 leading-relaxed">
        {summary}
      </p>
    </motion.div>
  );
};

export function EpisodeList({ episodes }) {
  const seasons = groupEpisodesBySeason(episodes);
  const seasonNumbers = Object.keys(seasons).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  const [openSeason, setOpenSeason] = useState(
    parseInt(seasonNumbers[0] || "1")
  );

  if (seasonNumbers.length === 0) {
    return (
      <p className="text-black/60 dark:text-white/60">
        No episode list available.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {seasonNumbers.map((seasonNum) => {
        const isSeasonOpen = openSeason === parseInt(seasonNum);
        return (
          <div
            key={seasonNum}
            className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-sm"
          >
            <button
              onClick={() =>
                setOpenSeason(isSeasonOpen ? null : parseInt(seasonNum))
              }
              className="w-full flex justify-between items-center p-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition"
            >
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Season {seasonNum}
              </h3>
              <motion.div
                animate={{ rotate: isSeasonOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Icon icon="solar:alt-arrow-down-bold" size={20} />
              </motion.div>
            </button>
            <AnimatePresence>
              {isSeasonOpen && (
                <motion.div
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto", y: 0 },
                    collapsed: { opacity: 0, height: 0, y: -10 },
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="p-2 md:p-4"
                >
                  {seasons[seasonNum].map((episode) => (
                    <EpisodeItem key={episode.id} episode={episode} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
