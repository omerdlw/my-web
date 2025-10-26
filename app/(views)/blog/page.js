import { getAllPosts } from "@/lib/db/posts";
import { Error } from "@/components/shared";
import Client from "./client";

export const metadata = {
  description: "Read my latest blog posts",
  title: "Blog",
};

export default async function Page() {
  try {
    const posts = await getAllPosts();
    return <Client posts={posts} />;
  } catch (error) {
    return (
      <Error
        message="We couldn't load the blog posts. Please try again later"
        title="Failed to Load Posts"
        fullScreen
        showRetry
        showGoBack
      />
    );
  }
}
