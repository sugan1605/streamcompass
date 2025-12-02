/**
 * UIBadge
 * Small pill-shaped label used for tags, genres, and metadata.
 * Supports variants (default, outline, muted) and optional icons.
 */

import React, { ReactNode } from "react";
import { View, Text } from "react-native";

type UIBadgeProps = {
  label: string;
  leftIcon?: ReactNode;
  variant?: "default" | "outline" | "muted" | "success" | "danger";
  className?: string;
  size?: "sm" | "md";
};

export function UIBadge({
  label,
  leftIcon,
  variant = "default",
  className,
  size = "md",
}: UIBadgeProps) {
  let variantClass = "";
  let textClass = "";

  switch (variant) {
    case "default":
      variantClass = "bg-slate-800/90 border border-slate-700/80";
      textClass = "text-slate-100";
      break;
    case "outline":
      variantClass = "bg-transparent border border-slate-400/70";
      textClass = "text-slate-50";
      break;
    case "muted":
      variantClass = "bg-slate-800/70";
      textClass = "text-slate-300";
      break;
    case "success":
      variantClass = "bg-emerald-600/90 border border-emerald-400/70";
      textClass = "text-emerald-50";
      break;
    case "danger":
      variantClass = "bg-red-600/90 border border-red-400/70";
      textClass = "text-red-50";
      break;
  }

  const sizeClass =
    size === "sm"
      ? "px-2 py-0.5"
      : "px-3 py-1";

  const textSizeClass = size === "sm" ? "text-[11px]" : "text-xs";

  const composedClassName = [
    "flex-row items-center rounded-full",
    sizeClass,
    variantClass,
    className ?? "",
  ]
    .join(" ")
    .trim();

  return (
    <View className={composedClassName}>
      {leftIcon && <View className="mr-1.5">{leftIcon}</View>}
      <Text className={`${textSizeClass} font-semibold ${textClass}`}>
        {label}
      </Text>
    </View>
  );
}
