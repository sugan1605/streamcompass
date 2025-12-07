import { TMDB_CONFIG } from "../config/tmdb";
import {
  Movie,
  Mood,
  ProviderInfo,
  WatchProviders,
  Review,
} from "../types/movies";
import {
  TmdbMovieResult,
  TmdbResponse,
  TmdbReviewResponse,
  TmdbMovieDetails,
} from "../types/tmdb";

// Shared mapper for TMDB → Movie
import { mapBasicTmdbMovie } from "../utils/tmdbMappers";

// Mood -> TMDB genre IDs (simple mapping for now)
const MOOD_TO_GENRE_IDS: Partial<Record<Mood, number[]>> = {
  funny: [35], // Comedy
  scary: [27], // Horror
  romantic: [10749], // Romance
  intense: [28, 53], // Action, Thriller
  chill: [18, 10751], // Drama, Family
  random: [], // no specific genres
};

/* SEARCH MOVIES BY TITLE (BASIC) ---------------------------------------- */

export async function searchMoviesByTitle(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];

  const url = `${TMDB_CONFIG.baseUrl}/search/movie?api_key=${
    TMDB_CONFIG.apiKey
  }&language=en-US&query=${encodeURIComponent(
    query.trim()
  )}&include_adult=false`;

  const res = await fetch(url);

  if (!res.ok) {
    console.log("TMDB search error:", res.status, await res.text());
    throw new Error("Failed to search movies");
  }

  const data: TmdbResponse = await res.json();

  // Use shared mapper for search results
  return (data.results ?? []).map((item: TmdbMovieResult) =>
    mapBasicTmdbMovie(item)
  );
}

/* WATCH PROVIDERS ------------------------------------------------------- */

