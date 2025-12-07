import { Image, Text, View } from "react-native";

interface ProviderBadgeProps {
  name: string;
  logoUri?: string | null;
}

/**
 * Brukes under "Where to watch" for Stream / Rent / Buy.
 * Viser en liten "pille" med optional logo + navn på tjenesten.
 */
export function ProviderBadge({ name, logoUri }: ProviderBadgeProps) {
  return (
    <View className="flex-row items-center px-3 py-1.5 rounded-full bg-gray-200 mr-2 mb-2">
      {/* Logo hvis TMDB gir oss en logoPath */}
      {logoUri && (
        <Image
          source={{ uri: logoUri }}
          className="w-4 h-4 rounded mr-2 bg-gray-900"
        />
      )}

      {/* Navn på tjenesten */}
      <Text className="text-xs font-semibold text-gray-900">{name}</Text>
    </View>
  );
}
