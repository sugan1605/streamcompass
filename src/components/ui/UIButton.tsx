/**
 * UIButton
 * Main button component for actions and CTAs.
 * Supports solid, outline, ghost, and gradient variants.
 * Optional loading spinner + haptic feedback.
 */


import React, { useRef } from "react";
import type { ReactNode } from "react";
import {
  Text,
  ActivityIndicator,
  Pressable,
  Animated,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type HapticStyle = "none" | "light" | "medium" | "heavy";

export type UIButtonProps = {
  label: string;
  onPress?: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  variant?: "primary" | "outline" | "ghost" | "gradient";
  gradientColors?: [string, string];
  className?: string;
  hapticStyle?: HapticStyle;
  fullWidth?: boolean;
};

export function UIButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  leftIcon,
  variant = "primary",
  gradientColors = ["#22c55e", "#16a34a"],
  className,
  hapticStyle = "none",
  fullWidth = false,
}: UIButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
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

    if (disabled || loading || !onPress) return;

    await triggerHaptics();
    await onPress();
  };

  const baseClass =
    "h-12 flex-row items-center justify-center rounded-full px-4 active:opacity-80";
  let variantClass = "";

  switch (variant) {
    case "outline":
      variantClass = "border border-white/15 bg-white/5";
      break;
    case "ghost":
      variantClass = "bg-white/5";
      break;
    case "primary":
      variantClass = "bg-emerald-500";
      break;
    case "gradient":
      variantClass = "overflow-hidden";
      break;
  }

  const composedClassName = [
    baseClass,
    variantClass,
    fullWidth ? "flex-1" : "",
    disabled ? "opacity-60" : "",
    className ?? "",
  ]
    .join(" ")
    .trim();

  const content = (
    <>
      {leftIcon && !loading && <View className="mr-2">{leftIcon}</View>}

      {loading ? (
        <ActivityIndicator
          color={
            variant === "gradient" || variant === "primary"
              ? "#071017"
              : "#ffffff"
          }
        />
      ) : (
        <Text
          className={
            variant === "gradient" || variant === "primary"
              ? "text-sm font-semibold text-slate-950"
              : "text-sm font-semibold text-white"
          }
        >
          {label}
        </Text>
      )}
    </>
  );

  if (variant === "gradient") {
    return (
      <AnimatedPressable
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ transform: [{ scale }] }}
        className={composedClassName}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="h-full w-full flex-row items-center justify-center px-5"
        >
          {content}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ transform: [{ scale }] }}
      className={composedClassName}
    >
      {content}
    </AnimatedPressable>
  );
}
