// omerdlw/my-web/my-web-8c9d3b951d3315c1970a1b4fb7b7e54249edbd81/app/(views)/archive/[media_type]/[id]/page.js

"use client";

import { DynamicNavUpdater } from "@/components/nav/updater";
import { createNavItem } from "@/hooks/use-nav-item";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Icon from "@/components/icon";
import { motion, AnimatePresence } from "framer-motion";
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
  Tag,
  Info,
  Image as ImageIcon,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

// --- Bileşenler ---

const RatingBadge = ({ source, value }) => {
  // Renkler tema bazlı siyah/beyaz tonlarına güncellendi
  let bgColor = "bg-yellow-500/10 dark:bg-yellow-400/10";
  let textColor = "text-yellow-600 dark:text-yellow-400";
  let borderColor = "border-yellow-500/20 dark:border-yellow-400/30";
  let IconComponent = Star;

  if (source.includes("Rotten Tomatoes")) {
    const score = parseInt(value);
    bgColor =
      score >= 60
        ? "bg-red-500/10 dark:bg-red-400/10"
        : "bg-green-500/10 dark:bg-green-400/10";
    textColor =
      score >= 60
        ? "text-red-600 dark:text-red-400"
        : "text-green-600 dark:text-green-400";
    borderColor =
      score >= 60
        ? "border-red-500/20 dark:border-red-400/30"
        : "border-green-500/20 dark:border-green-400/30";
    IconComponent = () => (
      <img
        src="/rotten-tomatoes.png"
        alt="Rotten Tomatoes"
        className="w-4 h-4 inline filter dark:brightness-[.8] dark:contrast-[1.2]"
      />
    );
  } else if (source.includes("Metacritic")) {
    const score = parseInt(value);
    bgColor =
      score >= 60
        ? "bg-green-500/10 dark:bg-green-400/10"
        : score >= 40
        ? "bg-yellow-500/10 dark:bg-yellow-400/10"
        : "bg-red-500/10 dark:bg-red-400/10";
    textColor =
      score >= 60
        ? "text-green-600 dark:text-green-400"
        : score >= 40
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400";
    borderColor =
      score >= 60
        ? "border-green-500/20 dark:border-green-400/30"
        : score >= 40
        ? "border-yellow-500/20 dark:border-yellow-400/30"
        : "border-red-500/20 dark:border-red-400/30";
    IconComponent = () => (
      <img
        src="/metacritic.png"
        alt="Metacritic"
        className="w-4 h-4 inline p-0.5 filter dark:invert dark:brightness-90"
      />
    );
  } else if (source.includes("IMDb")) {
    bgColor = "bg-yellow-500/10 dark:bg-yellow-400/10";
    textColor = "text-yellow-600 dark:text-yellow-400";
    borderColor = "border-yellow-500/20 dark:border-yellow-400/30";
    IconComponent = () => (
      <img
        src="/imdb.png"
        alt="IMDb"
        className="w-5 h-5 inline filter dark:brightness-[.8] dark:contrast-[1.2]"
      />
    );
  }

  return (
    <div
      className={`flex items-center gap-2 ${bgColor} px-3 py-1.5 rounded-lg backdrop-blur-sm border ${borderColor} shadow-sm`}
    >
      <IconComponent />
      <span className={`font-semibold text-sm ${textColor}`}>{value}</span>
    </div>
  );
};