export async function fetchWatchProviders(
  id: string,
  region: string = "US" // or "NO"
): Promise<WatchProviders> {
  const { apiKey, baseUrl } = TMDB_CONFIG;

  if (!apiKey) {
    console.warn("[TMDB] No API key configured");
    return { stream: [], rent: [], buy: [] };
  }

  const url = `${baseUrl}/movie/${id}/watch/providers?api_key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.warn("[TMDB] Failed to fetch watch providers:", res.status);
    return { stream: [], rent: [], buy: [] };
  }

  const json = await res.json();

  // TMDB structure: json.results[REGION].flatrate / rent / buy
  const country = json.results?.[region] ?? json.results?.["US"] ?? null;

  if (!country) {
    return { stream: [], rent: [], buy: [] };
  }

  const mapProviders = (
    arr?: {
      provider_name: string;
      provider_id: number;
      logo_path: string | null;
    }[]
  ): ProviderInfo[] =>
    Array.isArray(arr)
      ? arr.map((p) => ({
          id: p.provider_id,
          name: p.provider_name,
          logoPath: p.logo_path,
        }))
      : [];

  return {
    stream: mapProviders(country.flatrate),
    rent: mapProviders(country.rent),
    buy: mapProviders(country.buy),
  };
}

/* MOVIES BY MOOD -------------------------------------------------------- */

export async function fetchMoviesForMood(mood: Mood): Promise<Movie[]> {
  const { apiKey, baseUrl } = TMDB_CONFIG;

  if (!apiKey) {
    console.warn("[TMDB] No API key configured");
    return [];
  }

  const genreIds = MOOD_TO_GENRE_IDS[mood];
  const hasGenres = genreIds && genreIds.length > 0;

  const endpoint = hasGenres
    ? `${baseUrl}/discover/movie?sort_by=popularity.desc&with_genres=${genreIds!.join(
        ","
      )}&language=en-US&api_key=${apiKey}`
    : `${baseUrl}/trending/movie/day?language=en-US&api_key=${apiKey}`;

  const res = await fetch(endpoint);
  if (!res.ok) {
    console.warn("[TMDB] Failed to fetch movies:", res.status);
    return [];
  }

  const data: TmdbResponse = await res.json();

  // Use shared mapper + attach mood tag
  const movies: Movie[] = (data.results ?? []).map(
    (item: TmdbMovieResult): Movie => {
      const base = mapBasicTmdbMovie(item);
      return {
        ...base,
        moods: [mood],
      };
    }
  );

  return movies;
}

/* FETCH TRENDING MOVIES ------------------------------------------------- */

export async function fetchTrendingMovies(): Promise<Movie[]> {
  const { apiKey, baseUrl } = TMDB_CONFIG;

  if (!apiKey) {
    console.warn("[TMDB] No API key configured");
    return [];
  }

  const endpoint = `${baseUrl}/trending/movie/day?language=en-US&api_key=${apiKey}`;

  const res = await fetch(endpoint);
  if (!res.ok) {
    console.warn("[TMDB] Failed to fetch trending movies:", res.status);
    return [];
  }

  const data: TmdbResponse = await res.json();

  // Trending list, no mood attached
  const movies: Movie[] = (data.results ?? []).map(
    (item: TmdbMovieResult) => mapBasicTmdbMovie(item)
  );

  return movies;
}

/* SIMILAR MOVIES -------------------------------------------------------- */

export async function fetchSimilarMovies(id: string): Promise<Movie[]> {
  const { apiKey, baseUrl } = TMDB_CONFIG;

  if (!apiKey) {
    console.warn("[TMDB] No API key configured");
    return [];
  }

  const endpoint = `${baseUrl}/movie/${id}/similar?language=en-US&api_key=${apiKey}`;

  const res = await fetch(endpoint);
  if (!res.ok) {
    console.warn("[TMDB] Failed to fetch similar movies:", res.status);
    return [];
  }

  const data: TmdbResponse = await res.json();

  const movies: Movie[] = (data.results ?? []).map(
    (item: TmdbMovieResult) => mapBasicTmdbMovie(item)
  );

  return movies;
}

/* MOVIE DETAILS --------------------------------------------------------- */

export async function fetchMovieById(id: string): Promise<Movie | null> {
  const { apiKey, baseUrl } = TMDB_CONFIG;

  if (!apiKey) {
    console.warn("[TMDB] No API key configured");
    return null;
  }
  const endpoint = `${baseUrl}/movie/${id}?language=en-US&api_key=${apiKey}`;

  const res = await fetch(endpoint);

  if (!res.ok) {
    console.warn("[TMDB] Failed to fetch movie details:", res.status);
    return null;
  }

  const item: TmdbMovieDetails = await res.json();

  const title = item.title ?? item.name ?? "Untitled";
  const yearString = item.release_date ?? "2000-01-01";
  const year = parseInt(yearString.slice(0, 4), 10);

  let maturityLabel: string | undefined;

  if (item.adult === true) {
    maturityLabel = "18+";
  }
  const genres = item.genres?.map((g) => g.name) ?? [];

  return {
    id: String(item.id),
    title,
    year: isNaN(year) ? 0 : year,
    runtimeMinutes: item.runtime ?? 0,
    genres,
    rating: item.vote_average ?? 0,
    maturityLabel,
    description: item.overview ?? "",
    recommendedFor: ["solo", "friends", "partner"],
    moods: [], // we don't know mood for single fetch
    posterPath: item.poster_path ?? null,
  };
}

/* MOVIE CREDITS --------------------------------------------------------- */

export async function fetchMovieCredits(id: string) {
  const { apiKey, baseUrl } = TMDB_CONFIG;

  const url = `${baseUrl}/movie/${id}/credits?api_key=${apiKey}`;

  const res = await fetch(url);

  if (!res.ok) {
    console.warn("[TMDB] Failed to fetch credits.", res.status);
    return { cast: [] };
  }

  const json = await res.json();

  return {
    cast: json.cast ?? [],
  };
}

/* MOVIE VIDEOS ---------------------------------------------------------- */

export async function fetchMovieVideos(id: string) {
  const { apiKey, baseUrl } = TMDB_CONFIG;

  const url = `${baseUrl}/movie/${id}/videos?api_key=${apiKey}&language=en-US`;

  const res = await fetch(url);
  if (!res.ok) {
    console.warn("[TMDB] Failed to fetch videos:", res.status);
    return { results: [] };
  }

  const json = await res.json();
  return { results: json.results ?? [] };
}

/* MOVIE REVIEWS --------------------------------------------------------- */

export async function fetchMovieReviews(id: string): Promise<Review[]> {
  const { apiKey, baseUrl } = TMDB_CONFIG;

  if (!apiKey) {
    console.warn("[TMDB] No API key configured");
    return [];
  }

  const url = `${baseUrl}/movie/${id}/reviews?language=en-US&api_key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.warn("[TMDB] Failed to fetch reviews:", res.status);
    return [];
  }

  const data: TmdbReviewResponse = await res.json();

  return (data.results ?? []).map((r) => ({
    id: r.id,
    author: r.author,
    rating:
      typeof r.author_details?.rating === "number"
        ? r.author_details.rating
        : r.author_details?.rating
        ? Number(r.author_details.rating)
        : null,
    content: r.content,
    createdAt: r.created_at,
    url: r.url,
  }));
}
