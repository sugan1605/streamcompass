// Displays AI-generated movie recommendations based on the user's favorites.

import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";

import { useAiRecommendations } from "@/src/hooks/useAiRecommendations";
import { MovieCard } from "@/src/components/MovieCard";
import { useAuth } from "@/src/context/AuthContext";

export default function AiPicksScreen() {
  const { user } = useAuth();

  // Custom hook that fetches OpenAI-generated recommendations
  const { movies, loading, error, reload } = useAiRecommendations();

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <ScrollView
        className="flex-1 px-4 pt-8 pb-8"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <Text className="mb-1 text-2xl font-bold text-slate-900">
          AI Picks 🎯
        </Text>

        {/* Subtitle depending on auth state */}
        {user ? (
          <Text className="mb-4 text-sm text-slate-600">
            Personalized picks based on your watchlist.
          </Text>
        ) : (
          <Text className="mb-4 text-sm text-slate-600">
            Sign in and add favorites to unlock AI-powered recommendations.
          </Text>
        )}

        {/* Loading state */}
        {loading && (
          <View className="mb-4 flex-row items-center">
            <ActivityIndicator />
            <Text className="ml-2 text-xs text-slate-600">
              AI is analyzing your favorites…
            </Text>
          </View>
        )}

        {/* Error state */}
        {error && (
          <Text className="mb-4 text-sm text-red-600">{error}</Text>
        )}

        {/* Empty state */}
        {!loading && !error && movies.length === 0 && (
          <Text className="mb-4 text-sm text-slate-600">
            No AI picks yet. Try adding some movies to your watchlist.
          </Text>
        )}

        {/* Movie results */}
        <View className="mt-2 mb-6 space-y-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </View>

        {/* Reload button */}
        <Pressable
          onPress={reload}
          className="self-start rounded-full bg-emerald-700 px-5 py-3"
        >
          <Text className="font-semibold text-white">Refresh AI picks</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
