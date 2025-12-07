// Round glassy container for icons (blur + subtle border).

import { View } from "react-native";

// This function wraps an icon in a glassy circular background.
export function GlassyIcon({ children }: { children: React.ReactNode }) {
  return (
    <View
      className="
        w-12 h-12 rounded-full
        bg-white/10
        border border-white/20
        backdrop-blur-md
        shadow-lg
        items-center justify-center
      "
    >
      {children}
    </View>
  );
}
