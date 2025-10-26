import { getPostBySlug } from "@/lib/db/posts";
import { notFound } from "next/navigation";
import Client from "./client";

export default async function Page({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <Client post={post} />;
}
