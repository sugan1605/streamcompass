import React from "react";
import { Pressable, PressableProps, View } from "react-native";

type PowerButtonProps = {
  onPress?: () => void;
} & Omit<PressableProps, "onPress">;

// Round yellow power icon button
export function PowerButton({ onPress, ...rest }: PowerButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="h-10 w-10 items-center justify-center rounded-full bg-amber-400 shadow shadow-amber-900/60"
      {...rest}
    >
      {/* Power icon */}
      <View className="relative h-6 w-6 items-center justify-center">
        {/* Circular ring */}
        <View className="h-6 w-6 rounded-full border-2 border-white opacity-90" />
        {/* Top notch */}
        <View className="absolute -top-1 h-3 w-[2px] rounded-full bg-white" />
      </View>
    </Pressable>
  );
}
