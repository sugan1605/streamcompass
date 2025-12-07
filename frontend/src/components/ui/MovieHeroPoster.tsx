/**
 * MovieHeroPoster
 * Displays the large hero poster with gradient overlay, title, rating badge.
 * Includes fade-in animation and dynamic TMDB poster rendering.
 */

import { View, Text, ImageBackground, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TMDB_CONFIG } from "@/src/config/tmdb";
import { getScoreColor } from "@/src/utils/getScoreColor";

export function MovieHeroPoster({
  posterUri,
  rating,
  title,
  year,
  runtimeMinutes,
  posterOpacity,
}: {
  posterUri: string;
  rating: number;
  title: string;
  year: number;
  runtimeMinutes: number;
  posterOpacity: Animated.Value;
}) {
  return (
    <View className="mb-6 overflow-hidden rounded-3xl">
      <Animated.View style={{ opacity: posterOpacity }}>
        <ImageBackground
          source={{ uri: posterUri }}
          className="w-full h-[420px] justify-end bg-black"
          imageStyle={{ borderRadius: 24 }}
        >
          <LinearGradient
            colors={["rgba(15,23,42,0.1)", "rgba(15,23,42,0.95)"]}
            className="absolute inset-0"
          />

          {rating > 0 && (
            <View
              className="absolute left-5 top-5 rounded-full px-3 py-1"
              style={{ backgroundColor: getScoreColor(rating) }}
            >
              <Text className="text-sm font-bold text-slate-50">
                ★ {rating.toFixed(1)}
              </Text>
            </View>
          )}

          <View className="mt-auto px-5 pb-6">
            <Text className="text-3xl font-extrabold text-slate-50">
              {title}
            </Text>
            <Text className="mt-1 text-sm text-slate-300">
              {year > 0 ? year : ""}
              {runtimeMinutes > 0 ? ` · ${runtimeMinutes} min` : ""}
            </Text>
          </View>
        </ImageBackground>
      </Animated.View>
    </View>
  );
}
