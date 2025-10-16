"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Icon from "@/components/icon";
import { DynamicNavUpdater } from "../../nav-updater"; // Nav updater'ı import ediyoruz

// TMDB API anahtarınızı buraya ekleyin
const TMDB_API_KEY =
  process.env.NEXT_PUBLIC_TMDB_API_KEY || "TMDB_API_ANAHTARINIZI_BURAYA_YAZIN";

export default function ArchiveDetailPage() {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { media_type, id } = params;

  useEffect(() => {
    if (!media_type || !id) return;

    if (
      !TMDB_API_KEY ||
      TMDB_API_KEY === "TMDB_API_ANAHTARINIZI_BURAYA_YAZIN"
    ) {
      console.error("TMDB API anahtarı eksik!");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,images`
      );
      const data = await res.json();
      setDetails(data);
      setLoading(false);
    };

    fetchDetails();
  }, [media_type, id]);

  // Nav kartı için veriyi hazırlayalım
  const navItem = details
    ? {
        name: details.title || details.name,
        href: `/archive/${media_type}/${id}`,
        icon: `https://image.tmdb.org/t/p/w200${details.poster_path}`,
        description: `${new Date(
          details.release_date || details.first_air_date
        ).getFullYear()} • ${details.vote_average.toFixed(1)}/10`,
      }
    : null;

  if (loading) {
    return (
      <div className="h-screen w-screen center p-4">
        <div className="animate-spin">
          <Icon spin icon="mingcute:loading-3-fill" size={40} />
        </div>
      </div>
    );
  }

  if (!details) {
    return <div>Detaylar bulunamadı veya TMDB API anahtarı hatalı.</div>;
  }
  return (
    <>
      {/* DynamicNavUpdater'ı burada çağırıyoruz */}
      {navItem && <DynamicNavUpdater navItem={navItem} />}
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <img
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
              alt={details.title || details.name}
              className="w-full h-auto rounded-2xl"
            />
          </div>
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4">
              {details.title || details.name}
            </h1>
            <p className="text-lg opacity-80 mb-6">{details.overview}</p>
            <div className="flex flex-wrap gap-4 text-sm mb-6">
              <span className="font-semibold">
                Yayın Tarihi: {details.release_date || details.first_air_date}
              </span>
              <span>
                Puan: {details.vote_average.toFixed(1)}/10 ({details.vote_count}{" "}
                oy)
              </span>
              <span>
                {media_type === "movie"
                  ? `Süre: ${details.runtime} dakika`
                  : `Sezon Sayısı: ${details.number_of_seasons}`}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">Oyuncular</h2>
              <div className="flex flex-wrap gap-4">
                {details.credits.cast.slice(0, 10).map((cast) => (
                  <div key={cast.cast_id} className="text-center">
                    <img
                      src={
                        cast.profile_path
                          ? `https://image.tmdb.org/t/p/w185${cast.profile_path}`
                          : "https://via.placeholder.com/185x278?text=No+Image"
                      }
                      alt={cast.name}
                      className="w-24 h-24 object-cover rounded-full mx-auto"
                    />
                    <p className="text-sm mt-2">{cast.name}</p>
                    <p className="text-xs opacity-70">{cast.character}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="h-[160px]"></div> {/* Alt boşluk için */}
      </div>
    </>
  );
}
