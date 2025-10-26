import Client from "./client";

export const metadata = {
  description: "Browse movies and TV series",
  title: "Archive",
};

export default async function Page() {
  return <Client />;
}
