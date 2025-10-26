import Client from "./client";

export const metadata = {
  title: "New Post",
  description: "Create a new blog post",
};

export default async function Page() {
  return <Client />;
}
