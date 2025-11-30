import { Movie, } from "../types/movies";
import { AiRecommendationRequest, AiSummaryRequest, RecommendationResult } from "../types/ai";
import { API_BASE_URL } from "../config/api";


// ASK BACKEND FOR AI RECOMMENDATIONS

export async function fetchAiRecommendations(params: 
  AiRecommendationRequest)
  : Promise<RecommendationResult[]> {

    const res = await fetch(`${API_BASE_URL}/ai/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });

    if (!res.ok) {
        throw new Error("Failed to fetch AI recommendations");
    }

    const data = await res.json();
    return data.recommendations ?? [];
}

// ASK BACKEND FOR SUMMARY

export async function fetchAiSummary(movie: Movie): Promise<string> {

  const payload: AiSummaryRequest = {
      title: movie.title,
      overview: movie.description,
      genres: movie.genres,
      runtime: movie.runtimeMinutes,
      maturityRating: movie.maturityLabel || null,
  };

  const res = await fetch(`${API_BASE_URL}/ai/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch AI summary");
  }

  const data = await res.json();
  return data.summary ?? "";
}