// --- YENİ CAROUSEL BİLEŞENİ ---
const Carousel = ({
  title,
  items,
  renderItem,
  itemClassName = "w-36 md:w-44",
}) => {
  if (!items || items.length === 0) return null;

  const scrollContainerRef = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Scroll pozisyonunu ve overflow durumunu kontrol et
  const checkScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // İçeriğin sığıp sığmadığını kontrol et
    const overflow = el.scrollWidth > el.clientWidth;
    setHasOverflow(overflow);

    // Başlangıçta mı? (50px esneme payı)
    const atStart = el.scrollLeft < 50;
    setIsAtStart(atStart);

    // Sonda mı? (50px esneme payı)
    const atEnd = el.scrollWidth - (el.scrollLeft + el.clientWidth) < 50;
    setIsAtEnd(atEnd);
  };

  // Component mount edildiğinde ve resize olduğunda kontrol et
  useLayoutEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // İlk durumu kontrol et
    checkScrollState();

    // Yeniden boyutlandırmayı dinle
    const resizeObserver = new ResizeObserver(checkScrollState);
    resizeObserver.observe(el);

    // Cleanup
    return () => resizeObserver.disconnect();
  }, [items]); // items değiştiğinde de kontrol et

  // Kaydırma fonksiyonu
  const scroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Her seferinde container genişliğinin %80'i kadar kaydır
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="mb-16 relative group">
      {" "}
      {/* Butonlar için relative group */}
      <h2 className="text-2xl font-semibold mb-5 text-black dark:text-white">
        {title}
      </h2>
      <div className="overflow-x-hidden">
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollState} // Kaydırmayı dinle
          className="flex flex-nowrap overflow-x-auto space-x-4 pb-6 pt-1 px-6 scrollbar-hide -ml-6 scroll-p-6 scroll-smooth" // scroll-p-6 ve scroll-smooth eklendi
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              className={`shrink-0 ${itemClassName}`}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: "easeOut",
              }}
            >
              {renderItem(item)}
            </motion.div>
          ))}
        </div>
      </div>
      {/* Navigasyon Butonları */}
      <AnimatePresence>
        {hasOverflow && !isAtStart && (
          <motion.button
            onClick={() => scroll("prev")}
            className="absolute top-1/2 left-0 z-20 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hasOverflow && !isAtEnd && (
          <motion.button
            onClick={() => scroll("next")}
            className="absolute top-1/2 right-0 z-20 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---

const DetailItem = ({ icon: IconComponent, label, value }) => {
  if (!value) return null;
  return (
    <div className="py-1">
      {/* Renkler güncellendi: text-zinc-* */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-0.5 uppercase tracking-wider">
        {IconComponent && <IconComponent size={14} />}
        <span>{label}</span>
      </div>
      <span className="text-sm font-medium text-black dark:text-white">
        {value}
      </span>
    </div>
  );
};

// --- YENİ TVMAZE BİLEŞENLERİ ---

// Bölümleri sezonlara göre gruplamak için yardımcı fonksiyon
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

// Tek bir bölüm bileşeni
const EpisodeItem = ({ episode }) => {
  const airdate = episode.airdate
    ? new Date(episode.airdate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "TBA";

  // Özet metnindeki HTML etiketlerini kaldır
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

// Akordiyon stilinde sezon listesi bileşeni
const EpisodeList = ({ seasons }) => {
  const seasonNumbers = Object.keys(seasons).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  // Varsayılan olarak ilk sezonu açık başlat
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
};

// ---

const Section = ({ title, icon: IconComponent, children, className = "" }) => (
  <motion.section
    className={`mb-16 ${className}`}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }} // amount artırıldı
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-black dark:text-white border-l-4 border-red-500 pl-4 py-1 bg-gradient-to-r from-red-500/5 to-transparent">
      {IconComponent && <IconComponent size={24} className="opacity-80" />}{" "}
      {title}
    </h2>
    {children}
  </motion.section>
);

// --- Ana Sayfa Bileşeni ---

export default function ArchiveDetailPage() {
  const [details, setDetails] = useState(null);
  const [omdbDetails, setOmdbDetails] = useState(null);
  const [tvmazeDetails, setTvmazeDetails] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { media_type, id } = params;

  // GÜNCELLENMİŞ useEffect
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
      setTvmazeDetails(null);
      setEpisodes([]);

      try {
        // 1. TMDB Verisini Çek
        const tmdbRes = await fetch(
          `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,images,recommendations,similar,watch/providers,external_ids,keywords`
        );
        if (!tmdbRes.ok) throw new Error(`TMDB API Error: ${tmdbRes.status}`);
        const tmdbData = await tmdbRes.json();
        setDetails(tmdbData);

        const imdbId = tmdbData.external_ids?.imdb_id;

        // 2. TV Programıysa TVmaze Verisini Çek
        if (media_type === "tv" && imdbId) {
          try {
            const tvmazeLookupRes = await fetch(
              `https://api.tvmaze.com/lookup/shows?imdb=${imdbId}`
            );
            if (tvmazeLookupRes.ok) {
              const tvmazeShowData = await tvmazeLookupRes.json();
              setTvmazeDetails(tvmazeShowData);

              // TVmaze ID'si ile bölümleri çek
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

        // 3. OMDB Verisini Çek (IMDb ID varsa)
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
        setTvmazeDetails(null);
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

  // --- Yüklenme ve Hata Durumları (değişiklik yok) ---
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center p-4 bg-white dark:bg-black">
        <div className="animate-spin text-black dark:text-white">
          <Icon spin icon="mingcute:loading-3-fill" size={40} />
        </div>
      </div>
    );
  }
  if (!details || details.success === false) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center text-center text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-black px-4">
        <Icon
          icon="solar:sad-square-bold-duotone"
          size={60}
          className="mb-4 text-red-500"
        />
        <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
          Details Could Not Be Loaded
        </h2>
        <p>
          The requested content was not found or there might be an issue with
          the API keys.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-6 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 text-black dark:text-white px-4 py-2 rounded-lg transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  // --- Veri Hazırlama (değişiklik yok) ---
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
  const languages = details.spoken_languages
    ?.map((lang) => lang.english_name)
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

  // --- JSX ---
  return (
    <>
      {navItem && <DynamicNavUpdater navItem={navItem} />}
      {/* Arka plan: Saf Beyaz/Siyah */}
      <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
        {/* --- Hero Bölümü --- */}
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
          {/* Gradyanlar: Saf Beyaz/Siyah */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-black dark:via-black/90 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-transparent dark:from-black/70 dark:via-transparent dark:to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent dark:from-black dark:to-transparent backdrop-blur-md" />
        </motion.div>
        {/* --- Ana İçerik Konteyneri --- */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 -mt-40 md:-mt-56 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-14">
            {/* --- Sağ (Sticky) Sütun --- */}
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
              {omdbDetails?.Ratings && omdbDetails.Ratings.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {omdbDetails.Ratings.map((r) => (
                      <RatingBadge
                        key={r.Source}
                        source={r.Source}
                        value={r.Value}
                      />
                    ))}
                  </div>
                </div>
              )}
              {/* Detaylar Kartı: Saf Beyaz/Siyah arka plan */}
              <div className="bg-black/5 dark:bg-white/5 backdrop-blur-xl p-5 rounded-xl border border-black/10 dark:border-white/10 space-y-3 shadow-sm mb-6">
                <h3 className="text-base font-semibold mb-2 text-black dark:text-white opacity-90 uppercase tracking-wider">
                  Details
                </h3>
                {/* DetailItem içindeki renkler zinc yerine black/white opacity ile ayarlandı */}
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
                  className="flex w-full items-center justify-center gap-2 bg-yellow-400/90 hover:bg-yellow-400 dark:bg-yellow-500/90 dark:hover:bg-yellow-500 px-4 py-2.5 rounded-lg transition text-black font-semibold text-sm shadow-md backdrop-blur-sm transform hover:scale-105"
                >
                  <ExternalLink size={16} /> View on IMDb
                </a>
              )}
            </motion.div>

            {/* --- Sol (Kaydırılabilir) Sütun --- */}
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
                {/* Tagline rengi: Opaklık ayarlandı */}
                {details.tagline && (
                  <p className="text-xl text-black/60 dark:text-white/60 mb-5 italic">
                    {details.tagline}
                  </p>
                )}
                {/* Metadata renkleri: Opaklık ayarlandı */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 text-sm text-black/80 dark:text-white/80">
                  {year !== "N/A" && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{year}</span>
                    </div>
                  )}
                  {details.vote_average > 0 && (
                    <>
                      {" "}
                      <span className="opacity-30">•</span>
                      <div className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="text-yellow-500 dark:text-yellow-400"
                        />{" "}
                        <span className="font-medium">
                          {details.vote_average.toFixed(1)}{" "}
                          <span className="text-xs opacity-70">/ 10</span>
                        </span>
                      </div>
                    </>
                  )}
                  {runtime && (
                    <>
                      {" "}
                      <span className="opacity-30">•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>{runtime}</span>
                      </div>
                    </>
                  )}
                  {seasons && (
                    <>
                      {" "}
                      <span className="opacity-30">•</span>
                      <div className="flex items-center gap-1.5">
                        <Tv size={14} />
                        <span>{seasons}</span>
                      </div>
                    </>
                  )}
                  {details.genres?.length > 0 && (
                    <>
                      {" "}
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
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition text-white font-semibold shadow-lg shadow-red-900/30 dark:shadow-red-500/30 transform hover:scale-105"
                    >
                      {" "}
                      <PlayCircle size={20} /> Watch Trailer{" "}
                    </a>
                  )}
                  {watchProviders?.flatrate &&
                    watchProviders.flatrate.length > 0 && (
                      <div className="flex items-center gap-2 pl-4 border-l border-black/20 dark:border-white/20">
                        {" "}
                        <span className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider">
                          Watch on
                        </span>{" "}
                        {watchProviders.flatrate.slice(0, 3).map((p) => (
                          <img
                            key={p.provider_id}
                            src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                            alt={p.provider_name}
                            title={p.provider_name}
                            className="w-8 h-8 object-contain rounded-md bg-white/80 dark:bg-white/10 p-1 shadow-sm transition transform hover:scale-110"
                          />
                        ))}{" "}
                      </div>
                    )}
                </div>
              </motion.div>

              {/* Overview - Animasyon düzeltildi, renkler ayarlandı */}
              <motion.section
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }} // whileInView yerine animate
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              >
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-black dark:text-white border-l-4 border-red-500 pl-4 py-1 bg-gradient-to-r from-red-500/5 to-transparent">
                  <Info size={24} className="opacity-80" /> Overview
                </h2>
                {/* Prose renkleri otomatik ayarlanmalı, gerekirse text-black/80 dark:text-white/80 ekleyin */}
                <div className="prose dark:prose-invert max-w-none leading-relaxed space-y-4">
                  <p>{details.overview || "No overview available."}</p>
                </div>
                {keywords && keywords.length > 0 && (
                  <div className="mt-8">
                    {/* Keywords başlık rengi */}
                    <h4 className="text-sm font-semibold mb-3 text-black/60 dark:text-white/60 uppercase tracking-wider">
                      Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {/* Keyword etiket arka planı ve metin rengi */}
                      {keywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-xs font-medium bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10 transition cursor-default"
                        >
                          {" "}
                          {kw}{" "}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.section>

              {/* YENİDEN TASARLANMIŞ Cast BÖLÜMÜ */}
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
                        {/* Kart arka planı: Saf Beyaz/Siyah opaklık */}
                        <div className="aspect-[2/3] mb-2 overflow-hidden rounded-lg shadow-md bg-black/5 dark:bg-white/5 transition-all duration-300 group-hover:shadow-lg group-hover:brightness-105">
                          <img
                            src={
                              actor.profile_path
                                ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` // Resim kalitesi artırıldı (w185 -> w300)
                                : "/no-profile.png"
                            }
                            alt={actor.name}
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/no-profile.png";
                            }}
                          />
                        </div>
                        <p className="font-semibold text-sm text-black dark:text-white truncate">
                          {" "}
                          {actor.name}{" "}
                        </p>
                        {/* Metin rengi: Opaklık ayarlandı */}
                        <p className="text-black/60 dark:text-white/60 text-xs truncate">
                          {" "}
                          {actor.character}{" "}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Media Section */}
              {(details.images?.backdrops?.length > 0 ||
                details.images?.posters?.length > 0) && (
                <Section title="Media" icon={ImageIcon}>
                  <Carousel
                    items={details.images.backdrops.slice(0, 10)}
                    itemClassName="w-64 md:w-80"
                    renderItem={(img) => (
                      // Kart arka planı: Saf Beyaz/Siyah opaklık
                      <div className="aspect-video overflow-hidden rounded-lg shadow-md bg-black/5 dark:bg-white/5 transition-all duration-300 group/item hover:shadow-lg relative">
                        <img
                          src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                          alt="Backdrop"
                          className="w-full h-full object-cover transition duration-300 group-hover/item:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-lg pointer-events-none" />
                      </div>
                    )}
                  />
                  <Carousel
                    items={details.images.posters.slice(0, 10)}
                    itemClassName="w-32 md:w-40"
                    renderItem={(img) => (
                      // Kart arka planı: Saf Beyaz/Siyah opaklık
                      <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-md bg-black/5 dark:bg-white/5 transition-all duration-300 group/item hover:shadow-lg relative">
                        <img
                          src={`https://image.tmdb.org/t/p/w300${img.file_path}`}
                          alt="Poster"
                          className="w-full h-full object-cover transition duration-300 group-hover/item:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-lg pointer-events-none" />
                      </div>
                    )}
                  />
                </Section>
              )}

              {/* Trailers */}
              {details.videos?.results?.length > 1 && (
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
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105 opacity-70 group-hover:opacity-100"
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

              {/* YENİ: Episode List (from TVmaze) */}
              {media_type === "tv" && episodes.length > 0 && (
                <Section title="Episode List" icon={Tv}>
                  <EpisodeList seasons={groupEpisodesBySeason(episodes)} />
                </Section>
              )}

              {/* Carousels (Geliştirilmiş Stil) */}
              <div className="-mx-6">
                {/* Carousel Kart Arka Planı ve Metin Renkleri */}
                <Carousel
                  title="Similar Content"
                  items={details.similar?.results || []}
                  renderItem={(item) => (
                    <motion.div
                      className="w-36 md:w-44 shrink-0 group/item cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/archive/${item.media_type || media_type}/${item.id}`
                        )
                      }
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="aspect-[2/3] mb-2 overflow-hidden rounded-lg shadow-md bg-black/5 dark:bg-white/5 relative transition-all duration-300 group-hover/item:shadow-lg">
                        <img
                          src={
                            item.poster_path
                              ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                              : "/no-poster.png"
                          }
                          alt={item.title || item.name}
                          className="w-full h-full object-cover transition duration-300 group-hover/item:scale-105"
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
                      {/* Metin rengi: Opaklık ayarlandı */}
                      <p className="text-xs text-black/60 dark:text-white/60">
                        {item.release_date?.substring(0, 4) ||
                          item.first_air_date?.substring(0, 4)}
                      </p>
                    </motion.div>
                  )}
                />
                <Carousel
                  title="Recommendations"
                  items={details.recommendations?.results || []}
                  renderItem={(item) => (
                    <motion.div
                      className="w-36 md:w-44 shrink-0 group/item cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/archive/${item.media_type || media_type}/${item.id}`
                        )
                      }
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="aspect-[2/3] mb-2 overflow-hidden rounded-lg shadow-md bg-black/5 dark:bg-white/5 relative transition-all duration-300 group-hover/item:shadow-lg">
                        <img
                          src={
                            item.poster_path
                              ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                              : "/no-poster.png"
                          }
                          alt={item.title || item.name}
                          className="w-full h-full object-cover transition duration-300 group-hover/item:scale-105"
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
                      {/* Metin rengi: Opaklık ayarlandı */}
                      <p className="text-xs text-black/60 dark:text-white/60">
                        {item.release_date?.substring(0, 4) ||
                          item.first_air_date?.substring(0, 4)}
                      </p>
                    </motion.div>
                  )}
                />
              </div>
            </div>
            {/* Sol Sütun Sonu */}
          </div>{" "}
          {/* Grid Sonu */}
        </div>{" "}
        {/* Container Sonu */}
        {/* Footer */}
        {/* Renkler güncellendi */}
        <footer className="mt-24 py-10 text-center text-black/50 dark:text-white/50 text-xs border-t border-black/10 dark:border-white/10">
          Data provided by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-black dark:text-white hover:underline"
          >
            {" "}
            TMDB{" "}
          </a>
          ,{" "}
          <a
            href="https://www.omdbapi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-black dark:text-white hover:underline"
          >
            {" "}
            OMDB{" "}
          </a>
          and{" "}
          <a
            href="https://www.tvmaze.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-black dark:text-white hover:underline"
          >
            {" "}
            TVmaze{" "}
          </a>
          .
        </footer>
      </div>{" "}
      {/* Ana div sonu */}
    </>
  );
}
