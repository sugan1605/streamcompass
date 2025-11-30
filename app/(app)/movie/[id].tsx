import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Animated,
  ImageBackground,
  Linking,
  Image,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState, useRef } from "react";

import { MOCK_MOVIES } from "@/src/data/mockMovies";
import { Movie, WatchProviders, Review } from "@/src/types/movies";
import {
  fetchMovieById,
  fetchMovieCredits,
  fetchMovieVideos,
  fetchSimilarMovies,
  fetchWatchProviders,
  fetchMovieReviews,
} from "@/src/services/tmdb";
import { MovieCard } from "@/src/components/MovieCard";
import { ReviewItem } from "@/src/components/ReviewItem";
import { getScoreColor } from "@/src/utils/getScoreColor";
import { TMDB_CONFIG } from "@/src/config/tmdb";
import { useMovieSummary } from "@/src/hooks/useMovieSummary";

import { auth } from "@/src/firebaseConfig";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  FavoriteMovie,
} from "@/src/services/favoritesService";

import {
  Bookmark,
  BookmarkSimple,
  CaretLeft,
  Play,
} from "phosphor-react-native";

const SIMILAR_CARD_WIDTH = 260;

export default function MovieDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [movie, setMovie] = useState<Movie | null>(null);
  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
    getSummary,
  } = useMovieSummary(movie);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const [cast, setCast] = useState<any[]>([]);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [providers, setProviders] = useState<WatchProviders | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortBy, setSortBy] = useState<"recent" | "rating">("recent");
  const [reviewFilter, setReviewFilter] = useState<
    "all" | "positive" | "neutral" | "negative"
  >("all");

  // Fade-in effect for hero poster
  const posterOpacity = useRef(new Animated.Value(0)).current;

  // Horizontal auto-scroll for similar-movie carousel
  const similarScrollRef = useRef<ScrollView | null>(null);

  const posterUri = movie?.posterPath
    ? `${TMDB_CONFIG.imageBaseUrl}${movie.posterPath}`
    : undefined;

  // Derived review list based on current sort + filter
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    const aRating = a.rating ?? 0;
    const bRating = b.rating ?? 0;
    return bRating - aRating;
  });

  const filteredReviews = sortedReviews.filter((rev) => {
    const rating = rev.rating;
    if (reviewFilter === "all") return true;
    if (rating === null || rating === undefined) return true;

    if (reviewFilter === "positive") return rating >= 7;
    if (reviewFilter === "neutral") return rating >= 4 && rating < 7;
    if (reviewFilter === "negative") return rating < 4;

    return true;
  });

  // Load movie: prefer mock data for local demo, fall back to TMDB
  useEffect(() => {
    if (!id) {
      setError("No movie id provided.");
      setLoading(false);
      return;
    }

    const mockMatch = MOCK_MOVIES.find((m) => m.id === id);
    if (mockMatch) {
      setMovie(mockMatch);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const fetched = await fetchMovieById(id);
        if (fetched) {
          setMovie(fetched);
        } else {
          setError("Movie not found.");
        }
      } catch (e) {
        console.log("Error loading movie details:", e);
        setError("Could not load movie details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Smoothly fade in poster when URL is ready
  useEffect(() => {
    if (!posterUri) {
      posterOpacity.setValue(1);
      return;
    }

    Animated.timing(posterOpacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [posterUri, posterOpacity]);

  // Sync favorite state with Firestore for the current user/movie
  useEffect(() => {
    const loadFavoriteState = async () => {
      const user = auth.currentUser;
      if (!user || !movie?.id) {
        setIsFavorite(false);
        return;
      }

      try {
        setFavLoading(true);
        const favorites = await getFavorites(user.uid);
        const exists = favorites.some((f) => f.movieId === movie.id);
        setIsFavorite(exists);
      } catch (err) {
        console.log("Error loading favorite state:", err);
      } finally {
        setFavLoading(false);
      }
    };

    if (movie) {
      loadFavoriteState();
    }
  }, [movie?.id]);

  // Load cast list
  useEffect(() => {
    if (!movie?.id) return;

    (async () => {
      try {
        const credits = await fetchMovieCredits(movie.id);
        setCast(credits.cast ?? []);
      } catch (e) {
        console.log("Error loading cast:", e);
      }
    })();
  }, [movie?.id]);

  // Load trailer (YouTube video key)
  useEffect(() => {
    if (!movie?.id) return;

    (async () => {
      try {
        const { results } = await fetchMovieVideos(movie.id);
        const youtubeTrailer = results.find(
          (v: any) =>
            v.site === "YouTube" &&
            v.type === "Trailer" &&
            typeof v.key === "string"
        );
        setTrailerKey(youtubeTrailer?.key ?? null);
      } catch (e) {
        console.log("Error loading trailer:", e);
      }
    })();
  }, [movie?.id]);

  // Load similar movie recommendations
  useEffect(() => {
    if (!movie?.id) return;

    (async () => {
      try {
        const results = await fetchSimilarMovies(movie.id);
        setSimilar(results);
      } catch (e) {
        console.log("Error loading similar movies:", e);
      }
    })();
  }, [movie?.id]);

  // Auto-scroll similar carousel for a more “alive” feeling
  useEffect(() => {
    if (similar.length <= 1) return;

    const cardWidthWithSpacing = SIMILAR_CARD_WIDTH + 16;
    let index = 0;

    const intervalId = setInterval(() => {
      index = (index + 1) % similar.length;
      if (similarScrollRef.current) {
        similarScrollRef.current.scrollTo({
          x: index * cardWidthWithSpacing,
          animated: true,
        });
      }
    }, 6000);

    return () => clearInterval(intervalId);
  }, [similar.length]);

  // Load user reviews from TMDB
  useEffect(() => {
    if (!movie?.id) return;

    (async () => {
      try {
        const data = await fetchMovieReviews(movie.id);
        setReviews(data);
      } catch (e) {
        console.log("Error loading reviews:", e);
      }
    })();
  }, [movie?.id]);

  // Load “where to watch” providers (default to US, can be localized later)
  useEffect(() => {
    if (!movie?.id) return;

    (async () => {
      try {
        const wp = await fetchWatchProviders(movie.id, "US");
        setProviders(wp);
      } catch (e) {
        console.log("Error loading watch providers:", e);
      }
    })();
  }, [movie?.id]);

  const handleBack = () => {
    router.back();
  };

  // Add/remove movie from user’s watchlist in Firestore
  const handleToggleFavorite = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert(
        "Sign in required",
        "You need to be signed in to add movies to your watchlist.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Go to sign in",
            onPress: () => router.push("/signin"),
          },
        ]
      );
      return;
    }

    if (!movie) return;

    const payload: FavoriteMovie = {
      movieId: movie.id,
      title: movie.title,
      posterUrl: posterUri ?? null,
      overview: movie.description,
    };

    try {
      setFavLoading(true);

      if (!isFavorite) {
        await addFavorite(user.uid, payload);
        setIsFavorite(true);
      } else {
        await removeFavorite(user.uid, movie.id);
        setIsFavorite(false);
      }
    } catch (err) {
      console.log("Error updating favorite:", err);
      Alert.alert(
        "Error",
        "Could not update your watchlist. Please try again."
      );
    } finally {
      setFavLoading(false);
    }
  };

  // -------------------- RENDER STATES --------------------

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950">
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator />
          <Text className="mt-3 text-sm text-slate-400">Loading movie...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !movie) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-3 text-center text-lg font-semibold text-red-500">
            {error ?? "Movie not found."}
          </Text>
          <Pressable
            onPress={() => router.replace("/home")}
            className="rounded-full border border-slate-700 bg-slate-900 px-5 py-2"
          >
            <Text className="text-sm font-medium text-slate-100">
              Go back home
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Pre-built Tailwind class strings for the main buttons
  const watchlistButtonClasses = [
    "flex-1 h-12 flex-row items-center justify-center gap-2",
    "rounded-full border border-white/10",
    "shadow-lg shadow-black/40",
    isFavorite ? "bg-red-600/90" : "bg-slate-900/90",
    favLoading ? "opacity-70" : "",
  ].join(" ");

  const trailerButtonClasses = [
    "flex-1 h-12 flex-row items-center justify-center gap-2",
    "rounded-full border border-white/10",
    "bg-emerald-600/95",
    "shadow-lg shadow-emerald-900/40",
  ].join(" ");

  // -------------------- MAIN UI --------------------

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        {/* Back button */}
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          className="mb-4 flex-row items-center"
        >
          <CaretLeft size={18} color="#e5e7eb" weight="bold" />
          <Text className="ml-1 text-base font-medium text-slate-100">
            Back
          </Text>
        </Pressable>

        {/* Hero poster */}
        {posterUri && (
          <View className="mb-6 overflow-hidden rounded-3xl">
            <Animated.View style={{ opacity: posterOpacity }}>
              <ImageBackground
                source={{ uri: posterUri }}
                style={styles.heroPoster}
                imageStyle={{ borderRadius: 24 }}
              >
                <LinearGradient
                  colors={["rgba(15,23,42,0.1)", "rgba(15,23,42,0.95)"]}
                  style={StyleSheet.absoluteFillObject}
                />

                {/* Rating badge */}
                {movie.rating > 0 && (
                  <View
                    className="absolute left-5 top-5 rounded-full px-3 py-1"
                    style={{ backgroundColor: getScoreColor(movie.rating) }}
                  >
                    <Text className="text-sm font-bold text-slate-50">
                      ★ {movie.rating.toFixed(1)}
                    </Text>
                  </View>
                )}

                <View className="mt-auto px-5 pb-6">
                  <Text className="text-3xl font-extrabold text-slate-50">
                    {movie.title}
                  </Text>
                  <Text className="mt-1 text-sm text-slate-300">
                    {movie.year > 0 ? movie.year : ""}
                    {movie.runtimeMinutes > 0
                      ? ` · ${movie.runtimeMinutes} min`
                      : ""}
                  </Text>
                </View>
              </ImageBackground>
            </Animated.View>
          </View>
        )}

        {/* Main content card */}
        <View className="rounded-3xl bg-slate-900/95 p-4 shadow-lg shadow-black/40">
          {/* Description */}
          <Text className="text-lg font-semibold text-slate-50">
            Description
          </Text>
          <Text className="mt-2 text-sm leading-5 text-slate-300">
            {movie.description}
          </Text>

          {/* AI summary */}
          <View className="mt-4 rounded-2xl border border-emerald-700/50 bg-emerald-900/20 p-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-sm font-semibold text-emerald-100">
                  AI summary
                </Text>
                <Text className="mt-1 text-xs text-emerald-200/80">
                  Let StreamCompass AI condense this movie into a quick,
                  spoiler-light summary.
                </Text>
              </View>
              <Pressable
                disabled={summaryLoading}
                onPress={getSummary}
                className="rounded-full bg-emerald-500 px-3 py-1.5"
              >
                {summaryLoading ? (
                  <ActivityIndicator size="small" color="#0f172a" />
                ) : (
                  <Text className="text-xs font-semibold text-emerald-950">
                    Ask AI
                  </Text>
                )}
              </Pressable>
            </View>

            {summaryError && (
              <Text className="mt-2 text-xs text-red-400">{summaryError}</Text>
            )}

            {summary && (
              <Text className="mt-2 text-xs leading-4 text-emerald-50">
                {summary}
              </Text>
            )}
          </View>

          {/* More info */}
          <View className="mt-5">
            <Text className="mb-2 text-base font-semibold text-slate-50">
              More info
            </Text>

            {movie.genres?.length > 0 && (
              <View className="mt-1 flex-row flex-wrap">
                {movie.genres.map((g) => (
                  <View
                    key={g}
                    className="mr-2 mb-2 rounded-xl bg-slate-800 px-3 py-1"
                  >
                    <Text className="text-xs font-semibold text-slate-100">
                      {g}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View className="mt-2 flex-row items-center">
              {movie.runtimeMinutes > 0 && (
                <Text className="mr-3 text-xs text-slate-300">
                  {movie.runtimeMinutes} min
                </Text>
              )}
              {movie.year > 0 && (
                <Text className="mr-3 text-xs text-slate-300">
                  • {movie.year}
                </Text>
              )}
              {movie.maturityLabel && (
                <View className="ml-1 rounded-md bg-slate-100/10 px-2 py-0.5">
                  <Text className="text-[11px] font-bold text-slate-50">
                    {movie.maturityLabel}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Reviews */}
          {filteredReviews.length > 0 && (
            <View className="mt-6">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-slate-50">
                  User Reviews
                </Text>

                <View className="flex-row">
                  <Pressable
                    onPress={() => setSortBy("recent")}
                    className={`ml-2 rounded-full px-3 py-1 ${
                      sortBy === "recent" ? "bg-slate-100" : "bg-slate-800/80"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        sortBy === "recent"
                          ? "text-slate-900"
                          : "text-slate-100"
                      }`}
                    >
                      Recent
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setSortBy("rating")}
                    className={`ml-2 rounded-full px-3 py-1 ${
                      sortBy === "rating" ? "bg-slate-100" : "bg-slate-800/80"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        sortBy === "rating"
                          ? "text-slate-900"
                          : "text-slate-100"
                      }`}
                    >
                      Rating
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="mt-1 flex-row flex-wrap">
                {[
                  { key: "all", label: "All" },
                  { key: "positive", label: "👍 Positive" },
                  { key: "neutral", label: "😐 Neutral" },
                  { key: "negative", label: "👎 Negative" },
                ].map((f) => {
                  const active = reviewFilter === f.key;
                  return (
                    <Pressable
                      key={f.key}
                      onPress={() =>
                        setReviewFilter(f.key as typeof reviewFilter)
                      }
                      className={`mr-2 mb-2 rounded-full px-3 py-1 ${
                        active ? "bg-slate-100" : "bg-slate-800/80"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          active ? "text-slate-900" : "text-slate-100"
                        }`}
                      >
                        {f.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View className="mt-2">
                {filteredReviews.slice(0, 6).map((rev) => (
                  <ReviewItem
                    key={rev.id}
                    author={rev.author}
                    rating={rev.rating ?? null}
                    content={rev.content}
                    createdAt={rev.createdAt}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Where to watch */}
          {providers && (
            <View className="mt-6">
              <Text className="mb-3 text-base font-semibold text-slate-50">
                Where to watch
              </Text>

              {providers.stream.length > 0 && (
                <View className="mb-3 flex-row items-start">
                  <Text className="mt-1 w-16 text-sm font-semibold text-slate-300">
                    Stream
                  </Text>
                  <View className="flex-1 flex-row flex-wrap">
                    {providers.stream.map((p) => (
                      <View
                        key={p.id ?? p.name}
                        className="mr-2 mb-2 flex-row items-center rounded-full border border-white/10 bg-slate-900/80 px-3 py-1"
                      >
                        {p.logoPath && (
                          <Image
                            source={{
                              uri: `${TMDB_CONFIG.imageBaseUrl}${p.logoPath}`,
                            }}
                            className="mr-2 h-5 w-5 rounded bg-slate-800"
                          />
                        )}
                        <Text className="text-xs font-semibold text-slate-100">
                          {p.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {providers.rent.length > 0 && (
                <View className="mb-3 flex-row items-start">
                  <Text className="mt-1 w-16 text-sm font-semibold text-slate-300">
                    Rent
                  </Text>
                  <View className="flex-1 flex-row flex-wrap">
                    {providers.rent.map((p) => (
                      <View
                        key={p.id ?? p.name}
                        className="mr-2 mb-2 flex-row items-center rounded-full border border-white/10 bg-slate-900/80 px-3 py-1"
                      >
                        {p.logoPath && (
                          <Image
                            source={{
                              uri: `${TMDB_CONFIG.imageBaseUrl}${p.logoPath}`,
                            }}
                            className="mr-2 h-5 w-5 rounded bg-slate-800"
                          />
                        )}
                        <Text className="text-xs font-semibold text-slate-100">
                          {p.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {providers.buy.length > 0 && (
                <View className="flex-row items-start">
                  <Text className="mt-1 w-16 text-sm font-semibold text-slate-300">
                    Buy
                  </Text>
                  <View className="flex-1 flex-row flex-wrap">
                    {providers.buy.map((p) => (
                      <View
                        key={p.id ?? p.name}
                        className="mr-2 mb-2 flex-row items-center rounded-full border border-white/10 bg-slate-900/80 px-3 py-1"
                      >
                        {p.logoPath && (
                          <Image
                            source={{
                              uri: `${TMDB_CONFIG.imageBaseUrl}${p.logoPath}`,
                            }}
                            className="mr-2 h-5 w-5 rounded bg-slate-800"
                          />
                        )}
                        <Text className="text-xs font-semibold text-slate-100">
                          {p.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Watchlist + trailer buttons */}
          <View className="mt-6 mb-2 flex-row items-center gap-3">
            <Pressable
              onPress={handleToggleFavorite}
              disabled={favLoading}
              className={watchlistButtonClasses}
            >
              {favLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  {isFavorite ? (
                    <Bookmark size={18} color="#ffffff" weight="fill" />
                  ) : (
                    <BookmarkSimple size={18} color="#ffffff" weight="bold" />
                  )}
                  <Text className="text-sm font-semibold text-white">
                    {isFavorite ? "Remove from watchlist" : "Add to watchlist"}
                  </Text>
                </>
              )}
            </Pressable>

            {trailerKey && (
              <Pressable
                onPress={() =>
                  Linking.openURL(
                    `https://www.youtube.com/watch?v=${trailerKey}`
                  )
                }
                className={trailerButtonClasses}
              >
                <Play size={18} color="#ffffff" weight="fill" />
                <Text className="text-sm font-semibold text-white">
                  Play trailer
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Cast */}
        {cast.length > 0 && (
          <>
            <View className="my-6 h-px bg-slate-800" />
            <Text className="mb-3 text-lg font-semibold text-slate-50">
              Cast
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-2"
            >
              {cast.slice(0, 15).map((person) => {
                const profileUri = person.profile_path
                  ? `${TMDB_CONFIG.imageBaseUrl}${person.profile_path}`
                  : null;

                return (
                  <Pressable
                    key={person.id}
                    className="mr-4 w-20 items-center"
                    onPress={() =>
                      router.push({
                        pathname: "/person/[id]",
                        params: { id: String(person.id) },
                      })
                    }
                  >
                    {profileUri ? (
                      <ImageBackground
                        source={{ uri: profileUri }}
                        style={styles.castImage}
                        imageStyle={{ borderRadius: 999 }}
                      />
                    ) : (
                      <View className="h-18 w-18 items-center justify-center rounded-full bg-slate-800">
                        <Text className="text-[10px] text-slate-400">N/A</Text>
                      </View>
                    )}

                    <Text
                      numberOfLines={1}
                      className="mt-1 text-center text-[11px] font-semibold text-slate-100"
                    >
                      {person.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      className="text-center text-[11px] text-slate-400"
                    >
                      {person.character}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </>
        )}

        {/* Similar titles */}
        {similar.length > 0 && (
          <>
            <View className="my-6 h-px bg-slate-800" />
            <Text className="mb-3 text-lg font-semibold text-slate-50">
              Similar titles
            </Text>

            <ScrollView
              ref={similarScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={SIMILAR_CARD_WIDTH + 16}
              snapToAlignment="start"
              contentContainerStyle={{ paddingVertical: 8 }}
            >
              {similar.map((m) => (
                <View
                  key={m.id}
                  style={{ width: SIMILAR_CARD_WIDTH, marginRight: 16 }}
                >
                  <MovieCard movie={m} />
                </View>
              ))}
            </ScrollView>
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heroPoster: {
    width: "100%",
    height: 420,
    justifyContent: "flex-end",
    backgroundColor: "#000",
  },
  castImage: {
    width: 70,
    height: 70,
    borderRadius: 999,
    backgroundColor: "#1f2937",
    marginBottom: 6,
  },
});
