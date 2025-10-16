import BlogList from "@/components/blog/list";
import { getAllPosts } from "@/lib/db/posts";

export default async function BlogPage() {
  try {
    const posts = await getAllPosts();

    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <BlogList posts={posts} />
      </div>
    );
  } catch (error) {
    console.error("Blog gönderileri hatası:", error);
    return (
      <div className="fixed w-screen h-screen inset-0 center bg-[#E9152D]/10 text-[#E9152D] text-lg">
        An error occurred while fetching blog posts
      </div>
    );
  }
}
