import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { ReviewItemProps } from "@/src/types/movies";

/**
 * ReviewItem:
 * Viser en bruker-anmeldelse med forfatter, rating, dato og tekst.
 * Har også "show more" toggle for lange anmeldelser.
 */
export function ReviewItem({ author, rating, content, createdAt }: ReviewItemProps) {
  const [expanded, setExpanded] = useState(false);

  const MAX_LENGTH = 220;
  const isLong = content.length > MAX_LENGTH;
  const preview = isLong ? content.slice(0, MAX_LENGTH) + "..." : content;

  return (
    <View
      className="
        mb-4 rounded-2xl bg-white p-4 
        shadow-sm shadow-black/10
      "
    >
      {/* Forfatter */}
      <Text className="text-sm font-bold text-slate-900">{author}</Text>

      {/* Rating (vises kun hvis den finnes) */}
      {rating !== null && (
        <Text className="mt-1 text-xs font-semibold text-amber-500">
          ★ {rating.toFixed(1)}
        </Text>
      )}

      {/* Dato */}
      <Text className="mt-1 text-[11px] text-slate-500">
        {new Date(createdAt).toLocaleDateString()}
      </Text>

      {/* Selve teksten – truncated eller full */}
      <Text className="mt-2 text-sm leading-5 text-slate-700">
        {expanded ? content : preview}
      </Text>

      {/* Show more / Show less */}
      {isLong && (
        <Pressable onPress={() => setExpanded((v) => !v)}>
          <Text className="mt-2 text-sm font-semibold text-blue-600">
            {expanded ? "Show less" : "Show more"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
