"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Star } from "lucide-react";
import Title from "../title";

export default function ArchiveEpisodesModal({ data }) {
  const { season, episodes } = data;

  if (!episodes || episodes.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="">No episodes available for this season.</p>
      </div>
    );
  }

  return (
    <>
      <Title
        title={`Season ${season} Episodes`}
        description={`
        ${episodes.length} episode${episodes.length !== 1 ? "s" : ""}`}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-h-[600px] max-w-7xl overflow-auto">
        {episodes.map((episode, index) => {
          const airdate = episode.airdate
            ? new Date(episode.airdate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "TBA";

          const summary = episode.summary
            ? episode.summary.replace(/<[^>]*>?/gm, "").trim()
            : "No summary available.";

          const thumbnailUrl = episode.image?.medium || episode.image?.original;

          return (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex gap-4 p-4 rounded-secondary bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-skin-primary transition-colors group"
            >
              <div className="flex-shrink-0 w-32 h-32 rounded-secondary overflow-hidden bg-black/10 dark:bg-white/10">
                {thumbnailUrl ? (
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={thumbnailUrl}
                    alt={episode.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-bold  opacity-30">
                      E{episode.number}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold group-hover:text-skin-primary transition-colors">
                    <span className="text-skin-primary">E{episode.number}</span>{" "}
                    - {episode.name || "Untitled Episode"}
                  </h3>
                  {episode.rating?.average && (
                    <div className="flex items-center gap-1 text-xs  shrink-0">
                      <Star
                        size={12}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      <span>{episode.rating.average.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span className="opacity-75">{airdate}</span>
                  </div>
                  {episode.runtime && (
                    <>
                      <span className="opacity-40">•</span>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span className="opacity-75">{episode.runtime}m</span>
                      </div>
                    </>
                  )}
                </div>
                {summary !== "No summary available." && (
                  <p className="text-xs  leading-relaxed line-clamp-3">
                    {summary}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
