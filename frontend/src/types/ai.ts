import { Movie } from "./movies";

export interface RecommendationResult {
  id: string;          // matcher Movie.id (string)
  reason: string;
}

export interface AiRecommendationRequest {
  history: Movie[];
  favorites: any[];     // midlertidig: FavoriteMovie[] senere
  candidates: Movie[];
  maturityFilter: string | null;
  genreFilter: string | null;
}

export interface AiSummaryRequest {
  title: string;
  overview: string;
  genres: string[];
  runtime: number;
  maturityRating?: string | null;
}
