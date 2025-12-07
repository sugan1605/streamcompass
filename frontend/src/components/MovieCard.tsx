import { View, Text, Image, Pressable } from "react-native";
import { router } from "expo-router";
import { Movie } from "@/src/types/movies";
import { TMDB_CONFIG } from "@/src/config/tmdb";
import { getScoreColor } from "@/src/utils/getScoreColor";

type Props = {
  movie: Movie;
};

/**
 * Brukes på Home, AI Picks og Watchlist.
 * Viser poster + tittel + rating, og åpner MovieDetails ved tap.
 */
export function MovieCard({ movie }: Props) {
  const posterUri = movie.posterPath
    ? `${TMDB_CONFIG.imageBaseUrl}${movie.posterPath}`
    : undefined;

  const handlePress = () => {
    router.push({
      pathname: "/movie/[id]",
      params: { id: movie.id },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className="mb-4 flex-row rounded-3xl bg-slate-900 p-3 shadow-md"
    >
      {/* Poster / fallback hvis ingen poster fra TMDB */}
      <View className="mr-3 overflow-hidden rounded-2xl bg-slate-800">
        {posterUri ? (
          <Image
            source={{ uri: posterUri }}
            className="h-40 w-28"
            resizeMode="cover"
          />
        ) : (
          <View className="h-40 w-28 items-center justify-center">
            <Text className="text-xs text-slate-300">No poster</Text>
          </View>
        )}

        {/* Score badge med dynamisk bakgrunn fra getScoreColor */}
        {movie.rating > 0 && (
          <View
            className="absolute left-2 top-2 flex-row items-center rounded-full px-2.5 py-1"
            style={{ backgroundColor: getScoreColor(movie.rating) }}
          >
            <Text className="text-xs font-semibold text-slate-50">
              ★ {movie.rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Tekstinnhold: tittel, år, rating, kort beskrivelse */}
      <View className="flex-1 justify-center">
        <Text
          className="text-base font-semibold text-slate-50"
          numberOfLines={1}
        >
          {movie.title}
        </Text>

        {movie.year > 0 && (
          <Text className="mt-1 text-xs text-slate-300">{movie.year}</Text>
        )}

        {movie.rating > 0 && (
          <Text className="mt-1 text-xs text-slate-300">
            Rating {movie.rating.toFixed(1)}
          </Text>
        )}

        {movie.description && (
          <Text
            className="mt-2 text-xs leading-4 text-slate-200"
            numberOfLines={3}
          >
            {movie.description}
          </Text>
        )}

        {/* Liten hint-tekst for å vise at kortet er tappbart */}
        <Text className="mt-2 text-xs font-semibold text-sky-400">
          Tap for full details
        </Text>
      </View>
    </Pressable>
  );
}
