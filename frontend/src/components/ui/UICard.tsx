/**
 * UICard
 * Base container with rounded corners and subtle elevation.
 * Used to group related UI content (movie details, sections, etc.).
 */

import React, { ReactNode } from "react";
import { View, Pressable } from "react-native";

type UICardProps = {
  children: ReactNode;
  className?: string;
  onPress?: () => void | Promise<void>;
  variant?: "elevated" | "outline" | "subtle";
};

export function UICard({
  children,
  className,
  onPress,
  variant = "elevated",
}: UICardProps) {
  let variantClass = "";

  switch (variant) {
    case "elevated":
      variantClass =
        "bg-slate-900/95 rounded-3xl shadow-lg shadow-black/40 border border-slate-800/60";
      break;
    case "outline":
      variantClass =
        "bg-slate-900/70 rounded-2xl border border-slate-700/80";
      break;
    case "subtle":
      variantClass = "bg-slate-900/60 rounded-2xl";
      break;
  }

  const composedClassName = [variantClass, className ?? ""]
    .join(" ")
    .trim();

  if (onPress) {
    return (
      <Pressable onPress={onPress} className={composedClassName}>
        {children}
      </Pressable>
    );
  }

  return <View className={composedClassName}>{children}</View>;
}
