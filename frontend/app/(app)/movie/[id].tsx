import { View, Text, ScrollView, Alert, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState, useRef } from "react";

import { TMDB_CONFIG } from "@/src/config/tmdb";
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

import { useMovieSummary } from "@/src/hooks/useMovieSummary";

import { auth } from "@/src/firebaseConfig";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  FavoriteMovie,
} from "@/src/services/favoritesService";

import { CaretLeft } from "phosphor-react-native";

import { UIIconButton } from "@/src/components/ui/UIIconButton";
import { UICard } from "@/src/components/ui/UICard";
import { UIButton } from "@/src/components/ui/UIButton";
import { MovieSummaryCard } from "@/src/components/ui/MovieSummaryCard";
import { MovieMetaInfo } from "@/src/components/ui/MovieMetaInfo";
import { UILineDivider } from "@/src/components/ui/UILineDivider";
import { MovieActionButton } from "@/src/components/ui/MovieActionButton";
import { MovieHeroPoster } from "@/src/components/ui/MovieHeroPoster";
import { CastAvatar, CastAvatarSkeleton } from "@/src/components/ui/CastAvatar";
import { MovieWatchProvidersSection } from "@/src/components/ui/MovieWatchProvidersSection";
import {
  MovieSimilarCarousel,
  MovieSimilarCarouselSkeleton,
} from "@/src/components/ui/MovieSimilarCarousel";
import { MovieReviewSection } from "@/src/components/ui/MovieReviewSection";
import { UISkeleton } from "@/src/components/ui/UISkeleton";
import { UIDialog } from "@/src/components/ui/UIDialog";

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
  const [castLoading, setCastLoading] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [providers, setProviders] = useState<WatchProviders | null>(null);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Dialog for confirm removal from watchlist
  const [removeDialogVisible, setRemoveDialogVisible] = useState(false);

  // Fade-in effect for hero poster
  const posterOpacity = useRef(new Animated.Value(0)).current;

  const posterUri = movie?.posterPath
    ? `${TMDB_CONFIG.imageBaseUrl}${movie.posterPath}`
    : undefined;

  // -------- Data loading --------

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

  // Poster fade-in
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

  // Favorite state
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

  // Cast
  useEffect(() => {
    if (!movie?.id) return;

    (async () => {
      try {
        setCastLoading(true);
        const credits = await fetchMovieCredits(movie.id);
        setCast(credits.cast ?? []);
      } catch (e) {
        console.log("Error loading cast:", e);
      } finally {
        setCastLoading(false);
      }
    })();
  }, [movie?.id]);

  // Trailer
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

  // Similar movies
  useEffect(() => {
    if (!movie?.id) return;

    (async () => {
      try {
        setSimilarLoading(true);
        const results = await fetchSimilarMovies(movie.id);
        setSimilar(results);
      } catch (e) {
        console.log("Error loading similar movies:", e);
      } finally {
        setSimilarLoading(false);
      }
    })();
  }, [movie?.id]);

  // Reviews
  useEffect(() => {
    if (!movie?.id) return;

    (async () => {
      try {
        setReviewsLoading(true);
        const data = await fetchMovieReviews(movie.id);
        setReviews(data);
      } catch (e) {
        console.log("Error loading reviews:", e);
      } finally {
        setReviewsLoading(false);
      }
    })();
  }, [movie?.id]);

  // Where to watch providers
  useEffect(() => {
    if (!movie?.id) return;

    (async () => {
      try {
        setProvidersLoading(true);
        const wp = await fetchWatchProviders(movie.id, "US");
        setProviders(wp);
      } catch (e) {
        console.log("Error loading watch providers:", e);
      } finally {
        setProvidersLoading(false);
      }
    })();
  }, [movie?.id]);

  const handleBack = () => {
    router.back();
  };

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

    // If already in watchlist -> open confirm dialog instead of removing immediately
    if (isFavorite) {
      setRemoveDialogVisible(true);
      return;
    }

    const payload: FavoriteMovie = {
      movieId: movie.id,
      title: movie.title,
      posterUrl: posterUri ?? null,
      overview: movie.description,
    };

    try {
      setFavLoading(true);
      await addFavorite(user.uid, payload);
      setIsFavorite(true);
    } catch (e) {
      console.log("Error updating favorite:", e);
      Alert.alert(
        "Error",
        "Could not update your watchlist. Please try again."
      );
    } finally {
      setFavLoading(false);
    }
  };

  const handleConfirmRemoveFavorite = async () => {
    const user = auth.currentUser;

    if (!user || !movie) {
      setRemoveDialogVisible(false);
      return;
    }

    try {
      setFavLoading(true);
      await removeFavorite(user.uid, movie.id);
      setIsFavorite(false);
    } catch (e) {
      console.log("Error removing favorites", e);
      Alert.alert(
        "Error",
        "Could not remove this movie from your watchlist. Please try again."
      );
    } finally {
      setFavLoading(false);
      setRemoveDialogVisible(false);
    }
  };

  const handleCancelRemoveFavorite = () => {
    setRemoveDialogVisible(false);
  };

  // ---------- Render states ----------

  if (loading && !movie) {
    // Full skeleton screen while the main movie payload is loading
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
          <View className="mb-4 flex-row items-center">
            <UIIconButton
              onPress={() => router.back()}
              variant="ghost"
              size={40}
              className="mr-2"
              icon={<CaretLeft size={18} color="#e5e7eb" weight="bold" />}
            />
            <UISkeleton width={80} height={16} radius={8} />
          </View>

          {/* Hero skeleton */}
          <View className="mb-6 overflow-hidden rounded-3xl">
            <UISkeleton height={420} radius={24} />
          </View>

          {/* Main content skeleton */}
          <UICard className="p-4" variant="elevated">
            <UISkeleton width={120} height={18} radius={8} />
            <View className="mt-2" />
            <UISkeleton height={60} radius={8} />
            <View className="mt-4" />
            <UISkeleton width={100} height={14} radius={8} />
            <View className="mt-2" />
            <UISkeleton width={140} height={14} radius={8} />
          </UICard>

          {/* Cast skeleton */}
          <UILineDivider />
          <Text className="mb-3 text-lg font-semibold text-slate-50">Cast</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            {[...Array(8)].map((_, i) => (
              <CastAvatarSkeleton key={i} />
            ))}
          </ScrollView>

          {/* Similar titles skeleton */}
          <UILineDivider />
          <Text className="mb-3 text-lg font-semibold text-slate-50">
            Similar titles
          </Text>
          <MovieSimilarCarouselSkeleton />

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // If we’re not loading but still have an error or no movie, show an error state
  if (error || !movie) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-3 text-center text-lg font-semibold text-red-500">
            {error ?? "Movie not found."}
          </Text>
          <UIButton
            label="Go back home"
            onPress={() => router.replace("/(app)/(tabs)/home")}
            variant="outline"
            hapticStyle="light"
            className="px-5"
            fullWidth={false}
          />
        </View>
      </SafeAreaView>
    );
  }

  // ---------- Main UI ----------

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
        <View className="mb-4 flex-row items-center">
          <UIIconButton
            onPress={handleBack}
            variant="ghost"
            size={40}
            className="mr-2"
            icon={<CaretLeft size={18} color="#e5e7eb" weight="bold" />}
          />
          <Text className="text-base font-medium text-slate-100">Back</Text>
        </View>

        {/* Hero poster */}
        {posterUri && (
          <MovieHeroPoster
            posterUri={posterUri}
            rating={movie.rating}
            title={movie.title}
            year={movie.year}
            runtimeMinutes={movie.runtimeMinutes}
            posterOpacity={posterOpacity}
          />
        )}

        {/* Main content card */}
        <UICard className="p-4" variant="elevated">
          {/* Description */}
          <Text className="text-lg font-semibold text-slate-50">
            Description
          </Text>
          <Text className="mt-2 text-sm leading-5 text-slate-300">
            {movie.description}
          </Text>

          {/* AI summary */}
          <MovieSummaryCard
            summary={summary}
            loading={summaryLoading}
            error={summaryError}
            onAskAI={getSummary}
          />

          {/* More info */}
          <MovieMetaInfo
            genres={movie.genres}
            runtimeMinutes={movie.runtimeMinutes}
            year={movie.year}
            maturityLabel={movie.maturityLabel}
          />

          {/* Reviews */}
          {reviewsLoading ? (
            <View className="mt-6">
              <UISkeleton width={120} height={18} radius={8} />
              <View className="mt-2">
                <UISkeleton height={60} radius={8} />
              </View>
            </View>
          ) : reviews.length > 0 ? (
            <MovieReviewSection reviews={reviews} />
          ) : null}

          {/* Where to watch */}
          {providersLoading ? (
            <View className="mt-6">
              <UISkeleton width={140} height={18} radius={8} />
              <View className="mt-3 flex-row flex-wrap">
                {[...Array(4)].map((_, i) => (
                  <View key={i} className="mr-2 mb-2">
                    <UISkeleton width={80} height={28} radius={999} />
                  </View>
                ))}
              </View>
            </View>
          ) : providers ? (
            <MovieWatchProvidersSection providers={providers} />
          ) : null}

          {/* Watchlist + trailer buttons */}
          <MovieActionButton
            isFavorite={isFavorite}
            favLoading={favLoading}
            onToggleFavorite={handleToggleFavorite}
            trailerKey={trailerKey}
          />
        </UICard>

        {/* Cast */}
        {castLoading ? (
          <>
            <UILineDivider />
            <Text className="mb-3 text-lg font-semibold text-slate-50">
              Cast
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-2"
            >
              {[...Array(8)].map((_, i) => (
                <CastAvatarSkeleton key={i} />
              ))}
            </ScrollView>
          </>
        ) : cast.length > 0 ? (
          <>
            <UILineDivider />
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
                  <CastAvatar
                    key={person.id}
                    name={person.name}
                    character={person.character}
                    profileUri={profileUri}
                    onPress={() =>
                      router.push({
                        pathname: "/person/[id]",
                        params: { id: String(person.id) },
                      })
                    }
                  />
                );
              })}
            </ScrollView>
          </>
        ) : null}

        {/* Similar titles */}
        {similarLoading ? (
          <>
            <UILineDivider />
            <Text className="mb-3 text-lg font-semibold text-slate-50">
              Similar titles
            </Text>
            <MovieSimilarCarouselSkeleton />
          </>
        ) : similar.length > 0 ? (
          <>
            <UILineDivider />
            <Text className="mb-3 text-lg font-semibold text-slate-50">
              Similar titles
            </Text>
            <MovieSimilarCarousel movies={similar} />
          </>
        ) : null}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Confirm remove from watchlist dialog */}

      <UIDialog
        visible={removeDialogVisible}
        title="Remove from watchlist?"
        message="This will remove this movie from your watchlist. You can always add it again later."
        primaryLabel="Remove"
        onPrimary={handleConfirmRemoveFavorite}
        secondaryLabel="Cancel"
        onSecondary={handleCancelRemoveFavorite}
      />
    </SafeAreaView>
  );
}
