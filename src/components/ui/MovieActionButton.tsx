/**
 * MovieActionButton
 * Watchlist + Play Trailer action row.
 * Includes animations, haptic feedback, and glowing trailer button.
 */

import React, { useRef, useEffect } from "react";
import { View, Animated, Linking } from "react-native";
import { Bookmark, BookmarkSimple, Play } from "phosphor-react-native";

import { UIButton } from "@/src/components/ui/UIButton";

type Props = {
  isFavorite: boolean;
  favLoading: boolean;
  onToggleFavorite: () => void;
  trailerKey?: string | null;
};

export function MovieActionButton({
  isFavorite,
  favLoading,
  onToggleFavorite,
  trailerKey,
}: Props) {
  const favIconScale = useRef(new Animated.Value(1)).current;
  const trailerGlow = useRef(new Animated.Value(0)).current;

  // 🔁 Soft glow loop for trailer button
  useEffect(() => {
    if (!trailerKey) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(trailerGlow, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(trailerGlow, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [trailerKey, trailerGlow]);

  // ⭐ Bounce animation for bookmark icon when added
  useEffect(() => {
    if (isFavorite) {
      Animated.sequence([
        Animated.spring(favIconScale, {
          toValue: 1.2,
          speed: 40,
          bounciness: 6,
          useNativeDriver: true,
        }),
        Animated.spring(favIconScale, {
          toValue: 1,
          speed: 40,
          bounciness: 6,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFavorite, favIconScale]);

  const glowScale = trailerGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });

  return (
    <View className="mt-6 mb-2 flex-row items-center gap-3">
      {/* Watchlist button */}
      <UIButton
        label={isFavorite ? "Remove from watchlist" : "Add to watchlist"}
        loading={favLoading}
        onPress={onToggleFavorite}
        variant="outline"
        hapticStyle="medium"
        fullWidth
        className="border-white/15 bg-white/5 shadow-lg shadow-black/40"
        leftIcon={
          <Animated.View style={{ transform: [{ scale: favIconScale }] }}>
            {isFavorite ? (
              <Bookmark size={18} color="#ffffff" weight="fill" />
            ) : (
              <BookmarkSimple size={18} color="#ffffff" weight="bold" />
            )}
          </Animated.View>
        }
      />

      {/* Trailer button */}
      {trailerKey && (
        <View className="flex-1 h-12">
          {/* 🌟 Soft animated glow behind the button */}
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              opacity: trailerGlow,
              transform: [{ scale: glowScale }],
            }}
            className="rounded-full bg-emerald-500/25"
          />

          <UIButton
            label="Play trailer"
            onPress={() =>
              Linking.openURL(`https://www.youtube.com/watch?v=${trailerKey}`)
            }
            variant="gradient"
            gradientColors={["#22c55e", "#16a34a"]}
            hapticStyle="light"
            fullWidth
            className="shadow-lg shadow-emerald-500/40 h-full"
            leftIcon={<Play size={18} color="#071017" weight="fill" />}
          />
        </View>
      )}
    </View>
  );
}
