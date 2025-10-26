import Client from "./client";

export const metadata = {
  description: "Welcome to my personal space on the web",
  title: "Home",
};

export default async function Page() {
  return <Client />;
}
