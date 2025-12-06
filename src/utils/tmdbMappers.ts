// Maps a TMDB movie result into our Movie model (shared helper)

import type { Movie } from "@/src/types/movies";
import type { TmdbMovieResult } from "@/src/types/tmdb";

export function mapBasicTmdbMovie(item: TmdbMovieResult): Movie {
  // Fallback title if missing
  const title = item.title ?? (item as any).name ?? "Untitled";

  // Extract release year safely
  const yearString =
    item.release_date ?? (item as any).first_air_date ?? "2000-01-01";
  const year = parseInt(yearString.slice(0, 4), 10);

  // Normalize TMDB → our Movie object
  return {
    id: String(item.id),
    title,
    description: item.overview ?? "",
    posterPath: item.poster_path ?? null,
    genres: [], // can be enriched later
    moods: [], // caller can override if needed
    recommendedFor: ["solo", "friends", "partner"], // safe default
    year: isNaN(year) ? 0 : year,
    runtimeMinutes: 0, // not in list/search responses
    rating: item.vote_average ? Number(item.vote_average) : 0,
    maturityLabel: undefined,
  };
}
