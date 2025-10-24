import BlogList from "@/components/blog/list";
import { getAllPosts } from "@/lib/db/posts";
import { Error } from "@/components/shared";

export const metadata = {
  title: "Blog",
  description: "Read my latest blog posts",
};

export default async function BlogPage() {
  try {
    const posts = await getAllPosts();

    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <BlogList posts={posts} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);

    return (
      <Error
        title="Failed to Load Posts"
        message="We couldn't load the blog posts. Please try again later."
        fullScreen
        showRetry
        showGoBack
      />
    );
  }
}
