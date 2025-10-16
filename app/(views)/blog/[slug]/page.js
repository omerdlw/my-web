import { getPostBySlug } from "@/lib/db/posts";
import { notFound } from "next/navigation";
import PostView from "./post-view";

export default async function BlogPost({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <PostView post={post} />;
}
