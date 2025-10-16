import { MEDIA_TYPES } from "./constants";

export const SERIES = [
  {
    id: "prison-break",
    title: "Prison Break",
    year: 2005,
    creators: ["Paul Scheuring"],
    genres: ["Action", "Crime", "Drama"],
    rating: 8.3,
    episodes: 90,
    description:
      "When his brother, Lincoln Burrows, is framed for a crime he didn't commit and sentenced to death, brilliant structural engineer Michael Scofield devises an elaborate plan. He gets himself incarcerated in the same prison to break them both out from the inside, using a masterfully crafted tattoo of the prison's blueprints.",
    poster: `/images/favorites/series/prison-break.jpeg`,
    type: MEDIA_TYPES.SERIES,
  },
  {
    id: "game-of-thrones",
    title: "Game of Thrones",
    year: 2011,
    creators: ["David Benioff", "D. B. Weiss"],
    genres: ["Action", "Adventure", "Drama", "Fantasy"],
    rating: 9.2,
    episodes: 73,
    description:
      "In the mythical continent of Westeros, the great houses—including the Starks, Lannisters, and Targaryens—engage in a ruthless and bloody war for control of the Iron Throne. As political and military conflicts rage, an ancient, supernatural enemy known as the White Walkers awakens in the far north, threatening all of humanity.",
    poster: `/images/favorites/series/game-of-thrones.jpeg`,
    type: MEDIA_TYPES.SERIES,
  },
  {
    id: "better-call-saul",
    title: "Better Call Saul",
    year: 2015,
    creators: ["Vince Gilligan", "Peter Gould"],
    genres: ["Crime", "Drama"],
    rating: 8.9,
    episodes: 63,
    description:
      "A prequel to 'Breaking Bad,' this series charts the tragic transformation of Jimmy McGill, a well-meaning but ethically flexible small-time lawyer, into the morally compromised and flamboyant criminal defense attorney Saul Goodman. The show explores his complex relationships and the choices that define his descent.",
    poster: `/images/favorites/series/better-call-saul.jpeg`,
    type: MEDIA_TYPES.SERIES,
  },
];
