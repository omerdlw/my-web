"use client";

import classNames from "classnames";
import { Star, Calendar } from "lucide-react";

export function FavoriteCard({ item, onClick, section, isLast, isFirst }) {
  return (
    <div
      onClick={onClick}
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
        src={item.poster}
        alt={item.title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
        <h3 className="text-3xl font-bold mb-2 tracking-tight">{item.title}</h3>
        <p className="text-sm opacity-75 mb-4">{item.description}</p>
        <div className="flex items-center space-x-4 mb-4">
          {item.rating && (
            <div className="flex items-center space-x-1.5">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">{item.rating}</span>
            </div>
          )}
          {item.year && (
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-white/70" />
              <span className="text-sm font-medium">{item.year}</span>
            </div>
          )}
        </div>
      </div>
      {section === "games" && item.type === "game-series" && (
        <div className="absolute left-2/4 -translate-x-2/4 top-20 cursor-pointer text-white dark:text-white text-sm font-semibold bg-black/10 dark:bg-black/10 hover:bg-white/5 dark:hover:bg-white/5 p-4 rounded-full inline-block transition-colors backdrop-blur-3xl">
          Browse games
        </div>
      )}
    </div>
  );
}
