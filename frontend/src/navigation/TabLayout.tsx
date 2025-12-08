import React from "react";
import { Tabs } from "expo-router";
import { useTheme } from "@/src/context/ThemeContext";
import { CustomTabBar } from "@/src/navigation/CustomTabBar";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.tabBarInactive,
      }}
    >
      <Tabs.Screen name="home/index" options={{ title: "Home" }} />
      <Tabs.Screen name="ai/index" options={{ title: "AI Picks" }} />
      <Tabs.Screen name="watchlist/index" options={{ title: "Watchlist" }} />
      <Tabs.Screen name="settings/index" options={{ title: "Settings" }} />
    </Tabs>
  );
}
