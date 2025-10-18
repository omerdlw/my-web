"use client";

import { DynamicNavUpdater } from "@/components/nav/updater";
import { createNavItem } from "@/hooks/use-nav-item";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Icon from "@/components/icon";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

const RatingBadge = ({ source, value }) => {
  let logoSrc = "";
  if (source.includes("IMDb")) logoSrc = "/imdb.png";
  if (source.includes("Rotten Tomatoes")) logoSrc = "/rotten-tomatoes.png";
  if (source.includes("Metacritic")) logoSrc = "/metacritic.png";

  return (
    <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg">
      <img
        src={`https://logo.clearbit.com/${source
          .toLowerCase()
          .replace(/\s/g, "")}.com`}
        alt={source}
        className="w-6 h-6 object-contain"
        onError={(e) => (e.target.style.display = "none")}
      />
      <span className="font-semibold ">{value}</span>
    </div>
  );
};

const Carousel = ({ title, items, renderItem }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 ">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {items.map((item) => renderItem(item))}
      </div>
    </div>
  );
};

export default function ArchiveDetailPage() {
  const [details, setDetails] = useState(null);
  const [omdbDetails, setOmdbDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { media_type, id } = params;

  useEffect(() => {
    if (!media_type || !id || !TMDB_API_KEY || !OMDB_API_KEY) {
      setLoading(false);
      return;
    }

    const fetchAllDetails = async () => {
      try {
        const tmdbRes = await fetch(
          `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,images,recommendations,similar,watch/providers,external_ids`
        );
        const tmdbData = await tmdbRes.json();
        setDetails(tmdbData);

        if (tmdbData.external_ids?.imdb_id) {
          const omdbRes = await fetch(
            `https://www.omdbapi.com/?i=${tmdbData.external_ids.imdb_id}&apikey=${OMDB_API_KEY}`
          );
          const omdbData = await omdbRes.json();
          setOmdbDetails(omdbData);
        }
      } catch (error) {
        console.error("Failed to fetch details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [media_type, id]);

  const navItem = details
    ? createNavItem("archiveDetail", { details, media_type, id })
    : null;

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center p-4 bg-white dark:bg-black">
        <div className="animate-spin">
          <Icon spin icon="mingcute:loading-3-fill" size={40} color="white" />
        </div>
      </div>
    );
  }

  if (!details || details.success === false) {
    return (
      <div className="h-screen w-screen flex items-center justify-center  bg-white dark:bg-black">
        Detaylar bulunamadı. API anahtarlarınızı kontrol edin.
      </div>
    );
  }

  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
  const trailer = details.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const watchProviders = details["watch/providers"]?.results?.TR;

  return (
    <>
      {navItem && <DynamicNavUpdater navItem={navItem} />}
      <div className="bg-black text-white min-h-screen">
        {/* Hero Section */}
        <div
          className="relative h-[70vh] bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute bottom-10 left-10 flex gap-10 max-w-6xl">
            <img
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
              alt={title}
              className="w-64 rounded-2xl shadow-2xl"
            />
            <div>
              <h1 className="text-5xl font-bold mb-2">
                {title} <span className="text-gray-400">({year})</span>
              </h1>
              <p className="text-gray-300 mb-4 italic">{details.tagline}</p>
              <div className="flex items-center gap-4 mb-4">
                {details.vote_average && (
                  <div className="bg-white/10 px-3 py-1 rounded-lg">
                    ⭐ {details.vote_average.toFixed(1)} / 10
                  </div>
                )}
                {watchProviders?.flatrate && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-300">İzle:</span>
                    {watchProviders.flatrate.map((p) => (
                      <img
                        key={p.provider_id}
                        src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                        alt={p.provider_name}
                        className="w-8 h-8 object-contain"
                      />
                    ))}
                  </div>
                )}
              </div>
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg transition"
                >
                  Fragmanı İzle
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="max-w-5xl mx-auto mt-20 px-6">
          <h2 className="text-3xl font-semibold mb-4">Özet</h2>
          <p className="text-gray-300 mb-6">{details.overview || "Açıklama bulunamadı."}</p>

          {omdbDetails?.Ratings && omdbDetails.Ratings.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-12">
              {omdbDetails.Ratings.map((r) => (
                <RatingBadge key={r.Source} source={r.Source} value={r.Value} />
              ))}
            </div>
          )}
        </div>

        {/* Cast Section */}
        {details.credits?.cast?.length > 0 && (
          <section className="max-w-6xl mx-auto mt-16 px-6 border-t border-white/10 pt-10">
            <h2 className="text-3xl font-semibold mb-6">Oyuncular</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
              {details.credits.cast.slice(0, 12).map((actor) => (
                <div key={actor.id} className="text-center">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                        : "/no-profile.png"
                    }
                    alt={actor.name}
                    className="rounded-xl w-full h-48 object-cover mb-2"
                  />
                  <p className="font-semibold text-sm">{actor.name}</p>
                  <p className="text-gray-400 text-xs">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trailers Section */}
        {details.videos?.results?.length > 0 && (
          <section className="max-w-6xl mx-auto mt-16 px-6 border-t border-white/10 pt-10">
            <h2 className="text-3xl font-semibold mb-6">Fragmanlar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {details.videos.results
                .filter((v) => v.site === "YouTube")
                .map((video) => (
                  <a
                    key={video.id}
                    href={`https://www.youtube.com/watch?v=${video.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="relative">
                      <img
                        src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                        alt={video.name}
                        className="rounded-xl w-full object-cover transition group-hover:opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-white text-3xl opacity-0 group-hover:opacity-100 transition">
                        ▶
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-300 truncate">{video.name}</p>
                  </a>
                ))}
            </div>
          </section>
        )}

        {/* Carousels */}
        <div className="max-w-6xl mx-auto px-6">
          <Carousel
            title="Benzer İçerikler"
            items={details.similar?.results || []}
            renderItem={(item) => (
              <div key={item.id} className="min-w-[160px]">
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={item.title || item.name}
                  className="rounded-xl mb-2"
                />
                <p className="text-sm">{item.title || item.name}</p>
              </div>
            )}
          />
          <Carousel
            title="Önerilenler"
            items={details.recommendations?.results || []}
            renderItem={(item) => (
              <div key={item.id} className="min-w-[160px]">
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={item.title || item.name}
                  className="rounded-xl mb-2"
                />
                <p className="text-sm">{item.title || item.name}</p>
              </div>
            )}
          />
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 text-center text-gray-500 text-sm border-t border-white/10">
          Veriler <span className="font-semibold text-white">TMDB</span> ve{" "}
          <span className="font-semibold text-white">OMDB</span> API’lerinden alınmıştır.
        </footer>
      </div>
    </>
  );
}
