import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

type Variant = "primary" | "danger";

interface ActionButtonProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  variant?: Variant;
  onPress: () => void;
}

export function ActionButton({
  label,
  iconName,
  variant = "primary",
  onPress,
}: ActionButtonProps) {
  const baseClasses =
    "flex-1 h-12 rounded-full flex-row items-center justify-center";

  const variantClasses =
    variant === "primary"
      ? "bg-emerald-500 active:bg-emerald-600 shadow-lg shadow-emerald-900/40"
      : "bg-red-500 active:bg-red-600 shadow-lg shadow-red-900/40";

  const textClasses = "text-white font-semibold text-[15px]";

  return (
    <Pressable
      onPress={onPress}
      className={`${baseClasses} ${variantClasses}`}
      android_ripple={{ color: "rgba(255,255,255,0.1)", borderless: false }}
    >
      <Ionicons
        name={iconName}
        size={18}
        color="#fff"
        style={{ marginRight: 8 }}
      />
      <Text className={textClasses}>{label}</Text>
    </Pressable>
  );
}
