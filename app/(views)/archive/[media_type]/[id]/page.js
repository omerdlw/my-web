import Client from "./client";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

export default async function Page({ params }) {
  const resolvedParams = await params;
  const { media_type, id } = resolvedParams;

  if (!media_type || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="">Invalid parameters</p>
      </div>
    );
  }

  if (!TMDB_API_KEY || !OMDB_API_KEY) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="">API keys not configured</p>
      </div>
    );
  }

  return <Client media_type={media_type} id={id} />;
}
