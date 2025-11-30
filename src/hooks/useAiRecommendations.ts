import { useEffect, useState, useCallback } from "react";
import { Movie } from "../types/movies";
import { fetchAiRecommendations } from "../services/aiApi";
import { getFavorites } from "../services/favoritesService";
import { fetchTrendingMovies } from "../services/tmdb";
import { useAuth } from "../context/AuthContext";

export function useAiRecommendations() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const load = useCallback(async () => {
    if (!user) {
      // Ikke logget inn → ingen backend-AI (eventuelt fallback senere)
      setMovies([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const favorites = await getFavorites(user.uid);
      const candidates = await fetchTrendingMovies();

      const aiResult = await fetchAiRecommendations({
        history: [],           // TODO: watch history senere
        favorites,
        candidates,
        maturityFilter: null,  // TODO: kobles til "safe mode"
        genreFilter: null,
      });

      const mapped = candidates.filter((m) =>
        aiResult.some((a) => a.id === m.id)
      );

      setMovies(mapped);
    } catch (e) {
      console.log("AI recommendations error", e);
      setError("Kunne ikke hente AI-anbefalinger");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    movies,
    loading,
    error,
    reload: load,
  };
}
