import { MEDIA_TYPES } from "./constants";

export const MOVIES = [
  {
    id: "interstellar",
    title: "Interstellar",
    year: 2014,
    directors: ["Christopher Nolan"],
    genres: ["Sci-Fi", "Adventure", "Drama"],
    rating: 8.6,
    description:
      "In a future where a devastating blight threatens humanity's survival, a former NASA pilot must leave his family behind to lead a team of astronauts through a wormhole in search of a new habitable planet.",
    link: "https://www.imdb.com/title/tt0816692/",
    poster: `/images/favorites/movies/interstellar.jpeg`,
    type: MEDIA_TYPES.MOVIE,
  },
  {
    id: "goodfellas",
    title: "Goodfellas",
    year: 1990,
    directors: ["Martin Scorsese"],
    genres: ["Crime", "Drama", "Biography"],
    rating: 8.7,
    description:
      "Based on a true story, the film chronicles the rise and fall of mob associate Henry Hill, detailing his glamorous yet violent life in the New York mafia and his relationships with fellow gangsters Jimmy Conway and Tommy DeVito.",
    link: "https://www.imdb.com/title/tt0099685/",
    poster: `/images/favorites/movies/goodfellas.jpeg`,
    type: MEDIA_TYPES.MOVIE,
  },
  {
    id: "schindlers-list",
    title: "Schindler's List",
    year: 1993,
    directors: ["Steven Spielberg"],
    genres: ["Biography", "Drama", "History"],
    rating: 9.0,
    description:
      "Set in Nazi Germany during World War II, this film tells the true story of Oskar Schindler, a pragmatic industrialist and Nazi Party member who transforms from a war profiteer into a humanitarian who risks everything to save his Jewish workforce from persecution.",
    link: "https://www.imdb.com/title/tt0108052/",
    poster: `/images/favorites/movies/schindlers-list.jpeg`,
    type: MEDIA_TYPES.MOVIE,
  },
];
