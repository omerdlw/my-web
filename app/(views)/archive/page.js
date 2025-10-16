"use client";

import { ARCHIVE } from "@/data/archive";
import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/icon";
import { DynamicNavUpdater } from "./nav-updater";

const TMDB_API_KEY =
  process.env.NEXT_PUBLIC_TMDB_API_KEY || "TMDB_API_ANAHTARINIZI_BURAYA_YAZIN";

export default function ArchivePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navItem = {
    description: "my watched list",
    icon: "solar:archive-bold",
    href: "/archive",
    name: "Archive",
  };

  useEffect(() => {
    const fetchArchiveData = async () => {
      if (
        !TMDB_API_KEY ||
        TMDB_API_KEY === "TMDB_API_ANAHTARINIZI_BURAYA_YAZIN"
      ) {
        console.error("TMDB API anahtarı eksik!");
        setLoading(false);
        return;
      }

      const fetchedItems = [];

      for (const movieTitle of ARCHIVE.movies) {
        const searchRes = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
            movieTitle
          )}`
        );
        const searchData = await searchRes.json();
        if (searchData.results && searchData.results.length > 0) {
          fetchedItems.push({ ...searchData.results[0], media_type: "movie" });
        }
      }

      for (const seriesTitle of ARCHIVE.series) {
        const searchRes = await fetch(
          `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
            seriesTitle
          )}`
        );
        const searchData = await searchRes.json();
        if (searchData.results && searchData.results.length > 0) {
          fetchedItems.push({ ...searchData.results[0], media_type: "tv" });
        }
      }

      setItems(fetchedItems);
      setLoading(false);
    };

    fetchArchiveData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen center p-4">
        <div className="animate-spin">
          <Icon spin icon="mingcute:loading-3-fill" size={40} />
        </div>
      </div>
    );
  }

  return (
    <>
      <DynamicNavUpdater navItem={navItem} /> {/* Eklendi */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Arşiv</h1>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                href={`/archive/${item.media_type}/${item.id}`}
                key={item.id}
                className="bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden transition-all hover:border-black/20 dark:hover:border-white/20"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-full h-auto object-cover"
                />
                <div className="p-4">
                  <h2 className="font-bold text-lg">
                    {item.title || item.name}
                  </h2>
                  <p className="text-sm opacity-75 line-clamp-3">
                    {item.overview}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>
            Arşivde gösterilecek bir şey bulunamadı veya TMDB API anahtarı
            hatalı.
          </p>
        )}
      </div>
    </>
  );
}
