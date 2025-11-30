import { Movie } from "../types/movies";

export const MOCK_MOVIES: Movie[] = [
  {
    id: "1",
    title: "Night Shift Detectives",
    year: 2021,
    runtimeMinutes: 112,
    genres: ["Thriller", "Crime"],
    rating: 7.8,
    maturityLabel: "15+",
    description:
      "A rookie detective joins a night shift unit that handles the city's strangest cases.",
    recommendedFor: ["solo", "partner", "friends"],
    moods: ["intense"],
  },
  {
    id: "2",
    title: "Couch Potato Comedy Club",
    year: 2020,
    runtimeMinutes: 98,
    genres: ["Comedy"],
    rating: 7.2,
    maturityLabel: "12+",
    description:
      "Four roommates start a live comedy show from their living room with zero budget.",
    recommendedFor: ["friends", "solo"],
    moods: ["funny", "chill"],
  },
  {
    id: "3",
    title: "Starlight Picnic",
    year: 2019,
    runtimeMinutes: 104,
    genres: ["Romance", "Drama"],
    rating: 7.5,
    maturityLabel: "12+",
    description:
      "Two strangers meet during a city-wide blackout and spend one unforgettable night together.",
    recommendedFor: ["partner"],
    moods: ["romantic", "chill"],
  },
  {
    id: "4",
    title: "Galaxy Guardians: Training Day",
    year: 2022,
    runtimeMinutes: 95,
    genres: ["Adventure", "Family"],
    rating: 7.9,
    maturityLabel: "All ages",
    description:
      "Kids are recruited to a space academy where teamwork decides the fate of the galaxy.",
    recommendedFor: ["family", "kids"],
    moods: ["chill", "funny"],
  },
  {
    id: "5",
    title: "Quiet Waters",
    year: 2018,
    runtimeMinutes: 110,
    genres: ["Horror", "Mystery"],
    rating: 7.1,
    maturityLabel: "16+",
    description:
      "A family retreats to a lakeside cabin, but the water hides more than reflections.",
    recommendedFor: ["solo", "friends"],
    moods: ["scary", "intense"],
  },
];
