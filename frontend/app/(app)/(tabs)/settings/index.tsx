// Settings screen: theme toggle + optional UI sound effects.

import React from "react";
import { View, Text, Switch, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/src/context/ThemeContext";
import { useSoundSettings } from "@/src/context/SoundContext";

export default function SettingsScreen() {
  const { themeName, toggleTheme, colors } = useTheme();
  const { soundEnabled, toggleSound } = useSoundSettings();

  const isDark = themeName === "dark";

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <Text
          className="mb-6 text-3xl font-bold"
          style={{ color: colors.text }}
        >
          Settings
        </Text>

        <View className="space-y-4">

          {/* ----------------------------------------------------------
            DARK MODE TOGGLE
            Switch between light and dark theme stored in context.
          ----------------------------------------------------------- */}
          <View
            className="flex-row items-center justify-between rounded-2xl px-4 py-4"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
            }}
          >
            <View className="flex-1 pr-4">
              <Text
                className="text-base font-semibold"
                style={{ color: colors.text }}
              >
                Dark mode
              </Text>
              <Text
                className="mt-1 text-xs"
                style={{ color: colors.textSecondary }}
              >
                Switch between light and dark theme.
              </Text>
            </View>

            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: "#334155", // slate-700
                true: colors.accent,
              }}
              thumbColor={isDark ? "#ffffff" : "#e2e8f0"}
            />
          </View>

          {/* ----------------------------------------------------------
            TAB CLICK SOUND
            Enables a subtle sound effect on tab-switch (via SoundContext).
          ----------------------------------------------------------- */}
          <View
            className="flex-row items-center justify-between rounded-2xl px-4 py-4"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
            }}
          >
            <View className="flex-1 pr-4">
              <Text
                className="text-base font-semibold"
                style={{ color: colors.text }}
              >
                Tab click sound
              </Text>
              <Text
                className="mt-1 text-xs"
                style={{ color: colors.textSecondary }}
              >
                Play a subtle sound when navigating between tabs.
              </Text>
            </View>

            <Switch
              value={soundEnabled}
              onValueChange={toggleSound}
              trackColor={{
                false: "#475569", // slate-600
                true: "#22c55e", // emerald-500
              }}
              thumbColor={soundEnabled ? "#ffffff" : "#e2e8f0"}
            />
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
