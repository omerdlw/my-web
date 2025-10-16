"use client";

import { useNavigationContext } from "@/contexts/navigation-context";
import { useMemo } from "react";
import Link from "next/link";

export default function BlogList({ posts }) {
  const { searchQuery } = useNavigationContext();

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    if (!searchQuery) {
      return posts;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        post.TITLE.toLowerCase().includes(lowercasedQuery) ||
        post.CONTENT.toLowerCase().includes(lowercasedQuery)
    );
  }, [posts, searchQuery]);

  if (posts && posts.length > 0) {
    return (
      <>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link
              href={`/blog/${post.SLUG}`}
              className="flex items-center justify-between mb-6 bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-2xl transition-all hover:border-black/20 dark:hover:border-white/20"
              key={post._id}
            >
              <article className="font-bold text-lg">{post.TITLE}</article>
              <p className="opacity-75 text-sm">
                {new Date(post.CREATED_AT).toLocaleDateString("en-US")}
              </p>
            </Link>
          ))
        ) : (
          <div className="w-screen h-screen center">
            <p className="text-lg opacity-75">
              No results found for "{searchQuery}"
            </p>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="fixed w-screen h-screen inset-0 center bg-[#1E6EF3]/10 text-[#1E6EF3] text-lg">
      Gönderi verisine ulaşılamadı.
    </div>
  );
}
