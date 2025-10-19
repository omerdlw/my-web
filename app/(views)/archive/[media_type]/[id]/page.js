"use client";

import { DynamicNavUpdater } from "@/components/nav/updater";
import { createNavItem } from "@/hooks/use-nav-item";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  PlayCircle,
  Users,
  Film,
  Tv,
  Calendar,
  Clock,
  Globe,
  DollarSign,
  Info,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import Icon from "@/components/icon";

import { LoadingState } from "@/components/archive/detail/loading";
import { ErrorState } from "@/components/archive/detail/error";
import { EpisodeList } from "@/components/archive/detail/episode-list";
import { Carousel } from "@/components/archive/detail/carousel";
import { RatingBadge } from "@/components/archive/detail/rating-badge";
import { DetailItem } from "@/components/archive/detail/detail-item";
import { Section } from "@/components/archive/detail/section";
import { useModal } from "@/contexts/modal-context";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

export default function ArchiveDetailPage() {
  const [details, setDetails] = useState(null);
  const [omdbDetails, setOmdbDetails] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { media_type, id } = params;
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
          `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,images,recommendations,similar,watch/providers,external_ids,keywords`
        );
        if (!tmdbRes.ok) throw new Error(`TMDB API Error: ${tmdbRes.status}`);
        const tmdbData = await tmdbRes.json();
        setDetails(tmdbData);

        const imdbId = tmdbData.external_ids?.imdb_id;

        if (media_type === "tv" && imdbId) {
          try {
            const tvmazeLookupRes = await fetch(
              `https://api.tvmaze.com/lookup/shows?imdb=${imdbId}`
            );
            if (tvmazeLookupRes.ok) {
              const tvmazeShowData = await tvmazeLookupRes.json();
              const episodesRes = await fetch(
                `https://api.tvmaze.com/shows/${tvmazeShowData.id}/episodes`
              );
              if (episodesRes.ok) {
                const episodeData = await episodesRes.json();
                setEpisodes(episodeData);
              } else {
                console.warn(
                  `Could not fetch TVmaze episodes for ID: ${tvmazeShowData.id}`
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
            `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`
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

  if (loading) return <LoadingState />;
  if (!details || details.success === false) return <ErrorState />;

  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
  const trailer = details.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
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
    (person) => person.job === "Director"
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
      <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
        <motion.div
          className="relative h-[60vh] md:h-[70vh] w-full bg-cover bg-center bg-no-repeat overflow-hidden"
          style={{
            backgroundImage: details.backdrop_path
              ? `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`
              : "none",
            backgroundPositionY: "center",
          }}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-black dark:via-black/90 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-transparent dark:from-black/70 dark:via-transparent dark:to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent dark:from-black dark:to-transparent backdrop-blur-md" />
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 -mt-40 md:-mt-56 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-14">
            <motion.div
              className="lg:col-span-4 lg:sticky lg:top-20 xl:top-24 h-fit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <motion.img
                src={
                  details.poster_path
                    ? `https://image.tmdb.org/t/p/w780${details.poster_path}`
                    : "/no-poster.png"
                }
                alt={title}
                className="w-full rounded-xl shadow-xl mb-6 shadow-black/20 dark:shadow-black/50"
                layoutId={`poster-${id}`}
              />
              {omdbDetails?.Ratings?.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2 justify-center lg:justify-start">
                  {omdbDetails.Ratings.map((r) => (
                    <RatingBadge
                      key={r.Source}
                      source={r.Source}
                      value={r.Value}
                    />
                  ))}
                </div>
              )}
              <div className="bg-black/5 dark:bg-white/5 backdrop-blur-xl p-5 rounded-xl border border-black/10 dark:border-white/10 space-y-3 shadow-sm mb-6">
                <h3 className="text-base font-semibold mb-2 text-black dark:text-white opacity-90 uppercase tracking-wider">
                  Details
                </h3>
                <DetailItem
                  icon={Users}
                  label="Director"
                  value={director?.name}
                />
                <DetailItem icon={Users} label="Writer(s)" value={writers} />
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
                  label="Original Language"
                  value={details.original_language?.toUpperCase()}
                />
                <DetailItem icon={Info} label="Status" value={status} />
                {media_type === "movie" && (
                  <DetailItem icon={DollarSign} label="Budget" value={budget} />
                )}
                {media_type === "movie" && (
                  <DetailItem
                    icon={DollarSign}
                    label="Revenue"
                    value={revenue}
                  />
                )}
                {productionCompanies && (
                  <DetailItem
                    icon={() => <Icon icon="solar:buildings-bold" size={16} />}
                    label="Production"
                    value={productionCompanies}
                  />
                )}
              </div>
              {imdbId && (
                <a
                  href={`https://www.imdb.com/title/${imdbId}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 bg-yellow-400/90 hover:bg-yellow-400 dark:bg-yellow-500/90 dark:hover:bg-yellow-500 px-4 py-2.5 rounded-lg transition text-black font-semibold text-sm shadow-md backdrop-blur-sm transform"
                >
                  <ExternalLink size={16} /> View on IMDb
                </a>
              )}
            </motion.div>

            <div className="lg:col-span-8 mt-10 lg:mt-0">
              <motion.div
                className="mb-10 lg:mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3 leading-tight text-black dark:text-white tracking-tighter">
                  {title}
                </h1>
                {details.tagline && (
                  <p className="text-xl text-black/60 dark:text-white/60 mb-5 italic">
                    {details.tagline}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 text-sm text-black/80 dark:text-white/80">
                  {year !== "N/A" && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} /> <span>{year}</span>
                    </div>
                  )}
                  {details.vote_average > 0 && (
                    <>
                      <span className="opacity-30">•</span>
                      <div className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="text-yellow-500 dark:text-yellow-400"
                        />
                        <span className="font-medium">
                          {details.vote_average.toFixed(1)}
                          <span className="text-xs opacity-70"> / 10</span>
                        </span>
                      </div>
                    </>
                  )}
                  {runtime && (
                    <>
                      <span className="opacity-30">•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} /> <span>{runtime}</span>
                      </div>
                    </>
                  )}
                  {seasons && (
                    <>
                      <span className="opacity-30">•</span>
                      <div className="flex items-center gap-1.5">
                        <Tv size={14} /> <span>{seasons}</span>
                      </div>
                    </>
                  )}
                  {details.genres?.length > 0 && (
                    <>
                      <span className="opacity-30">•</span>
                      <div className="flex items-center gap-1.5">
                        {media_type === "movie" ? (
                          <Film size={14} />
                        ) : (
                          <Tv size={14} />
                        )}
                        <span>
                          {details.genres.map((g) => g.name).join(", ")}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  {trailer && (
                    <a
                      href={`https://www.youtube.com/watch?v=${trailer.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition text-white font-semibold shadow-lg shadow-red-900/30 dark:shadow-red-500/30 transform"
                    >
                      <PlayCircle size={20} /> Watch Trailer
                    </a>
                  )}
                  {watchProviders?.flatrate?.length > 0 && (
                    <div className="flex items-center gap-2 pl-4 border-l border-black/20 dark:border-white/20">
                      <span className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider">
                        Watch on
                      </span>
                      {watchProviders.flatrate.slice(0, 3).map((p) => (
                        <img
                          key={p.provider_id}
                          src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                          alt={p.provider_name}
                          title={p.provider_name}
                          className="w-8 h-8 object-contain rounded-md bg-white/80 dark:bg-white/10 p-1 shadow-sm transition transform"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              <Section title="Overview" icon={Info}>
                <div className="prose dark:prose-invert max-w-none leading-relaxed space-y-4">
                  <p>{details.overview || "No overview available."}</p>
                </div>
                {keywords?.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-sm font-semibold mb-3 text-black/60 dark:text-white/60 uppercase tracking-wider">
                      Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-xs font-medium bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10 transition cursor-default"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Section>

              {details.credits?.cast?.length > 0 && (
                <Section title="Cast" icon={Users}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {details.credits.cast.slice(0, 16).map((actor, index) => (
                      <motion.div
                        key={actor.id}
                        className="text-center group cursor-pointer"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.05,
                          ease: "easeOut",
                        }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <div className="aspect-[2/3] mb-2 overflow-hidden rounded-lg shadow-md bg-black/5 dark:bg-white/5 transition-all duration-300 group-hover:shadow-lg group-hover:brightness-105">
                          <img
                            src={
                              actor.profile_path
                                ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                                : "/no-profile.png"
                            }
                            alt={actor.name}
                            className="w-full h-full object-cover transition duration-300"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/no-profile.png";
                            }}
                          />
                        </div>
                        <p className="font-semibold text-sm text-black dark:text-white truncate">
                          {actor.name}
                        </p>
                        <p className="text-black/60 dark:text-white/60 text-xs truncate">
                          {actor.character}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </Section>
              )}

              {(details.images?.backdrops?.length > 0 ||
                details.images?.posters?.length > 0) && (
                <Section title="Media" icon={ImageIcon}>
                  {details.images?.backdrops?.length > 0 && (
                    <Carousel
                      items={details.images.backdrops.slice(0, 10)}
                      itemClassName="w-64 md:w-80"
                      renderItem={(img) => (
                        <div
                          onClick={() =>
                            openModal(
                              "IMAGE_MODAL",
                              {
                                image: `https://image.tmdb.org/t/p/w780${img.file_path}`,
                              },
                              "center"
                            )
                          }
                          className="aspect-video overflow-hidden rounded-lg shadow-md bg-black/5 dark:bg-white/5 transition-all duration-300 group/item hover:shadow-lg relative"
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                            alt="Backdrop"
                            className="w-full h-full object-cover transition duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-lg pointer-events-none" />
                        </div>
                      )}
                    />
                  )}
                  <br></br>
                  {details.images?.posters?.length > 0 && (
                    <Carousel
                      items={details.images.posters.slice(0, 10)}
                      itemClassName="w-32 md:w-40"
                      renderItem={(img) => (
                        <div
                          onClick={() =>
                            openModal(
                              "IMAGE_MODAL",
                              {
                                image: `https://image.tmdb.org/t/p/w300${img.file_path}`,
                              },
                              "center"
                            )
                          }
                          className="aspect-[2/3] overflow-hidden rounded-lg shadow-md bg-black/5 dark:bg-white/5 transition-all duration-300 group/item hover:shadow-lg relative"
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w300${img.file_path}`}
                            alt="Poster"
                            className="w-full h-full object-cover transition duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-lg pointer-events-none" />
                        </div>
                      )}
                    />
                  )}
                </Section>
              )}

              {details.videos?.results?.filter((v) => v.site === "YouTube")
                .length > 0 && (
                <Section title="Trailers & Clips" icon={PlayCircle}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {details.videos.results
                      .filter((v) => v.site === "YouTube")
                      .slice(0, 4)
                      .map((video, index) => (
                        <motion.a
                          key={video.id}
                          href={`https://www.youtube.com/watch?v=${video.key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group rounded-lg overflow-hidden shadow-lg relative aspect-video bg-black/50 dark:bg-black/80 transition-all duration-300 hover:shadow-xl hover:ring-2 ring-red-500 ring-offset-2 ring-offset-white dark:ring-offset-black"
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.1,
                            ease: "easeOut",
                          }}
                        >
                          <img
                            src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                            alt={video.name}
                            className="w-full h-full object-cover transition duration-300 opacity-70 group-hover:opacity-100"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-white text-4xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-black/30 group-hover:bg-black/10">
                            <PlayCircle className="drop-shadow-lg" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                            <p className="text-xs font-semibold text-white truncate drop-shadow-md uppercase tracking-wider">
                              {video.type}
                            </p>
                            <p className="text-sm font-medium text-white truncate drop-shadow-md">
                              {video.name}
                            </p>
                          </div>
                        </motion.a>
                      ))}
                  </div>
                </Section>
              )}

              {media_type === "tv" && episodes.length > 0 && (
                <Section title="Episode List" icon={Tv}>
                  <EpisodeList episodes={episodes} />
                </Section>
              )}

              <div className="-mx-6">
                {details.similar?.results?.length > 0 && (
                  <Carousel
                    title="Similar Content"
                    items={details.similar.results}
                    renderItem={(item) => (
                      <motion.div
                        className="w-36 md:w-44 shrink-0 group/item cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/archive/${item.media_type || media_type}/${
                              item.id
                            }`
                          )
                        }
                      >
                        <div className="aspect-[2/3] mb-2 overflow-hidden rounded-lg shadow-md bg-black/5 dark:bg-white/5 relative transition-all duration-300 group-hover/item:shadow-lg">
                          <img
                            src={
                              item.poster_path
                                ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                                : "/no-poster.png"
                            }
                            alt={item.title || item.name}
                            className="w-full h-full object-cover transition duration-300"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/no-poster.png";
                            }}
                          />
                          <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 dark:ring-white/10 group-hover/item:ring-2 group-hover/item:ring-red-500 transition-all duration-300" />
                        </div>
                        <p className="text-sm font-semibold truncate text-black dark:text-white group-hover/item:text-red-600 dark:group-hover/item:text-red-400 transition">
                          {item.title || item.name}
                        </p>
                        <p className="text-xs text-black/60 dark:text-white/60">
                          {item.release_date?.substring(0, 4) ||
                            item.first_air_date?.substring(0, 4)}
                        </p>
                      </motion.div>
                    )}
                  />
                )}
                {details.recommendations?.results?.length > 0 && (
                  <Carousel
                    title="Recommendations"
                    items={details.recommendations.results}
                    renderItem={(item) => (
                      <motion.div
                        className="w-36 md:w-44 mt-4 shrink-0 group/item cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/archive/${item.media_type || media_type}/${
                              item.id
                            }`
                          )
                        }
                      >
                        <div className="aspect-[2/3] mb-2 overflow-hidden rounded-lg shadow-md bg-black/5 dark:bg-white/5 relative transition-all duration-300 group-hover/item:shadow-lg">
                          <img
                            src={
                              item.poster_path
                                ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                                : "/no-poster.png"
                            }
                            alt={item.title || item.name}
                            className="w-full h-full object-cover transition duration-300"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/no-poster.png";
                            }}
                          />
                          <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 dark:ring-white/10 group-hover/item:ring-2 group-hover/item:ring-red-500 transition-all duration-300" />
                        </div>
                        <p className="text-sm font-semibold truncate text-black dark:text-white group-hover/item:text-red-600 dark:group-hover/item:text-red-400 transition">
                          {item.title || item.name}
                        </p>
                        <p className="text-xs text-black/60 dark:text-white/60">
                          {item.release_date?.substring(0, 4) ||
                            item.first_air_date?.substring(0, 4)}
                        </p>
                      </motion.div>
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-24 py-10 text-center text-black/50 dark:text-white/50 text-xs border-t border-black/10 dark:border-white/10">
          Data provided by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-black dark:text-white hover:underline"
          >
            TMDB
          </a>
          ,{" "}
          <a
            href="https://www.omdbapi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-black dark:text-white hover:underline"
          >
            OMDB
          </a>{" "}
          and{" "}
          <a
            href="https://www.tvmaze.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-black dark:text-white hover:underline"
          >
            TVmaze
          </a>
          .
        </footer>

        <div className="h-[80px]"></div>
      </div>
    </>
  );
}
