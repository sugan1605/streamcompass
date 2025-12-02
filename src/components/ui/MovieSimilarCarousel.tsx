/**
 * MovieSimilarCarousel
 * Horizontal snapping list of similar movies.
 * Uses MovieCard for each item.
 */

import React from "react";
import { View, ScrollView } from "react-native";
import { Movie } from "@/src/types/movies";
import { MovieCard } from "@/src/components/MovieCard";
import { UISkeleton } from "./UISkeleton";

const CARD_WIDTH = 260;

type Props = {
  movies: Movie[];
};

export function MovieSimilarCarousel({ movies }: Props) {
  if (!movies.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={CARD_WIDTH + 16}
      snapToAlignment="start"
      contentContainerStyle={{ paddingVertical: 8 }}
    >
      {movies.map((m) => (
        <View key={m.id} style={{ width: CARD_WIDTH, marginRight: 16 }}>
          <MovieCard movie={m} />
        </View>
      ))}
    </ScrollView>
  );
}

/**
 * MovieSimilarCarouselSkeleton
 * Shimmer placeholders for similar movie cards while loading.
 */
export function MovieSimilarCarouselSkeleton() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={CARD_WIDTH + 16}
      snapToAlignment="start"
      contentContainerStyle={{ paddingVertical: 8 }}
    >
      {[...Array(4)].map((_, idx) => (
        <View key={idx} style={{ width: CARD_WIDTH, marginRight: 16 }}>
          <UISkeleton height={160} radius={20} />
          <View className="mt-2" />
          <UISkeleton width={180} height={14} radius={4} />
          <View className="mt-1" />
          <UISkeleton width={120} height={14} radius={4} />
        </View>
      ))}
    </ScrollView>
  );
}
