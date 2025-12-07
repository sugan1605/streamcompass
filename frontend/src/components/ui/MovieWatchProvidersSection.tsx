/**
 * MovieWatchProvidersSection
 * Shows streaming, renting, and buying availability from TMDB providers.
 * Uses UIBadge + provider logos.
 */

import { View, Text, Image } from "react-native";
import { UIBadge } from "@/src/components/ui/UIBadge";
import { TMDB_CONFIG } from "@/src/config/tmdb";
import { WatchProviders } from "@/src/types/movies";

type Props = {
  providers: WatchProviders;
};

export function MovieWatchProvidersSection({ providers }: Props) {
  return (
    <View className="mt-6">
      <Text className="mb-3 text-base font-semibold text-slate-50">
        Where to watch
      </Text>

      {/* STREAM */}
      {providers.stream.length > 0 && (
        <View className="mb-3 flex-row items-start">
          <Text className="mt-1 w-16 text-sm font-semibold text-slate-300">
            Stream
          </Text>
          <View className="flex-1 flex-row flex-wrap">
            {providers.stream.map((p) => (
              <UIBadge
                key={p.id ?? p.name}
                label={p.name}
                variant="muted"
                size="md"
                className="mr-2 mb-2 flex-row items-center"
                leftIcon={
                  p.logoPath ? (
                    <Image
                      source={{
                        uri: `${TMDB_CONFIG.imageBaseUrl}${p.logoPath}`,
                      }}
                      className="h-5 w-5 rounded bg-slate-800"
                    />
                  ) : undefined
                }
              />
            ))}
          </View>
        </View>
      )}

      {/* RENT */}
      {providers.rent.length > 0 && (
        <View className="mb-3 flex-row items-start">
          <Text className="mt-1 w-16 text-sm font-semibold text-slate-300">
            Rent
          </Text>
          <View className="flex-1 flex-row flex-wrap">
            {providers.rent.map((p) => (
              <UIBadge
                key={p.id ?? p.name}
                label={p.name}
                variant="muted"
                size="md"
                className="mr-2 mb-2 flex-row items-center"
                leftIcon={
                  p.logoPath ? (
                    <Image
                      source={{
                        uri: `${TMDB_CONFIG.imageBaseUrl}${p.logoPath}`,
                      }}
                      className="h-5 w-5 rounded bg-slate-800"
                    />
                  ) : undefined
                }
              />
            ))}
          </View>
        </View>
      )}

      {/* BUY */}
      {providers.buy.length > 0 && (
        <View className="flex-row items-start">
          <Text className="mt-1 w-16 text-sm font-semibold text-slate-300">
            Buy
          </Text>
          <View className="flex-1 flex-row flex-wrap">
            {providers.buy.map((p) => (
              <UIBadge
                key={p.id ?? p.name}
                label={p.name}
                variant="muted"
                size="md"
                className="mr-2 mb-2 flex-row items-center"
                leftIcon={
                  p.logoPath ? (
                    <Image
                      source={{
                        uri: `${TMDB_CONFIG.imageBaseUrl}${p.logoPath}`,
                      }}
                      className="h-5 w-5 rounded bg-slate-800"
                    />
                  ) : undefined
                }
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
