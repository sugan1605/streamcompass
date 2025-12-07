/**
 * MovieMetaInfo
 * Displays genres, runtime, year and maturity label for a movie.
 */

import React from "react";
import { View, Text } from "react-native";
import { UIBadge } from "./UIBadge";

type MovieMetaInfoProps = {
  genres?: string[];
  runtimeMinutes: number;
  year: number;
  maturityLabel?: string | null;
};

export function MovieMetaInfo({
  genres = [],
  runtimeMinutes,
  year,
  maturityLabel,
}: MovieMetaInfoProps) {
  return (
    <View className="mt-5">
      <Text className="mb-2 text-base font-semibold text-slate-50">
        More info
      </Text>

      {genres.length > 0 && (
        <View className="mt-1 flex-row flex-wrap">
          {genres.map((g) => (
            <UIBadge
              key={g}
              label={g}
              variant="default"
              size="md"
              className="mr-2 mb-2"
            />
          ))}
        </View>
      )}

      <View className="mt-2 flex-row items-center">
        {runtimeMinutes > 0 && (
          <Text className="mr-3 text-xs text-slate-300">
            {runtimeMinutes} min
          </Text>
        )}
        {year > 0 && (
          <Text className="mr-3 text-xs text-slate-300">
            • {year}
          </Text>
        )}
        {maturityLabel && (
          <UIBadge
            label={maturityLabel}
            variant="outline"
            size="sm"
            className="ml-1"
          />
        )}
      </View>
    </View>
  );
}
