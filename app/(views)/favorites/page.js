import Client from "./client";

export const metadata = {
  title: "Favorites",
  description: "My favorite movies, series, and games",
};

export default async function Page() {
  return <Client />;
}
