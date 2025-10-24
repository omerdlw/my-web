"use client";

import { useNavigationContext } from "@/contexts/navigation-context";
import { useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BlogList({ posts }) {
  const { searchQuery } = useNavigationContext();

  const filteredPosts = useMemo(() => {
    if (!posts || posts.length === 0) {
      return [];
    }
    if (!searchQuery) {
      return posts;
    }
    const lowercasedQuery = searchQuery.toLowerCase().trim();
    if (!lowercasedQuery) {
      return posts;
    }
    return posts.filter(
      (post) =>
        post.TITLE?.toLowerCase().includes(lowercasedQuery) ||
        post.CONTENT?.toLowerCase().includes(lowercasedQuery),
    );
  }, [posts, searchQuery]);

  if (!posts || posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-lg opacity-75">Henüz yayınlanmış bir gönderi yok.</p>
      </div>
    );
  }

  if (filteredPosts.length === 0 && searchQuery) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-lg opacity-75 text-center">
          "{searchQuery}" için sonuç bulunamadı.
        </p>
      </div>
    );
  }

  return (
    <>
      {filteredPosts.map((post) => (
        <Link
          href={`/blog/${post.SLUG}`}
          className={cn(
            "flex items-center justify-between mb-6 p-6 rounded-2xl transition-all",
            "bg-white/5 dark:bg-black/20", // Arka plan rengi ayarlandı
            "border border-black/10 dark:border-white/10",
            "hover:border-black/20 dark:hover:border-white/20 hover:bg-white/10 dark:hover:bg-black/30", // Hover efekti
          )}
          key={post._id || post.SLUG}
        >
          <article className="font-semibold text-lg">{post.TITLE}</article>
          <p className="opacity-75 text-sm whitespace-nowrap pl-4">
            {post.CREATED_AT
              ? new Date(post.CREATED_AT).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : ""}
          </p>
        </Link>
      ))}
    </>
  );
}
