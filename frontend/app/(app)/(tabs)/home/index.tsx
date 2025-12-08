// Home screen: mood-based picks, AI suggestions and swipe-to-save watchlist.

import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useMemo, useEffect } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { useAuth } from "@/src/context/AuthContext";
import { fetchMoviesForMood, searchMoviesByTitle } from "@/src/services/tmdb";
import { WatchContext, Mood, Movie } from "@/src/types/movies";
import { MOCK_MOVIES } from "@/src/data/mockMovies";

import { WatchContextSelector } from "@/src/components/WatchContextSelector";
import { MoodSelector } from "@/src/components/MoodSelector";
import { MovieCard } from "@/src/components/MovieCard";
import { useAiRecommendations } from "@/src/hooks/useAiRecommendations";

import { SwipeableRow } from "@/src/components/ui/SwipeableRow";
import { UIDialog } from "@/src/components/ui/UIDialog";
import { SearchBar } from "@/src/components/ui/SearchBar";
import { PowerButton } from "@/src/components/ui/PowerButton"; // <-- NEW IMPORT

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

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [watchContext, setWatchContext] = useState<WatchContext>("solo");
  const [mood, setMood] = useState<Mood>("chill");
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [undoMovie, setUndoMovie] = useState<Movie | null>(null);
  const [undoVisible, setUndoVisible] = useState(false);

  // NEW — Sign-out confirm dialog toggle
  const [signOutDialogVisible, setSignOutDialogVisible] = useState(false);

  const [locallyAddedIds, setLocallyAddedIds] = useState<string[]>([]);

  const {
    movies: aiMovies,
    loading: aiLoading,
    error: aiError,
    reload: reloadAi,
  } = useAiRecommendations();

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

  // NEW — Power button press → haptics + open dialog
  const handleSignOutPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setSignOutDialogVisible(true);
  };

  const handleConfirmSignOut = async () => {
    setSignOutDialogVisible(false);
    await handleLogout();
  };

  const handleCancelSignOut = () => setSignOutDialogVisible(false);

  const handleAddToWatchlist = async (movie: Movie) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert(
        "Sign in required",
        "You need to be signed in to add movies to your watchlist.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Go to sign in", onPress: () => router.replace("/signin") },
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

      setLocallyAddedIds((prev) =>
        prev.includes(movie.id) ? prev : [...prev, movie.id]
      );

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

    try {
      await removeFavorite(currentUser.uid, undoMovie.id);
      setLocallyAddedIds((prev) => prev.filter((id) => id !== undoMovie.id));
    } catch (err) {
      console.log("Error undoing favorite:", err);
    } finally {
      setUndoVisible(false);
      setUndoMovie(null);
    }
  };

  const handleSearch = async () => {
    const q = searchQuery.trim();

    if (!q) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError(null);
      const results = await searchMoviesByTitle(q);
      setSearchResults(results);
    } catch (e) {
      console.log("Error searching movies:", e);
      setSearchError("Could not search right now, Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

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
  const listToRender =
    searchQuery.trim().length > 0 ? searchResults : displayedMovies;

  const isSearching = searchQuery.trim().length > 0;

  useEffect(() => {
    if (!undoVisible) return;

    const timer = setTimeout(() => {
      setUndoVisible(false);
      setUndoMovie(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [undoVisible]);

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
        {/* Header */}
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

            {/* NEW — Yellow round power button */}
            <PowerButton onPress={handleSignOutPress} />
          </View>
        </View>

        {/* Who & mood selection card */}
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

        {/* AI CTA */}
        <Pressable
          onPress={() => router.push("/ai")}
          className="mb-3 self-start rounded-full border border-violet-500/70 bg-violet-600/15 px-4 py-2 shadow shadow-violet-900/50"
        >
          <Text className="text-xs font-semibold text-violet-200">
            Try AI Picks ✨
          </Text>
        </Pressable>

        {/* AI section */}
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
              Add some favorites to your watchlist and I’ll start tailoring
              picks for you.
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

        {/* Section header */}
        <View className="mb-3">
          <Text className="text-lg font-semibold text-slate-50">
            {isSearching ? "Search results" : "Tonight’s picks"}
          </Text>

          {loadingMovies && !isSearching && (
            <Text className="mt-1 text-xs text-slate-400">Loading movies…</Text>
          )}

          {error && !isSearching && (
            <Text className="mt-1 text-xs text-red-400">{error}</Text>
          )}
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            if (text.trim().length === 0) {
              setSearchResults([]);
              setSearchError(null);
            }
          }}
          onSubmit={handleSearch}
          loading={searchLoading}
          placeholder="Search by title…"
          onClear={() => {
            setSearchResults([]);
            setSearchError(null);
          }}
        />

        {searchError && (
          <Text className="mb-2 text-xs text-red-400">{searchError}</Text>
        )}

        {searchQuery.trim().length > 0 &&
          !searchLoading &&
          !searchError &&
          listToRender.length === 0 && (
            <Text className="mb-2 text-xs text-slate-400">
              No results found for "{searchQuery.trim()}",
            </Text>
          )}

        <View className="space-y-4">
          {listToRender.map((movie) => (
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

      {/* Undo dialog */}
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

      {/* NEW — Confirm Sign-Out */}
      <UIDialog
        visible={signOutDialogVisible}
        title="Sign out"
        message="Are you sure you want to sign out from StreamCompass?"
        primaryLabel="Sign out"
        onPrimary={handleConfirmSignOut}
        secondaryLabel="Cancel"
        onSecondary={handleCancelSignOut}
      />
    </SafeAreaView>
  );
}
