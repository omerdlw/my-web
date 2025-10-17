import { calculateReadingTime } from "@/lib/utils";

export function createNavItem(type, data) {
  switch (type) {
    case "skeleton": {
      return {
        description: "please wait",
        name: "loading",
        href: "loading",
        skeleton: true,
        icon: "...",
      };
    }
    case "blogPost": {
      const { post } = data;
      const readingTime = calculateReadingTime(post.CONTENT);
      const formattedDate = new Date(post.CREATED_AT).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          day: "numeric",
          month: "long",
        }
      );
      return {
        description: `${formattedDate} • ${readingTime} min read`,
        icon: post.BANNER_BACKGROUND,
        href: `/blog/${post.SLUG}`,
        name: post.TITLE,
      };
    }
    case "archive": {
      return {
        description: "my watched list",
        icon: "solar:archive-bold",
        href: "/archive",
        name: "archive",
      };
    }
    case "archiveDetail": {
      const { details, media_type, id } = data;
      return {
        name: details.title || details.name,
        href: `/archive/${media_type}/${id}`,
        icon: `https://image.tmdb.org/t/p/w200${details.poster_path}`,
        description: `${new Date(
          details.release_date || details.first_air_date
        ).getFullYear()} • ${details.vote_average.toFixed(1)}/10`,
      };
    }
    default:
      return null;
  }
}
