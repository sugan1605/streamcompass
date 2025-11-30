// Displays user's saved watchlist (Firestore) with iOS-style swipe-to-delete.

import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import {
  getFavorites,
  removeFavorite,
  FavoriteMovie,
} from "@/src/services/favoritesService";

import { MovieCard } from "@/src/components/MovieCard";
import type { Movie } from "@/src/types/movies";

import Swipeable from "react-native-gesture-handler/Swipeable";
import { Ionicons } from "@expo/vector-icons";

export default function FavoritesScreen() {
  const { user } = useAuth();
  const { themeName, colors } = useTheme();
  const isDark = themeName === "dark";

  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user's watchlist from Firestore
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getFavorites(user.uid);
        setFavorites(data);
      } catch (e) {
        console.log("Error loading favorites:", e);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  // Remove movie from Firestore + local state
  const handleRemove = async (movieId: FavoriteMovie["movieId"]) => {
    if (!user) return;

    try {
      await removeFavorite(user.uid, movieId);
      setFavorites((prev) => prev.filter((f) => f.movieId !== movieId));
      Alert.alert("Removed", "Successfully removed from watchlist.");
    } catch (e) {
      console.log("Error removing favorite:", e);
    }
  };

  // Light/Dark mode colors
  const bgScreen = isDark ? "bg-slate-950" : "bg-slate-50";
  const cardBg = isDark ? "bg-slate-900/90" : "bg-white";
  const subtleText = isDark ? "text-slate-400" : "text-slate-500";

  // Minimal Movie model for MovieCard
  const mapToMovie = (fav: FavoriteMovie): Movie => ({
    id: fav.movieId,
    title: fav.title,
    description: fav.overview ?? "",
    posterPath: fav.posterUrl ?? null,
    genres: [],
    moods: [],
    recommendedFor: ["solo", "friends", "partner"],
    year: 0,
    runtimeMinutes: 0,
    rating: 0,
    maturityLabel: undefined,
  });

  // ————————————————————————————————————————————————
  // Swipe-to-delete right-side action (iOS style)
  // ————————————————————————————————————————————————
  const RightAction = ({
    movieId,
  }: {
    movieId: FavoriteMovie["movieId"];
  }) => {
    const opacity = useRef(new Animated.Value(1)).current;

    const onPress = () => {
      // Simple feedback animation → then delete
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.2, duration: 100, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.2, duration: 100, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start(() => handleRemove(movieId));
    };

    return (
      <View className="w-20 items-center justify-center pr-4">
        <Animated.View style={{ opacity }}>
          <Pressable
            onPress={onPress}
            className="h-11 w-11 items-center justify-center rounded-full bg-red-600 shadow-lg shadow-black/40"
          >
            <Ionicons name="trash-outline" size={18} color="#fff" />
          </Pressable>
        </Animated.View>
      </View>
    );
  };

  const renderRightActions = (movieId: FavoriteMovie["movieId"]) => (
    <RightAction movieId={movieId} />
  );

  // ————————————————————————————————————————————————
  // UI
  // ————————————————————————————————————————————————

  return (
    <SafeAreaView
      className={`flex-1 ${bgScreen}`}
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 40,
        }}
      >
        {/* Header */}
        <View className="mb-6">
          <View
            className={[
              "flex-row items-center justify-between rounded-3xl px-5 py-4 shadow-lg shadow-black/40 border border-white/10",
              isDark
                ? "bg-slate-900/80"
                : "bg-white/85 border-slate-200/70 backdrop-blur-md",
            ].join(" ")}
          >
            <View className="flex-1 pr-4">
              <Text className="text-[24px] font-extrabold" style={{ color: colors.text }}>
                Watchlist
              </Text>
              <Text
                className={`mt-1 text-xs ${subtleText}`}
                style={{ color: colors.textSecondary }}
              >
                All your saved movies, ready whenever you are.
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/home")}
              className="rounded-full border border-slate-400/60 bg-slate-900 px-3 py-1.5 shadow-md shadow-black/40"
            >
              <Text className="text-[11px] font-semibold text-slate-50">Home</Text>
            </Pressable>
          </View>
        </View>

        {/* Loading */}
        {loading && (
          <View className="mt-10 items-center">
            <ActivityIndicator />
            <Text className={`mt-2 text-xs ${subtleText}`}>
              Loading your watchlist...
            </Text>
          </View>
        )}

        {/* Empty state */}
        {!loading && favorites.length === 0 && (
          <View
            className={`mt-8 rounded-3xl px-5 py-6 shadow-lg shadow-black/40 ${cardBg}`}
          >
            <Text className="text-base font-semibold text-slate-50">
              Your watchlist is empty
            </Text>
            <Text className="mt-2 text-sm text-slate-400">
              Browse titles on Home or try AI Picks. Any movie you add will appear here.
            </Text>

            <View className="mt-4 flex-row gap-3">
              <Pressable
                onPress={() => router.push("/home")}
                className="flex-1 items-center justify-center rounded-full bg-emerald-600 px-4 py-2 shadow-md shadow-emerald-900/40"
              >
                <Text className="text-xs font-semibold text-white">
                  Discover movies
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/ai")}
                className="flex-1 items-center justify-center rounded-full bg-indigo-600 px-4 py-2 shadow-md shadow-indigo-900/40"
              >
                <Text className="text-xs font-semibold text-white">Try AI Picks</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Favorites list with swipe */}
        {!loading && favorites.length > 0 && (
          <View className="space-y-3">
            {favorites.map((fav) => (
              <View key={String(fav.movieId)} className="overflow-hidden rounded-3xl">
                <Swipeable
                  renderRightActions={() => renderRightActions(fav.movieId)}
                  overshootRight={false}
                  friction={2}
                >
                  <MovieCard movie={mapToMovie(fav)} />
                </Swipeable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
