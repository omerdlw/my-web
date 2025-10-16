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
    name: "archive",
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
      <div className="p-10">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Link
                href={`/archive/${item.media_type}/${item.id}`}
                className="p-1 rounded-[30px] w-full h-auto border border-black/10 dark:border-white/10 hover:scale-[1.02] transition-transform duration-200 ease-in-out"
                key={item.id}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  className="w-full h-full object-cover rounded-[24px]"
                  alt={item.title || item.name}
                />
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
