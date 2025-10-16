"use client";

import classNames from "classnames";
import { Star } from "lucide-react";

export function GameCard({ game, isFirst, isLast }) {
  return (
    <div
      className={classNames(
        "relative h-[calc(100vh-10rem)] w-[600px] overflow-hidden group cursor-pointer",
        {
          "rounded-l-3xl": isFirst,
          "rounded-r-3xl": isLast,
        }
      )}
    >
      <img
        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        src={game.poster}
        alt={game.title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
        <h3 className="text-3xl font-bold mb-2 tracking-tight">{game.title}</h3>
        <p className="text-sm opacity-75 mb-4 line-clamp-4">
          {game.description}
        </p>
        <div className="flex items-center space-x-4 mb-4">
          <span className="flex items-center font-semibold text-yellow-400">
            <Star className="w-4 h-4 mr-1.5" /> {game.rating}
          </span>
          <span className="text-white/70">{game.year}</span>
          <span className="text-white/70">{game.genre}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {game.platforms.map((platform) => (
            <span
              key={platform}
              className="px-3 py-1 bg-black/40 rounded-full text-sm text-white/80"
            >
              {platform}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
