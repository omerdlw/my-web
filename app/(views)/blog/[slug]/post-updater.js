"use client";

import { useDatabase } from "@/contexts/database-context";
import { useEffect } from "react";

export function PostDataUpdater({ post }) {
  const { setPost } = useDatabase();

  useEffect(() => {
    setPost(post);

    return () => {
      setPost(null);
    };
  }, [post, setPost]);

  return null;
}
