import { Text, View, ViewProps } from "react-native";

interface ChipProps extends ViewProps {
  label: string;
  className?: string;
  textClassName?: string;
}

// Brukes til små tags som sjanger, maturity labels og badges generelt.
export function Chip({ label, className = "", textClassName = "", ...rest }: ChipProps) {
  return (
    <View
      {...rest}
      className={`px-3 py-1 rounded-full bg-gray-200 mr-2 mb-2 ${className}`}
    >
      {/* Teksten inni selve chip/badge */}
      <Text className={`text-xs font-semibold text-gray-900 ${textClassName}`}>
        {label}
      </Text>
    </View>
  );
}
