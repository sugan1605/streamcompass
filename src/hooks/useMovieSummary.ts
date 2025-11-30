import { useState } from "react";
import { Movie } from "../types/movies";
import { fetchAiSummary } from "../services/aiApi";




// DENNE HOOKEN HÅNDTERER LOADING, ERROR, STATE OG EKSPONERER getSummary() du kan knytte til knappen
export function useMovieSummary(movie: Movie | null) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getSummary() {
    if (!movie) return;

    try {
      setLoading(true);
      setError(null);
      const result = await fetchAiSummary(movie);
      setSummary(result);
    } catch (e) {
      console.log("AI summary error", e);
      setError("Kunne ikke hente AI-oppsummering");
    } finally {
      setLoading(false);
    }
  }

  return {
    summary,
    loading,
    error,
    getSummary,
  };
}
