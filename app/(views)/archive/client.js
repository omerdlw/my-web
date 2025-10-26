"use client";

import { useNavigationContext } from "@/contexts/navigation-context";
import { useEffect, useMemo, useState, useCallback } from "react";
import { API_ENDPOINTS, MEDIA_TYPES } from "@/config/constants";
import { useArchiveContext } from "@/contexts/archive-context";
import { DynamicNavUpdater } from "@/components/nav/updater";
import { createNavItem } from "@/hooks/use-nav-item";
import { ARCHIVE } from "@/data/archive";
import Link from "next/link";
import { ArchiveGridSkeleton } from "@/components/shared/skeletons";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

async function fetchMediaDetails(title, endpoint) {
  try {
    const searchUrl = `${API_ENDPOINTS.TMDB_BASE}/search/${endpoint}?api_key=${API_KEY}&query=${encodeURIComponent(title)}`;

    const response = await fetch(searchUrl);

    if (!response.ok) {
      console.error(`Failed to fetch ${title}: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return { ...data.results[0], media_type: endpoint };
    }

    return null;
  } catch (error) {
    console.error(`Error fetching ${title}:`, error);
    return null;
  }
}

function ArchiveItemCard({ item, index }) {
  const title = item.title || item.name;
  const posterUrl = item.poster_path
    ? `${API_ENDPOINTS.TMDB_IMAGE}/w500${item.poster_path}`
    : null;

  if (!posterUrl) {
    return null;
  }

  return (
    <Link
      href={`/archive/${item.media_type}/${item.id}`}
      className="w-full h-[550px] rounded-primary hover:scale-[1.05] hover:shadow-2xl hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 ease-out animate-fade-in-up relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${posterUrl})`,
        animationDelay: `${index * 50}ms`,
        animationFillMode: "backwards",
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
        {title}
      </div>
    </Link>
  );
  s;
}

function EmptyState() {
  return (
    <div className="text-center py-20 animate-fade-in">
      <p className="text-lg text-gray-600 dark:text-gray-400">
        {API_KEY
          ? "No items found in the archive."
          : "TMDB API key is not configured. Please add your API key to view the archive."}
      </p>
    </div>
  );
}

export default function Client() {
  const navItem = useMemo(() => createNavItem("archive"), []);
  const { searchQuery } = useNavigationContext();
  const [loading, setLoading] = useState(true);
  const { mediaType } = useArchiveContext();
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  const filteredItems = useMemo(() => {
    if (!items || items.length === 0) {
      return [];
    }

    if (!searchQuery || searchQuery.trim() === "") {
      return items;
    }

    const query = searchQuery.toLowerCase().trim();

    return items.filter((item) => {
      const title = (item.title || item.name || "").toLowerCase();
      return title.includes(query);
    });
  }, [items, searchQuery]);

  const fetchArchiveData = useCallback(async () => {
    if (!API_KEY) {
      setLoading(false);
      setError("TMDB API key is not configured");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const titles =
        mediaType === MEDIA_TYPES.MOVIE ? ARCHIVE.movies : ARCHIVE.series;
      const endpoint =
        mediaType === MEDIA_TYPES.MOVIE
          ? MEDIA_TYPES.MOVIE
          : MEDIA_TYPES.SERIES;
      const promises = titles.map((title) =>
        fetchMediaDetails(title, endpoint),
      );
      const results = await Promise.all(promises);
      const validItems = results.filter(Boolean);
      setItems(validItems);
    } catch (err) {
      console.error("Error fetching archive data:", err);
      setError(err.message || "Failed to load archive data");
    } finally {
      setLoading(false);
    }
  }, [mediaType]);

  useEffect(() => {
    fetchArchiveData();
  }, [fetchArchiveData]);

  if (loading) {
    return <ArchiveGridSkeleton count={15} />;
  }

  return (
    <>
      <DynamicNavUpdater navItem={navItem} />
      <div className="p-10">
        {error ? (
          <div className="text-center py-20">
            <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
            {filteredItems.map((item, index) => (
              <ArchiveItemCard key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No results found for "{searchQuery}"
            </p>
          </div>
        ) : (
          <EmptyState />
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
