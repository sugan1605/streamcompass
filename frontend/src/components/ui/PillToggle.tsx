import { Pressable, Text } from "react-native";

interface PillToggleProps {
  label: string;
  active?: boolean;
  onPress: () => void;
  className?: string;
}

// Brukes til små filter-knapper: "Recent", "Rating", "All", "Positive", osv.
export function PillToggle({
  label,
  active = false,
  onPress,
  className = "",
}: PillToggleProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-3 py-1 rounded-full mr-2 mb-2 ${
        active ? "bg-gray-900" : "bg-gray-200"
      } ${className}`}
    >
      {/* Teksten inni pill-knappen */}
      <Text
        className={`text-xs font-semibold ${
          active ? "text-gray-50" : "text-gray-900"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
