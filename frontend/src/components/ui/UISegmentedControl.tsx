/**
 * UISegmentedControl
 * Reusable horizontal option switcher.
 * Used for filtering, sorting, or mode switching.
 * Supports multiple sizes (sm/md) and full customization.
 */

import React from "react";
import { View, Pressable, Text } from "react-native";
import * as Haptics from "expo-haptics";

type SegmentedOption = {
  value: string;
  label: string;
};

type UISegmentedControlProps = {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  size?: "sm" | "md";
};

export function UISegmentedControl({
  options,
  value,
  onChange,
  className,
  size = "md",
}: UISegmentedControlProps) {
  const containerClassName = [
    "flex-row flex-wrap",
    className ?? "",
  ]
    .join(" ")
    .trim();

  const paddingClass =
    size === "sm" ? "px-2.5 py-1" : "px-3 py-1";

  const textSizeClass = size === "sm" ? "text-[11px]" : "text-xs";

  const handlePress = async (val: string) => {
    if (val === value) return;
    await Haptics.selectionAsync();
    onChange(val);
  };

  return (
    <View className={containerClassName}>
      {options.map((opt) => {
        const active = opt.value === value;

        const pillClass = [
          "mr-2 mb-2 rounded-full",
          paddingClass,
          active ? "bg-slate-100" : "bg-slate-800/80",
        ]
          .join(" ")
          .trim();

        const textClass = [
          textSizeClass,
          "font-semibold",
          active ? "text-slate-900" : "text-slate-100",
        ]
          .join(" ")
          .trim();

        return (
          <Pressable
            key={opt.value}
            onPress={() => handlePress(opt.value)}
            className={pillClass}
          >
            <Text className={textClass}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
