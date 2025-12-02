/**
 * UIIconButton
 * Reusable circular icon-only button.
 * Supports size, variants (ghost/solid), and haptics.
 * Used for navigation actions (back, close, etc.).
 */

import React, { useRef } from "react";
import type { ReactNode } from "react";
import { Pressable, Animated, View } from "react-native";
import * as Haptics from "expo-haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type HapticStyle = "none" | "light" | "medium" | "heavy";

type UIIconButtonProps = {
  icon: ReactNode;
  onPress?: () => void | Promise<void>;
  size?: number; // total button size (width/height)
  variant?: "ghost" | "solid" | "outline";
  className?: string;
  hapticStyle?: HapticStyle;
  disabled?: boolean;
};

export function UIIconButton({
  icon,
  onPress,
  size = 40,
  variant = "ghost",
  className,
  hapticStyle = "light",
  disabled = false,
}: UIIconButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const triggerHaptics = async () => {
    switch (hapticStyle) {
      case "light":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "none":
      default:
        return;
    }
  };

  const handlePressOut = async () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    if (!onPress || disabled) return;
    await triggerHaptics();
    await onPress();
  };

  let variantClass = "";

  switch (variant) {
    case "ghost":
      variantClass = "bg-slate-900/70";
      break;
    case "solid":
      variantClass = "bg-slate-100";
      break;
    case "outline":
      variantClass = "bg-slate-900/60 border border-slate-600";
      break;
  }

  const composedClassName = [
    "items-center justify-center rounded-full active:opacity-80 shadow-md shadow-black/40",
    variantClass,
    disabled ? "opacity-60" : "",
    className ?? "",
  ]
    .join(" ")
    .trim();

  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ transform: [{ scale }], width: size, height: size }}
      className={composedClassName}
    >
      <View>{icon}</View>
    </AnimatedPressable>
  );
}
