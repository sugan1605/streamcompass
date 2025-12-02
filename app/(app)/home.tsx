import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useMemo } from "react";
import { router } from "expo-router";

import { useAuth } from "@/src/context/AuthContext";
import { fetchMoviesForMood } from "@/src/services/tmdb";
import { WatchContext, Mood, Movie } from "@/src/types/movies";
import { MOCK_MOVIES } from "@/src/data/mockMovies";
import { WatchContextSelector } from "@/src/components/WatchContextSelector";
import { MoodSelector } from "@/src/components/MoodSelector";
import { MovieCard } from "@/src/components/MovieCard";
import { useAiRecommendations } from "@/src/hooks/useAiRecommendations";
import { SwipeableRow } from "@/src/components/ui/SwipeableRow";
import { UIDialog } from "@/src/components/ui/UIDialog";

import { TMDB_CONFIG } from "@/src/config/tmdb";
import { auth } from "@/src/firebaseConfig";
import {
  addFavorite,
  removeFavorite,
  FavoriteMovie,
} from "@/src/services/favoritesService";

const ACCENT = "#f97316";

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const [watchContext, setWatchContext] = useState<WatchContext>("solo");
  const [mood, setMood] = useState<Mood>("chill");
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Undo dialog state
  const [undoMovie, setUndoMovie] = useState<Movie | null>(null);
  const [undoVisible, setUndoVisible] = useState(false);

  // Local “just added on this screen” ids → controls filled icon
  const [locallyAddedIds, setLocallyAddedIds] = useState<string[]>([]);

  // AI-powered recommendations from the custom hook
  const {
    movies: aiMovies,
    loading: aiLoading,
    error: aiError,
    reload: reloadAi,
  } = useAiRecommendations();

  // Local fallback recommendations derived from mock data
  const recommendations: Movie[] = useMemo(() => {
    const filtered = MOCK_MOVIES.filter((movie) => {
      const matchesContext = movie.recommendedFor.includes(watchContext);
      const matchesMood = mood === "random" ? true : movie.moods.includes(mood);
      return matchesContext && matchesMood;
    });

    if (filtered.length > 0) return filtered;

    return MOCK_MOVIES.filter((movie) =>
      movie.recommendedFor.includes(watchContext)
    );
  }, [watchContext, mood]);

  const handleLogout = async () => {
    await logout();
    router.replace("/signin");
  };

  // Swipe action → add movie to watchlist + show undo dialog
  const handleAddToWatchlist = async (movie: Movie) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert(
        "Sign in required",
        "You need to be signed in to add movies to your watchlist.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Go to sign in",
            onPress: () => router.replace("/signin"),
          },
        ]
      );
      return;
    }

    const payload: FavoriteMovie = {
      movieId: movie.id,
      title: movie.title,
      posterUrl: movie.posterPath
        ? `${TMDB_CONFIG.imageBaseUrl}${movie.posterPath}`
        : null,
      overview: movie.description,
    };

    try {
      await addFavorite(currentUser.uid, payload);

      // mark as added for filled icon
      setLocallyAddedIds((prev) =>
        prev.includes(movie.id) ? prev : [...prev, movie.id]
      );

      // show undo dialog
      setUndoMovie(movie);
      setUndoVisible(true);
    } catch (err) {
      console.log("Error adding favorite from home:", err);
      Alert.alert(
        "Error",
        "Could not add this movie to your watchlist. Please try again."
      );
    }
  };

  const handleUndoAdd = async () => {
    if (!undoMovie) return;
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setUndoVisible(false);
      setUndoMovie(null);
      return;
    }

    try {
      await removeFavorite(currentUser.uid, undoMovie.id);
      // unmark for icon
      setLocallyAddedIds((prev) =>
        prev.filter((id) => id !== undoMovie.id)
      );
    } catch (err) {
      console.log("Error undoing favorite:", err);
    } finally {
      setUndoVisible(false);
      setUndoMovie(null);
    }
  };

  // Just close dialog, keep added state as-is
  const handleDismissDialog = () => {
    setUndoVisible(false);
    setUndoMovie(null);
  };

  const handleRefresh = async () => {
    try {
      setLoadingMovies(true);
      setError(null);
      const fetched = await fetchMoviesForMood(mood);
      setMovies(fetched);
      setLastRefreshedAt(new Date());
    } catch (e) {
      console.log("Error fetching movies:", e);
      setError("Could not fetch movies. Please try again.");
    } finally {
      setLoadingMovies(false);
    }
  };

  const displayedMovies = movies.length > 0 ? movies : recommendations;

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 120,
        }}
      >
        {/* Header card */}
        <View className="mb-4 rounded-3xl border border-slate-800/70 bg-slate-900/95 px-5 py-4 shadow-lg shadow-black/40">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-2xl font-extrabold text-slate-50">
                StreamCompass
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                Hi {user?.email ?? "there"}, let’s find tonight’s perfect title.
              </Text>
            </View>

            <Pressable
              onPress={handleLogout}
              className="rounded-full border border-slate-600 bg-slate-900 px-3 py-1"
            >
              <Text className="text-xs font-semibold text-slate-100">
                Sign out
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Who & mood card */}
        <View className="mb-5 rounded-3xl border border-slate-800/70 bg-slate-900/95 px-5 py-5 shadow-lg shadow-black/40">
          <Text className="mb-3 text-sm font-semibold tracking-wide text-slate-200">
            Who & mood
          </Text>

          <View className="mb-4">
            <WatchContextSelector
              value={watchContext}
              onChange={setWatchContext}
            />
          </View>

          <View className="mb-5">
            <MoodSelector value={mood} onChange={setMood} />
          </View>

          <Pressable
            onPress={handleRefresh}
            className="rounded-full bg-emerald-600 px-4 py-3.5 shadow-lg shadow-emerald-900/50"
          >
            <Text className="text-center text-sm font-semibold text-white">
              Find something to watch
            </Text>
          </Pressable>

          {lastRefreshedAt && (
            <Text className="mt-2 text-[11px] text-slate-400">
              Suggestions refreshed at {lastRefreshedAt.toLocaleTimeString()}
            </Text>
          )}
        </View>

        {/* Soft CTA → AI Picks tab */}
        <Pressable
          onPress={() => router.push("/ai")}
          className="mb-3 self-start rounded-full border border-violet-500/70 bg-violet-600/15 px-4 py-2 shadow shadow-violet-900/50"
        >
          <Text className="text-xs font-semibold text-violet-200">
            Try AI Picks ✨
          </Text>
        </Pressable>

        {/* AI Picks summary card */}
        <View className="mb-6 rounded-3xl border border-slate-800/70 bg-slate-900/95 px-5 py-4 shadow-lg shadow-black/40">
          <View className="mb-3 flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-base font-semibold text-slate-50">
                AI picks just for you
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                Curated from your watchlist and trending titles.
              </Text>
            </View>

            <Pressable
              onPress={reloadAi}
              className="rounded-full bg-slate-800 px-3 py-1.5"
            >
              <Text className="text-xs font-semibold text-slate-100">
                Refresh
              </Text>
            </Pressable>
          </View>

          {aiLoading && (
            <View className="mt-1 flex-row items-center">
              <ActivityIndicator color={ACCENT} />
              <Text className="ml-2 text-xs text-slate-400">
                AI is picking movies…
              </Text>
            </View>
          )}

          {!aiLoading && aiError && (
            <Text className="mt-1 text-xs text-red-400">{aiError}</Text>
          )}

          {!aiLoading && !aiError && aiMovies.length === 0 && (
            <Text className="mt-1 text-xs text-slate-400">
              Add some favorites to your watchlist and I’ll start tailoring picks
              for you.
            </Text>
          )}

          {!aiLoading && !aiError && aiMovies.length > 0 && (
            <View className="mt-3 space-y-3">
              {aiMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </View>
          )}
        </View>

        {/* Tonight's picks (TMDB or mock fallback) */}
        <View className="mb-3">
          <Text className="text-lg font-semibold text-slate-50">
            Tonight’s picks
          </Text>

          {loadingMovies && (
            <Text className="mt-1 text-xs text-slate-400">
              Loading movies…
            </Text>
          )}

          {error && (
            <Text className="mt-1 text-xs text-red-400">{error}</Text>
          )}
        </View>

        {/* Swipeable movie list */}
        <View className="space-y-4">
          {displayedMovies.map((movie) => (
            <SwipeableRow
              key={movie.id}
              onPrimaryAction={() => handleAddToWatchlist(movie)}
              active={locallyAddedIds.includes(movie.id)}
            >
              <MovieCard movie={movie} />
            </SwipeableRow>
          ))}
        </View>
      </ScrollView>

      {/* Undo dialog overlay */}
      <UIDialog
        visible={undoVisible}
        title="Added to watchlist"
        message={
          undoMovie ? `"${undoMovie.title}" was added to your watchlist.` : ""
        }
        primaryLabel="Undo"
        onPrimary={handleUndoAdd}
        secondaryLabel="Close"
        onSecondary={handleDismissDialog}
      />
    </SafeAreaView>
  );
}
