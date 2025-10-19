"use client";

import { useArchiveContext } from "@/contexts/archive-context";
import { DynamicNavUpdater } from "@/components/nav/updater";
import { createNavItem } from "@/hooks/use-nav-item";
import { useEffect, useMemo, useState } from "react";
import { ARCHIVE } from "@/data/archive";
import Icon from "@/components/icon";
import Link from "next/link";
import { useNavigationContext } from "@/contexts/navigation-context";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function ArchivePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { mediaType } = useArchiveContext();
  const navItem = useMemo(() => createNavItem("archive"), []);
  const { searchQuery } = useNavigationContext();

  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (!searchQuery) {
      return items;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return items.filter((item) =>
      item.title.toLowerCase().includes(lowercasedQuery)
    );
  }, [items, searchQuery]);

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
            {filteredItems.map((item, index) => (
              <Link
                href={`/archive/${item.media_type}/${item.id}`}
                className="group p-1 rounded-[30px] w-full h-auto border border-black/10 dark:border-white/10 hover:scale-[1.05] hover:shadow-2xl hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 ease-out animate-fade-in-up"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "backwards",
                }}
                key={item.id}
              >
                <div className="relative overflow-hidden rounded-[24px]">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    className="w-full h-full object-cover rounded-[24px] group-hover:scale-110 transition-transform duration-500 ease-out"
                    alt={item.title || item.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[24px]" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {item.title || item.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              There is nothing to display in the archive or the TMDB API key is
              incorrect.
            </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </>
  );
}
