"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { API_CONFIG, API_ENDPOINTS } from "@/config/constants";
import { Star, Calendar, Play, Info } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import Link from "next/link";
import { gsap } from "gsap";
import { FavoritesSkeleton } from "@/components/shared/skeletons";

const TMDB_IMAGE_BASE = API_ENDPOINTS.TMDB_IMAGE + "/original";
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

const FAVORITE_IDS = {
  movies: [157336, 769, 424],
  series: [2288, 1399, 60059],
  games: ["modern-warfare", "the-last-of-us", "alan-wake-2"],
};

export default function Client() {
  const { selectedSection, direction } = useFavorites();
  const [currentSection, setCurrentSection] = useState(selectedSection);
  const [previousSection, setPreviousSection] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [games, setGames] = useState([]);
  const sectionRefs = useRef({});

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!TMDB_API_KEY) {
        console.error("TMDB API key is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const moviePromises = FAVORITE_IDS.movies.map((id) =>
          fetch(
            `${API_ENDPOINTS.TMDB_BASE}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`,
          ).then((res) => res.json()),
        );

        const seriesPromises = FAVORITE_IDS.series.map((id) =>
          fetch(
            `${API_ENDPOINTS.TMDB_BASE}/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`,
          ).then((res) => res.json()),
        );

        const gamePromises = RAWG_API_KEY
          ? FAVORITE_IDS.games.map((slug) =>
              fetch(
                `${API_ENDPOINTS.RAWG_BASE}/games/${slug}?key=${RAWG_API_KEY}`,
              ).then((res) => res.json()),
            )
          : Promise.resolve([]);

        const [moviesData, seriesData, gamesData] = await Promise.all([
          Promise.all(moviePromises),
          Promise.all(seriesPromises),
          RAWG_API_KEY ? Promise.all(gamePromises) : [],
        ]);

        setMovies(moviesData);
        setSeries(seriesData);

        if (RAWG_API_KEY && gamesData.length > 0) {
          const transformedGames = gamesData.map((game) => ({
            id: game.id,
            title: game.name,
            name: game.name,
            backdrop_path: game.background_image,
            overview: game.description_raw || game.description || "",
            vote_average: game.rating || game.metacritic / 20 || 0,
            release_date: game.released,
            isGame: true,
            platforms: game.platforms?.map((p) => p.platform.name).join(", "),
            genres: game.genres?.map((g) => g.name).join(", "),
          }));
          setGames(transformedGames);
        } else {
          setGames([
            {
              id: 1,
              title: "The Last of Us",
              name: "The Last of Us",
              backdrop_path: "/images/favorites/games/the-last-of-us.jpeg",
              overview:
                "One of the most acclaimed games in its genre, The Last of Us delivers an unforgettable gaming experience.",
              vote_average: 9.5,
              release_date: `${new Date().getFullYear() - 2}-01-01`,
              isGame: true,
            },
            {
              id: 2,
              title: "Call of Duty",
              name: "Call of Duty",
              backdrop_path: "/images/favorites/games/call-of-duty.jpeg",
              overview:
                "One of the most acclaimed games in its genre, Call of Duty delivers an unforgettable gaming experience.",
              vote_average: 9.2,
              release_date: `${new Date().getFullYear() - 1}-01-01`,
              isGame: true,
            },
            {
              id: 3,
              title: "Alan Wake 2",
              name: "Alan Wake 2",
              backdrop_path: "/images/favorites/games/alan-wake-2.jpeg",
              overview:
                "One of the most acclaimed games in its genre, Alan Wake 2 delivers an unforgettable gaming experience.",
              vote_average: 8.9,
              release_date: `${new Date().getFullYear()}-01-01`,
              isGame: true,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const getDataBySection = (section) => {
    if (!section) return [];
    switch (section) {
      case "movies":
        return movies;
      case "series":
        return series;
      case "games":
        return games;
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

    if (!incomingEl || !outgoingEl) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setPreviousSection(null);
      },
    });

    tl.set(incomingEl, {
      x: direction === "right" ? "100%" : "-100%",
      scale: 0.95,
      opacity: 0,
    })
      .to(outgoingEl, {
        x: direction === "right" ? "-100%" : "100%",
        scale: 0.95,
        opacity: 0,
        duration: 0.7,
        ease: "power3.inOut",
      })
      .to(
        incomingEl,
        {
          x: "0%",
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: "power3.inOut",
        },
        "<0.15",
      );
  }, [previousSection, currentSection, direction]);

  const sectionsToRender = [previousSection, currentSection].filter(Boolean);

  if (loading) {
    return <FavoritesSkeleton />;
  }

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      {sectionsToRender.map((section) => {
        const data = getDataBySection(section);
        return (
          <div
            key={section}
            ref={(el) => (sectionRefs.current[section] = el)}
            className="w-full h-[calc(100vh-7rem)] absolute top-0 left-0 right-0 bottom-0"
          >
            <div className="w-full h-full flex items-center justify-center space-x-4 px-10">
              {data.slice(0, 3).map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === 2;
                const mediaType = item.isGame
                  ? "games"
                  : item.first_air_date
                    ? "tv"
                    : "movie";
                const title = item.title || item.name;
                const year = item.release_date || item.first_air_date;
                const rating = item.vote_average;
                const backdrop = item.isGame
                  ? item.backdrop_path
                  : `${TMDB_IMAGE_BASE}${item.backdrop_path}`;
                const isHovered = hoveredIndex === index;

                return (
                  <div
                    key={item.id}
                    className={`relative h-[80vh] flex-1 max-w-[550px] rounded-primary overflow-hidden transition-all duration-700 ease-out border border-black/10 dark:border-white/10 ${
                      isHovered
                        ? "flex-[1.3] z-10 shadow-2xl border-skin-primary/50"
                        : "shadow-lg hover:border-black/20 dark:hover:border-white/20"
                    }`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="absolute inset-0">
                      <img
                        className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
                          isHovered ? "scale-125" : "scale-105"
                        }`}
                        src={backdrop}
                        alt={title}
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-500 ${
                          isHovered ? "opacity-90" : "opacity-100"
                        }`}
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-br from-skin-primary/20 via-transparent to-skin-secondary/20 transition-opacity duration-500 ${
                          isHovered ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                      <h3
                        className={`text-5xl font-black text-center w-full px-4 absolute top-12 left-2/4 -translate-x-2/4 tracking-tight drop-shadow-2xl transition-all duration-500 ${
                          isHovered ? "translate-y-0" : "translate-y-4"
                        }`}
                      >
                        <span className="text-white">{title}</span>
                      </h3>
                      <div
                        className={`space-y-4 transition-all duration-500 ${
                          isHovered
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-8"
                        }`}
                      >
                        <div className="flex items-center space-x-4 text-sm">
                          {rating && (
                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-500/20 rounded-full backdrop-blur-sm border border-yellow-500/30">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="font-semibold text-white">
                                {rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                          {year && (
                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                              <Calendar className="w-4 h-4 text-white" />
                              <span className="font-medium text-white">
                                {new Date(year).getFullYear()}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-white/80 leading-relaxed">
                          {item.overview || "No description available."}
                        </p>
                        {!item.isGame && (
                          <Link
                            href={`/archive/${mediaType}/${item.id}`}
                            className="flex items-center p-4 space-x-2 bg-skin-primary text-white rounded-secondary font-semibold"
                          >
                            <Info className="w-4 h-4" />
                            <span>Details</span>
                          </Link>
                        )}
                      </div>
                    </div>
                    <div
                      className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-skin-primary/10 via-transparent to-skin-secondary/10" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
