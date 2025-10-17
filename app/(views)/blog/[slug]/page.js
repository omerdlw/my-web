import { getPostBySlug } from "@/lib/db/posts";
import { notFound } from "next/navigation";
import Post_Client from "./client";

export default async function BlogPost({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <Post_Client post={post} />;
}
