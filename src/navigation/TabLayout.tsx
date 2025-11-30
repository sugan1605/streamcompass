// src/navigation/TabLayout.tsx
import React from "react";
import { Tabs } from "expo-router";

import { useTheme } from "@/src/context/ThemeContext";
import { CustomTabBar } from "@/src/components/ui/CustomTabBar";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      // vår custom, flytende tabbar
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // vi bruker kun ikoner
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.tabBarInactive,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="ai"
        options={{
          title: "AI Picks",
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Watchlist",
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />

      {/* detaljsider skal ikke ha egen tab */}
      <Tabs.Screen name="movie/[id]" options={{ href: null }} />
      <Tabs.Screen name="person/[id]" options={{ href: null }} />
    </Tabs>
  );
}
