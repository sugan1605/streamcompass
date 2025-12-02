/**
 * MovieSummaryCard
 * AI summary section for the movie details screen.
 * Shows CTA button, loading state, error message and AI summary text.
 */

import React from "react";
import { View, Text } from "react-native";
import { UIButton } from "./UIButton";

type MovieSummaryCardProps = {
  summary: string | null;
  loading: boolean;
  error: string | null;
  onAskAI: () => void;
};

export function MovieSummaryCard({
  summary,
  loading,
  error,
  onAskAI,
}: MovieSummaryCardProps) {
  return (
    <View className="mt-4 rounded-2xl border border-emerald-700/50 bg-emerald-900/20 p-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-sm font-semibold text-emerald-100">
            AI summary
          </Text>
          <Text className="mt-1 text-xs text-emerald-200/80">
            Let StreamCompass AI condense this movie into a quick, spoiler-light
            summary.
          </Text>
        </View>
        <UIButton
          label="Ask AI"
          onPress={onAskAI}
          loading={loading}
          disabled={loading}
          variant="gradient"
          gradientColors={["#22c55e", "#16a34a"]}
          hapticStyle="light"
          className="h-9 px-3"
          fullWidth={false}
        />
      </View>

      {error && (
        <Text className="mt-2 text-xs text-red-400">
          {error}
        </Text>
      )}

      {summary && (
        <Text className="mt-2 text-xs leading-4 text-emerald-50">
          {summary}
        </Text>
      )}
    </View>
  );
}
