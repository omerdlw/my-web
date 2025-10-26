"use client";

import { motion } from "framer-motion";
import { useModal } from "@/contexts/modal-context";

export default function SessionList({ episodes, numberOfSeasons }) {
  const { openModal } = useModal();

  if (!episodes || episodes.length === 0) {
    return null;
  }

  // Group episodes by season
  const episodesBySeason = episodes.reduce((acc, episode) => {
    const season = episode.season;
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(episode);
    return acc;
  }, {});

  // Sort seasons
  const sortedSeasons = Object.keys(episodesBySeason)
    .map(Number)
    .sort((a, b) => a - b);

  const handleSeasonClick = (season) => {
    const seasonEpisodes = episodesBySeason[season];
    openModal(
      "ARCHIVE_EPISODES_MODAL",
      {
        season,
        episodes: seasonEpisodes,
      },
      "center",
    );
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Seasons & Episodes</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {sortedSeasons.map((season, index) => {
          const seasonEpisodes = episodesBySeason[season];
          const firstEpisodeImage =
            seasonEpisodes[0]?.image?.medium ||
            seasonEpisodes[0]?.image?.original;

          return (
            <motion.div
              key={season}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => handleSeasonClick(season)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[2/3] rounded-secondary overflow-hidden bg-gradient-to-br from-skin-primary/20 to-skin-primary/5 border border-black/10 dark:border-white/10 hover:border-skin-primary transition-colors">
                {firstEpisodeImage ? (
                  <>
                    <img
                      src={firstEpisodeImage}
                      alt={`Season ${season}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-bold opacity-10">
                      {season}
                    </span>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <h3 className="text-lg font-bold mb-1">Season {season}</h3>
                  <p className="text-xs opacity-90">
                    {seasonEpisodes.length} episode
                    {seasonEpisodes.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {sortedSeasons.length === 0 && numberOfSeasons > 0 && (
        <div className="p-8 text-center rounded-secondary bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
          <p className="opacity-75">
            This show has {numberOfSeasons} season
            {numberOfSeasons !== 1 ? "s" : ""}, but episode data is not
            available yet.
          </p>
        </div>
      )}
    </section>
  );
}
