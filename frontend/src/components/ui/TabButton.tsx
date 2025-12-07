import React from "react";
import { Pressable, View } from "react-native";
import { useSoundSettings } from "@/src/context/SoundContext";

type TabButtonProps = {
  focused: boolean;
  onPress: () => void;
  Icon: React.ElementType;
  accentColor: string;
  inactiveColor: string;
};

/**
 * Custom tab button brukt i bunnen:
 * Håndterer fokusert-state, ikon-farge og click-sound.
 * Gjør at hvert tab ser konsistent ut i CustomTabBar.
 */
export function TabButton({
  focused,
  onPress,
  Icon,
  accentColor,
  inactiveColor,
}: TabButtonProps) {
  const { playClick, soundEnabled } = useSoundSettings();

  // Ikon-farge → accent ved fokus, ellers blek
  const tint = focused ? accentColor : inactiveColor;

  // Bakgrunn for aktiv tab (subtil glow)
  const bgClass = focused ? "bg-slate-800/80" : "bg-transparent";

  return (
    <Pressable
      onPress={() => {
        // Spill lyd hvis det er aktivert i settings
        if (soundEnabled) playClick();
        onPress();
      }}
      className={`flex-1 items-center justify-center rounded-full py-2 active:opacity-70 ${bgClass}`}
    >
      {/* Ikonet i midten */}
      <View className="items-center justify-center">
        <Icon width={22} height={22} fill={tint} />
      </View>
    </Pressable>
  );
}
