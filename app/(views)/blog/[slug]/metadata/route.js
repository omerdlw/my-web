import { getPostBySlug as dbGetPostBySlug } from "@/lib/db/posts";
import { calculateReadingTime } from "@/lib/utils";
import { notFound } from "next/navigation";

export async function getProcessedPostData(slug) {
  const post = await dbGetPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.CONTENT);
  const formattedDate = new Date(post.CREATED_AT).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    ...post,
    readingTime,
    formattedDate,
  };
}
