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

// Mood -> TMDB genre IDs (simple mapping for now)
const MOOD_TO_GENRE_IDS: Partial<Record<Mood, number[]>> = {
  funny: [35], // Comedy
  scary: [27], // Horror
  romantic: [10749], // Romance
  intense: [28, 53], // Action, Thriller
  chill: [18, 10751], // Drama, Family
  random: [], // no specific genres
};

/* SEARCH MOVIES BY TITLES FROM TMDB (BASIC) -------------------------------------------------- */

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

  const data = await res.json();

  return (data.results ?? []).map(
    (item: any): Movie => ({
      id: String(item.id),
      title: item.title ?? "Untitled",
      description: item.overview ?? "",
      posterPath: item.poster_path ?? null,
      genres: [], // can be enriched if you want
      moods: [],
      recommendedFor: ["solo", "friends", "partner"], // safe default
      year: item.release_date ? Number(item.release_date.slice(0, 4)) : 0,
      runtimeMinutes: 0,
      rating: item.vote_average ? Number(item.vote_average) : 0,
      maturityLabel: undefined,
    })
  );
}

/* WATCH PROVIDERS --------------------------------------------------------- */

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

/* MOVIES BY MOOD ---------------------------------------------------------- */

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

  const movies: Movie[] = data.results.map((item: TmdbMovieResult) => {
    const title = item.title ?? item.name ?? "Untitled";
    const yearString = item.release_date ?? item.first_air_date ?? "2000-01-01";
    const year = parseInt(yearString.slice(0, 4), 10);

    return {
      id: String(item.id),
      title,
      year: isNaN(year) ? 0 : year,
      runtimeMinutes: 0,
      genres: [],
      rating: item.vote_average ?? 0,
      description: item.overview ?? "",
      recommendedFor: ["solo", "friends", "partner"],
      moods: [mood],
      posterPath: item.poster_path ?? null,
    };
  });

  return movies;
}

/* FETCH TRENDING MOVIES -------------------------------------------------- */

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

  const movies: Movie[] = data.results.map((item: TmdbMovieResult) => {
    const title = item.title ?? item.name ?? "Untitled";
    const yearString = item.release_date ?? item.first_air_date ?? "2000-01-01";
    const year = parseInt(yearString.slice(0, 4), 10);

    return {
      id: String(item.id),
      title,
      year: isNaN(year) ? 0 : year,
      runtimeMinutes: 0,
      genres: [],
      rating: item.vote_average ?? 0,
      description: item.overview ?? "",
      recommendedFor: ["solo", "friends", "partner"],
      moods: [], // unknown mood for trending
      posterPath: item.poster_path ?? null,
    };
  });

  return movies;
}

/* SIMILAR MOVIES ---------------------------------------------------------- */

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

  const movies: Movie[] = data.results.map((item: TmdbMovieResult) => {
    const title = item.title ?? item.name ?? "Untitled";
    const yearString = item.release_date ?? item.first_air_date ?? "2000-01-01";
    const year = parseInt(yearString.slice(0, 4), 10);

    return {
      id: String(item.id),
      title,
      year: isNaN(year) ? 0 : year,
      runtimeMinutes: 0,
      genres: [], // we only get genre_ids; skipping names for now
      rating: item.vote_average ?? 0,
      maturityLabel: undefined,
      description: item.overview ?? "",
      recommendedFor: ["solo", "friends", "partner"],
      moods: [], // unknown here
      posterPath: item.poster_path ?? null,
    };
  });

  return movies;
}

/* MOVIE DETAILS ----------------------------------------------------------- */

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
    moods: [], // WE DON'T KNOW WHICH MOOD FOR A SINGLE FETCH
    posterPath: item.poster_path ?? null,
  };
}

/* MOVIE CREDITS ----------------------------------------------------------- */

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

/* MOVIE VIDEOS ----------------------------------------------------------- */

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

/* MOVIE REVIEWS ----------------------------------------------------------- */

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
