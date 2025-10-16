import { MEDIA_TYPES } from "./constants";

export const GAMES = [
  {
    id: "call-of-duty",
    title: "Call of Duty",
    type: MEDIA_TYPES.GAME_SERIES,
    developer: "Infinity Ward, Treyarch, Sledgehammer Games",
    publisher: "Activision",
    poster: `/images/favorites/games/call-of-duty.jpeg`,
    description:
      "An iconic first-person shooter franchise that has defined the genre for generations. Starting with historical battles in World War II, the series evolved to depict gritty modern warfare, black-ops missions in the Cold War, and high-tech futuristic combat.",
    games: [
      {
        id: "cod-mw-4",
        title: "Call of Duty 4: Modern Warfare",
        year: 2007,
        poster: "/images/favorites/games/cod-mw-4.jpeg",
        genres: ["Action", "Shooter"],
        description:
          "A landmark title that revolutionized the FPS genre with its fast-paced multiplayer and cinematic campaign. Players join Captain Price and 'Soap' MacTavish in a gripping story of modern global conflict.",
        rating: 9.0,
        platforms: ["PC", "PS3", "Xbox 360", "PS4", "Xbox One"],
        type: MEDIA_TYPES.GAME,
      },
      {
        id: "cod-mw-2",
        title: "Call of Duty: Modern Warfare 2",
        year: 2009,
        poster: "/images/favorites/games/cod-mw-2.jpeg",
        genres: ["Action", "Shooter"],
        description:
          "The highly anticipated sequel that escalates the global conflict with a more ambitious campaign, featuring the controversial 'No Russian' mission and an expanded Spec Ops co-op mode.",
        rating: 9.0,
        platforms: ["PC", "PS3", "Xbox 360", "PS4", "Xbox One"],
        type: MEDIA_TYPES.GAME,
      },
      {
        id: "cod-mw-3",
        title: "Call of Duty: Modern Warfare 3",
        year: 2011,
        genres: ["Action", "Shooter"],
        poster: "/images/favorites/games/cod-mw-3.jpeg",
        description:
          "The epic conclusion to the original Modern Warfare trilogy, thrusting players into a full-scale World War III as they fight to end the conflict that has consumed the globe.",
        rating: 8.4,
        platforms: ["PC", "PS3", "Xbox 360", "Wii"],
        type: MEDIA_TYPES.GAME,
      },
    ],
  },
  {
    id: "the-last-of-us",
    title: "The Last of Us",
    type: MEDIA_TYPES.GAME_SERIES,
    developer: "Naughty Dog",
    publisher: "Sony Interactive Entertainment",
    poster: `/images/favorites/games/the-last-of-us.jpeg`,
    description:
      "A critically acclaimed action-adventure series set in a post-apocalyptic world ravaged by a fungal pandemic. Renowned for its deep narrative, complex characters, and the powerful emotional bond between smuggler Joel and a teenage girl, Ellie.",
    games: [
      {
        id: "the-last-of-us-1",
        title: "The Last of Us Part I",
        year: 2013,
        genres: ["Action", "Adventure", "Horror"],
        description:
          "An emotional and harrowing journey across a desolate America, where Joel must protect Ellie, who may hold the key to a cure. A story of survival, loss, and the lengths one will go to for family.",
        rating: 9.7,
        poster: "/images/favorites/games/tlou-1.jpeg",
        platforms: ["PS3", "PS4", "PS5", "PC"],
        type: MEDIA_TYPES.GAME,
      },
      {
        id: "the-last-of-us-2",
        title: "The Last of Us Part II",
        year: 2020,
        genres: ["Action", "Adventure", "Horror"],
        poster: "/images/favorites/games/tlou-2.jpeg",
        description:
          "A brutal and polarizing sequel that explores the devastating cycle of violence. Years after the first game, a tragic event sends Ellie on a relentless quest for revenge through a world filled with moral ambiguity.",
        rating: 9.3,
        platforms: ["PS4", "PS5"],
        type: MEDIA_TYPES.GAME,
      },
    ],
  },
  {
    id: "alan-wake-2",
    title: "Alan Wake 2",
    type: MEDIA_TYPES.GAME,
    developer: "Remedy Entertainment",
    publisher: "Epic Games Publishing",
    year: 2023,
    genres: ["Survival Horror", "Adventure"],
    poster: `/images/favorites/games/alan-wake-2.jpeg`,
    description:
      "A stunning survival horror sequel that follows two protagonists in parallel realities. FBI agent Saga Anderson investigates ritualistic murders in the Pacific Northwest, while novelist Alan Wake fights to escape the nightmarish 'Dark Place' by rewriting his reality.",
    rating: 8.9,
    platforms: ["PC", "PS5", "Xbox Series X/S"],
  },
];
