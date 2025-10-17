"use client";

import { useArchiveContext } from "@/contexts/archive-context";
import { DynamicNavUpdater } from "@/components/nav/updater";
import { useEffect, useState } from "react";
import { ARCHIVE } from "@/data/archive";
import Icon from "@/components/icon";
import Link from "next/link";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function ArchivePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { mediaType } = useArchiveContext();

  const navItem = {
    description: "my watched list",
    icon: "solar:archive-bold",
    href: "/archive",
    name: "archive",
  };

  useEffect(() => {
    const fetchArchiveData = async () => {
      if (!API_KEY) {
        setLoading(false);
        return;
      }

      const fetchedItems = [];
      const titles = mediaType === "movie" ? ARCHIVE.movies : ARCHIVE.series;
      const endpoint = mediaType === "movie" ? "movie" : "tv";

      for (const title of titles) {
        const searchRes = await fetch(
          `https://api.themoviedb.org/3/search/${endpoint}?api_key=${API_KEY}&query=${encodeURIComponent(
            title
          )}`
        );

        const searchData = await searchRes.json();
        if (searchData.results && searchData.results.length > 0) {
          fetchedItems.push({ ...searchData.results[0], media_type: endpoint });
        }
      }

      setItems(fetchedItems);
      setLoading(false);
    };

    fetchArchiveData();
  }, [mediaType]);

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
      <DynamicNavUpdater navItem={navItem} />
      <div className="p-10">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
            There is nothing to display in the archive or the TMDB API key is
            incorrect. There is nothing to display in the archive or the TMDB
            API key is incorrect.
          </p>
        )}
      </div>
    </>
  );
}
