/**
 * UILineDivider
 * Simple horizontal divider for visual separation between sections.
 */

import React from "react";
import { View } from "react-native";

type UILineDividerProps = {
  className?: string;
};

export function UILineDivider({ className }: UILineDividerProps) {
  const composedClassName = [
    "h-px bg-slate-800/80",
    className ?? "my-6",
  ]
    .join(" ")
    .trim();

  return <View className={composedClassName} />;
}
