

export interface TmdbMovieResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
  poster_path?: string | null;
}

export interface TmdbResponse {
  results: TmdbMovieResult[];
}

/** TMDB review response types */
export interface TmdbReviewResult {
  id: string;
  author: string;
  content: string;
  created_at: string;
  url: string;
  author_details?: {
    rating?: number | null;
    username?: string;
  };
}

export interface TmdbReviewResponse {
  results: TmdbReviewResult[];
}

export interface TmdbMovieDetails {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  runtime?: number | null;
  release_date?: string;
  vote_average: number;
  adult?: boolean;
  genres?: { id: number; name: string }[];
  poster_path?: string | null;
}
