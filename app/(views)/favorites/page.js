"use client";

import { GameCard } from "@/components/favorites/game-card";
import { FavoriteCard } from "@/components/favorites/card";
import { useState, useRef, useLayoutEffect } from "react";
import { useFavorites } from "@/hooks/use-favorites";
import { MOVIES } from "@/data/favorites/movies";
import { SERIES } from "@/data/favorites/series";
import { GAMES } from "@/data/favorites/games";
import { X } from "lucide-react";
import { gsap } from "gsap";
import { useNavigation } from "@/hooks/use-navigation";

export default function Favorites() {
  const { selectedSection, direction } = useFavorites();
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentSection, setCurrentSection] = useState(selectedSection);
  const [previousSection, setPreviousSection] = useState(null);

  const sectionRefs = useRef({});

  const getDataBySection = (section) => {
    if (!section) return [];
    switch (section) {
      case "movies":
        return MOVIES;
      case "series":
        return SERIES;
      case "games":
        return GAMES;
      default:
        return [];
    }
  };

  useLayoutEffect(() => {
    if (selectedSection !== currentSection) {
      setPreviousSection(currentSection);
      setCurrentSection(selectedSection);
    }
  }, [selectedSection, currentSection]);

  useLayoutEffect(() => {
    if (!previousSection) return;

    const incomingEl = sectionRefs.current[currentSection];
    const outgoingEl = sectionRefs.current[previousSection];

    const tl = gsap.timeline({
      onComplete: () => {
        setPreviousSection(null);
      },
    });

    tl.set(incomingEl, {
      x: direction === "right" ? "100%" : "-100%",
      scale: 0.9,
      opacity: 0,
    })
      .to(outgoingEl, {
        x: direction === "right" ? "-100%" : "100%",
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: "power3.inOut",
      })
      .to(
        incomingEl,
        {
          x: "0%",
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "power3.inOut",
        },
        "<0.2"
      );
  }, [previousSection, currentSection, direction]);

  const sectionsToRender = [previousSection, currentSection].filter(Boolean);

  return (
    <div className="w-screen h-screen">
      {selectedGame ? (
        <>
          <button
            className="absolute top-8 right-8 text-white/60 hover:text-white cursor-pointer z-20 bg-black/30 hover:bg-black/50 rounded-full w-12 h-12 flex items-center justify-center transition-all backdrop-blur-sm"
            onClick={() => setSelectedGame(null)}
          >
            <X size={24} />
          </button>
          <div className="w-full h-[calc(100vh-5rem)] center px-10 absolute top-0 left-0 right-0 bottom-0">
            {selectedGame.games.map((game) => {
              const isFirst = game === selectedGame.games[0];
              const isLast =
                game === selectedGame.games[selectedGame.games.length - 1];
              return (
                <GameCard
                  key={game.title}
                  game={game}
                  isFirst={isFirst}
                  isLast={isLast}
                />
              );
            })}
          </div>
        </>
      ) : (
        <div className="w-full h-full overflow-hidden relative">
          {sectionsToRender.map((section) => {
            const data = getDataBySection(section);
            return (
              <div
                key={section}
                ref={(el) => (sectionRefs.current[section] = el)}
                className="w-full h-[calc(100vh-5rem)] center px-10 absolute top-0 left-0 right-0 bottom-0"
              >
                {data.slice(0, 3).map((item, index) => (
                  <FavoriteCard
                    section={section}
                    isFirst={index === 0}
                    isLast={index === data.length - 1}
                    key={index}
                    item={item}
                    onClick={() => {
                      if (section === "games" && item.type === "game-series") {
                        setSelectedGame(item);
                      }
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
