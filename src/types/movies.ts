export type WatchContext = "solo" | "partner" | "friends" | "family" | "kids";

export type Mood =
  | "chill"
  | "funny"
  | "intense"
  | "romantic"
  | "scary"
  | "random";

export interface Movie {
  id: string;
  title: string;
  year: number;
  runtimeMinutes: number;
  genres: string[];
  rating: number; // 0–10
  maturityLabel?: string; // e.g. "PG-13", "15+", "All ages"
  description: string;
  recommendedFor: WatchContext[];
  moods: Mood[];

  posterPath?: string | null;
}

export interface WatchProviderItem {
  id: number;
  name: string;
  logoPath: string | null;
}

export type ProviderInfo = {
  id: number;
  name: string;
  logoPath?: string | null;
};

export interface WatchProviders {
  stream: ProviderInfo[];
  rent: ProviderInfo[];
  buy: ProviderInfo[];
}

export interface Review {
  id: string;
  author: string;
  rating: number | null;
  content: string;
  createdAt: string;
  url?: string;
}

export interface ReviewItemProps {
  author: string;
  rating: number | null;
  content: string;
  createdAt: string;
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  known_for_department?: string;
  popularity?: number;
  birthday?: string | null;
  place_of_birth?: string | null;
}
