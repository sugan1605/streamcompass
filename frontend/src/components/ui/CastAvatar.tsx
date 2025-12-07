/**
 * CastAvatar
 * Circular profile avatar for cast members.
 * Shows actor image, name and character.
 */

import React from "react";
import { View, Text, Pressable, ImageBackground } from "react-native";
import { UISkeleton } from "./UISkeleton";

type CastAvatarProps = {
  name: string;
  character: string;
  profileUri: string | null;
  onPress?: () => void;
};

export function CastAvatar({
  name,
  character,
  profileUri,
  onPress,
}: CastAvatarProps) {
  return (
    <Pressable
      className="mr-4 w-20 items-center"
      onPress={onPress}
      disabled={!onPress}
    >
      {profileUri ? (
        <ImageBackground
          source={{ uri: profileUri }}
          className="w-[70px] h-[70px] rounded-full bg-slate-800 mb-1.5"
          imageStyle={{ borderRadius: 999 }}
        />
      ) : (
        <View className="w-[70px] h-[70px] items-center justify-center rounded-full bg-slate-800 mb-1.5">
          <Text className="text-[10px] text-slate-400">N/A</Text>
        </View>
      )}

      <Text
        numberOfLines={1}
        className="mt-1 text-center text-[11px] font-semibold text-slate-100"
      >
        {name}
      </Text>
      <Text
        numberOfLines={1}
        className="text-center text-[11px] text-slate-400"
      >
        {character}
      </Text>
    </Pressable>
  );
}

/**
 * CastAvatarSkeleton
 * Shimmer placeholder for cast list while loading.
 */
export function CastAvatarSkeleton() {
  return (
    <View className="mr-4 w-20 items-center">
      <UISkeleton width={70} height={70} radius={999} />
      <View className="mt-2" />
      <UISkeleton width={50} height={10} radius={4} />
      <View className="mt-1" />
      <UISkeleton width={40} height={10} radius={4} />
    </View>
  );
}
