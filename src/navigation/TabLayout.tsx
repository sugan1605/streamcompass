// src/navigation/TabLayout.tsx

import React from "react";
import { Tabs } from "expo-router";

import { useTheme } from "@/src/context/ThemeContext";
import { CustomTabBar } from "@/src/navigation/CustomTabBar";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      // Custom floating tab bar
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // we only use icons
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.tabBarInactive,
      }}
    >
      {/* ORDER HERE = ORDER IN TAB BAR */}

      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="ai/index"
        options={{
          title: "AI Picks",
        }}
      />

      <Tabs.Screen
        name="watchlist/index"
        options={{
          title: "Watchlist",
        }}
      />

      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Settings",
        }}
      />

      {/* Detail screens should NOT appear as tabs */}
      <Tabs.Screen name="movie/[id]" options={{ href: null }} />
      <Tabs.Screen name="person/[id]" options={{ href: null }} />
    </Tabs>
  );
}
