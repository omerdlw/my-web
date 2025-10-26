"use client";

import { DynamicNavUpdater } from "@/components/nav/updater";
import { createNavItem } from "@/hooks/use-nav-item";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  Users,
  Film,
  Tv,
  Calendar,
  Clock,
  Globe,
  DollarSign,
  Info,
} from "lucide-react";
import Icon from "@/components/icon";

import { ErrorState } from "@/components/archive/detail/error";
import { DetailItem } from "@/components/archive/detail/detail-item";
import { useModal } from "@/contexts/modal-context";
import SessionList from "@/components/archive/detail/session-list";
import { ArchiveDetailSkeleton } from "@/components/shared/skeletons";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

export default function Client({ media_type, id }) {
  const [details, setDetails] = useState(null);
  const [omdbDetails, setOmdbDetails] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { openModal } = useModal();

  useEffect(() => {
    if (!media_type || !id || !TMDB_API_KEY || !OMDB_API_KEY) {
      console.error("Missing API Key or params");
      setLoading(false);
      return;
    }
    const fetchAllDetails = async () => {
      setLoading(true);
      setDetails(null);
      setOmdbDetails(null);
      setEpisodes([]);

      try {
        const tmdbRes = await fetch(
          `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,images,recommendations,similar,watch/providers,external_ids,keywords`,
        );
        if (!tmdbRes.ok) throw new Error(`TMDB API Error: ${tmdbRes.status}`);
        const tmdbData = await tmdbRes.json();
        setDetails(tmdbData);

        const imdbId = tmdbData.external_ids?.imdb_id;

        if (media_type === "tv" && imdbId) {
          try {
            const tvmazeLookupRes = await fetch(
              `https://api.tvmaze.com/lookup/shows?imdb=${imdbId}`,
            );
            if (tvmazeLookupRes.ok) {
              const tvmazeShowData = await tvmazeLookupRes.json();
              const episodesRes = await fetch(
                `https://api.tvmaze.com/shows/${tvmazeShowData.id}/episodes`,
              );
              if (episodesRes.ok) {
                const episodeData = await episodesRes.json();
                setEpisodes(episodeData);
              } else {
                console.warn(
                  `Could not fetch TVmaze episodes for ID: ${tvmazeShowData.id}`,
                );
              }
            } else {
              console.warn(`TVmaze lookup failed for IMDb ID: ${imdbId}`);
            }
          } catch (tvmazeError) {
            console.error("Failed to fetch TVmaze data:", tvmazeError);
          }
        }

        if (imdbId) {
          const omdbRes = await fetch(
            `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`,
          );
          if (!omdbRes.ok) throw new Error(`OMDB API Error: ${omdbRes.status}`);
          const omdbData = await omdbRes.json();
          if (omdbData.Response === "True") {
            setOmdbDetails(omdbData);
          } else {
            console.warn("OMDB data not found for:", imdbId);
            setOmdbDetails(null);
          }
        } else {
          setOmdbDetails(null);
        }
      } catch (error) {
        console.error("Failed to fetch details:", error);
        setDetails(null);
        setOmdbDetails(null);
        setEpisodes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllDetails();
  }, [media_type, id]);

  const navItem = details
    ? createNavItem("archiveDetail", { details, media_type, id })
    : null;

  if (loading) return <ArchiveDetailSkeleton />;
  if (!details || details.success === false) return <ErrorState />;

  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";

  const watchProviders = details["watch/providers"]?.results?.TR;
  const runtime = details.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : details.episode_run_time?.[0]
      ? `${details.episode_run_time[0]}m`
      : null;
  const seasons = details.number_of_seasons
    ? `${details.number_of_seasons} Season${
        details.number_of_seasons > 1 ? "s" : ""
      }`
    : null;
  const director = details.credits?.crew?.find(
    (person) => person.job === "Director",
  );
  const writers = details.credits?.crew
    ?.filter((person) => person.department === "Writing")
    .map((p) => p.name)
    .slice(0, 3)
    .join(", ");
  const productionCompanies = details.production_companies
    ?.slice(0, 3)
    .map((c) => c.name)
    .join(", ");
  const keywords =
    details.keywords?.keywords?.map((k) => k.name).slice(0, 5) ||
    details.keywords?.results?.map((k) => k.name).slice(0, 5);
  const budget =
    details.budget > 0 ? `$${details.budget.toLocaleString()}` : null;
  const revenue =
    details.revenue > 0 ? `$${details.revenue.toLocaleString()}` : null;
  const status = details.status;
  const imdbId = details.external_ids?.imdb_id;

  return (
    <>
      {navItem && <DynamicNavUpdater navItem={navItem} />}
      <div className="min-h-screen bg-white dark:bg-black">
        <motion.div
          className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: details.backdrop_path
                ? `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`
                : "none",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/40 dark:from-black dark:via-black/95 dark:to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-transparent dark:from-black/80 dark:via-transparent dark:to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-black dark:to-transparent" />
        </motion.div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-4"
            >
              <div className="lg:sticky lg:top-8 space-y-6">
                <img
                  src={
                    details.poster_path
                      ? `https://image.tmdb.org/t/p/w780${details.poster_path}`
                      : "/no-poster.png"
                  }
                  alt={title}
                  className="w-full rounded-secondary shadow-2xl border border-black/10 dark:border-white/10"
                />
                <div className="p-6 rounded-secondary bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                    Details
                  </h3>
                  <div className="space-y-3">
                    <DetailItem
                      icon={Users}
                      label="Director"
                      value={director?.name}
                    />
                    <DetailItem
                      icon={Users}
                      label="Writer(s)"
                      value={writers}
                    />
                    <DetailItem
                      icon={Calendar}
                      label="Release Date"
                      value={
                        releaseDate
                          ? new Date(releaseDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"
                      }
                    />
                    <DetailItem
                      icon={Globe}
                      label="Language"
                      value={details.original_language?.toUpperCase()}
                    />
                    <DetailItem icon={Info} label="Status" value={status} />
                    {media_type === "movie" && budget && (
                      <DetailItem
                        icon={DollarSign}
                        label="Budget"
                        value={budget}
                      />
                    )}
                    {media_type === "movie" && revenue && (
                      <DetailItem
                        icon={DollarSign}
                        label="Revenue"
                        value={revenue}
                      />
                    )}
                    {productionCompanies && (
                      <DetailItem
                        icon={() => (
                          <Icon icon="solar:buildings-bold" size={16} />
                        )}
                        label="Production"
                        value={productionCompanies}
                      />
                    )}
                  </div>
                </div>

                {imdbId && (
                  <a
                    href={`https://www.imdb.com/title/${imdbId}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-secondary font-semibold transition-colors"
                  >
                    <Icon icon={"solar:eye-bold"} size={18} />
                    View on IMDb
                  </a>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-8 space-y-12"
            >
              <div className="space-y-6">
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    {title}
                  </h1>
                  {details.tagline && (
                    <p className="text-xl opacity-75 italic">
                      {details.tagline}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm opacity-75">
                  {year !== "N/A" && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      <span>{year}</span>
                    </div>
                  )}
                  {details.vote_average > 0 && (
                    <>
                      <span className="opacity-40">•</span>
                      <div className="flex items-center gap-1.5">
                        <Star
                          size={16}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        <span className="font-medium ">
                          {details.vote_average.toFixed(1)}
                          <span className="text-xs "> / 10</span>
                        </span>
                      </div>
                    </>
                  )}
                  {runtime && (
                    <>
                      <span className="opacity-40">•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} />
                        <span>{runtime}</span>
                      </div>
                    </>
                  )}
                  {seasons && (
                    <>
                      <span className="opacity-40">•</span>
                      <div className="flex items-center gap-1.5">
                        <Tv size={16} />
                        <span>{seasons}</span>
                      </div>
                    </>
                  )}
                  {details.genres?.length > 0 && (
                    <>
                      <span className="opacity-40">•</span>
                      <div className="flex items-center gap-1.5">
                        {media_type === "movie" ? (
                          <Film size={16} />
                        ) : (
                          <Tv size={16} />
                        )}
                        <span>
                          {details.genres.map((g) => g.name).join(", ")}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold ">Overview</h2>
                <p className="text-base  leading-relaxed">
                  {details.overview || "No overview available."}
                </p>
                {keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-xs px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10  hover:border-skin-primary transition-colors"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              {media_type === "tv" && episodes.length > 0 && (
                <SessionList
                  episodes={episodes}
                  numberOfSeasons={details.number_of_seasons}
                />
              )}

              {details.credits?.cast?.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold ">Cast</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {details.credits.cast.slice(0, 8).map((actor) => (
                      <div key={actor.id} className="space-y-2">
                        <div className="aspect-[2/3] overflow-hidden rounded-secondary bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                          <img
                            src={
                              actor.profile_path
                                ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            }
                            alt={actor.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold  truncate">
                            {actor.name}
                          </p>
                          <p className="text-xs  truncate">{actor.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {details.videos?.results?.filter((v) => v.site === "YouTube")
                .length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold ">Trailers & Clips</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {details.videos.results
                      .filter((v) => v.site === "YouTube")
                      .slice(0, 4)
                      .map((video) => (
                        <a
                          key={video.id}
                          href={`https://www.youtube.com/watch?v=${video.key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative aspect-video rounded-secondary overflow-hidden bg-black/50 border border-black/10 dark:border-white/10 hover:border-skin-primary transition-colors"
                        >
                          <img
                            src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                            alt={video.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                            <Icon
                              className="text-white"
                              icon={"solar:play-bold"}
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-xs text-white/80 uppercase tracking-wider">
                              {video.type}
                            </p>
                            <p className="text-sm font-medium text-white truncate">
                              {video.name}
                            </p>
                          </div>
                        </a>
                      ))}
                  </div>
                </section>
              )}

              {details.images?.backdrops?.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold ">Images</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {details.images.backdrops.slice(0, 6).map((img, index) => (
                      <div
                        key={index}
                        onClick={() =>
                          openModal(
                            "IMAGE_MODAL",
                            {
                              image: `https://image.tmdb.org/t/p/w780${img.file_path}`,
                            },
                            "center",
                          )
                        }
                        className="aspect-video overflow-hidden rounded-secondary cursor-pointer bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-skin-primary transition-colors"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                          alt="Backdrop"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {details.recommendations?.results?.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold ">Recommendations</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {details.recommendations.results.slice(0, 8).map((item) => (
                      <div
                        key={item.id}
                        onClick={() =>
                          router.push(
                            `/archive/${item.media_type || media_type}/${item.id}`,
                          )
                        }
                        className="space-y-2 cursor-pointer group"
                      >
                        <div className="aspect-[2/3] overflow-hidden rounded-secondary bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 group-hover:border-skin-primary transition-colors">
                          <img
                            src={
                              item.poster_path
                                ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                                : "/no-poster.png"
                            }
                            alt={item.title || item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold  truncate group-hover:text-skin-primary transition-colors">
                            {item.title || item.name}
                          </p>
                          <p className="text-xs ">
                            {item.release_date?.substring(0, 4) ||
                              item.first_air_date?.substring(0, 4)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          </div>

          <footer className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 text-center text-xs ">
            Data provided by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-skin-primary hover:underline"
            >
              TMDB
            </a>
            ,{" "}
            <a
              href="https://www.omdbapi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-skin-primary hover:underline"
            >
              OMDB
            </a>{" "}
            and{" "}
            <a
              href="https://www.tvmaze.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-skin-primary hover:underline"
            >
              TVmaze
            </a>
            .
          </footer>
        </div>

        <div className="h-32" />
      </div>
    </>
  );
}
