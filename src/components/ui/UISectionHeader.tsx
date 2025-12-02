/**
 * UISectionHeader
 * Section title with optional right-side element (button, segment control).
 * Used to label scrollable sections (Reviews, Cast, Similar Movies).
 */

import React, { ReactNode } from "react";
import { View, Text } from "react-native";

type UISectionHeaderProps = {
  title: string;
  subtitle?: string;
  rightElement?: ReactNode;
  className?: string;
};

export function UISectionHeader({
  title,
  subtitle,
  rightElement,
  className,
}: UISectionHeaderProps) {
  const containerClass = [
    "mb-3 flex-row items-center justify-between",
    className ?? "",
  ]
    .join(" ")
    .trim();

  return (
    <View className={containerClass}>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-slate-50">
          {title}
        </Text>
        {subtitle && (
          <Text className="mt-0.5 text-xs text-slate-400">
            {subtitle}
          </Text>
        )}
      </View>

      {rightElement && <View className="ml-3">{rightElement}</View>}
    </View>
  );
}
