/**
 * MovieActionButton
 * Watchlist + Play Trailer row with simple animations.
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
  // Scale animation for the bookmark icon
  const favIconScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isFavorite) {
      Animated.sequence([
        Animated.spring(favIconScale, {
          toValue: 1.18,
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

  return (
    <View className="mt-6 mb-2 flex-row items-center gap-3">
      {/* Watchlist button – outline pill */}
      <View className="flex-1 h-12">
        <UIButton
          label={isFavorite ? "Remove from watchlist" : "Add to watchlist"}
          loading={favLoading}
          onPress={onToggleFavorite}
          variant="outline"
          hapticStyle="medium"
          fullWidth
          className="h-full border-white/15 bg-white/5 shadow-lg shadow-black/40"
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
      </View>

      {/* Trailer button – EXACT same pill style, no green box */}
      {trailerKey && (
        <View className="flex-1 h-12">
          <UIButton
            label="Play trailer"
            onPress={() =>
              Linking.openURL(`https://www.youtube.com/watch?v=${trailerKey}`)
            }
            variant="outline"
            hapticStyle="light"
            fullWidth
            className="h-full border-white/15 bg-white/5 shadow-lg shadow-black/40"
            leftIcon={<Play size={18} color="#ffffff" weight="fill" />}
          />
        </View>
      )}
    </View>
  );
}
