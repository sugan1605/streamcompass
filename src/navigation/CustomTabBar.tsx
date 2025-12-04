// Egen tabbar med haptics, lyd og swipe/drag mellom tabs.

import React, { useMemo, useRef, useState } from "react";
import {
  View,
  LayoutChangeEvent,
  PanResponder,
  GestureResponderEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { House, Sparkle, BookmarkSimple, GearSix } from "phosphor-react-native";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/src/context/ThemeContext";
import { useSoundSettings } from "@/src/context/SoundContext";
import { TabButton } from "../components/ui/TabButton";

// Ikon-map for hver tab-route
const ICON_MAP: Record<string, React.ElementType> = {
  "home/index": House,
  "ai/index": Sparkle,
  "watchlist/index": BookmarkSimple,
  "settings/index": GearSix,
};

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { soundEnabled, playClick } = useSoundSettings();

  const [barWidth, setBarWidth] = useState(0);

  // Filtrerer vekk routes som ikke skal vises i tab-baren
  const visibleRoutes = useMemo(
    () =>
      state.routes.filter((route) => {
        const { options } = descriptors[route.key];

        // Skjuler ruter som eksplisitt har skrudd av tabBarButton
        if (options.tabBarButton === null) return false;

        // Movie/person detaljer skal ikke ha egne tabs
        if (route.name === "movie/[id]" || route.name === "person/[id]") {
          return false;
        }

        return true;
      }),
    [state.routes, descriptors]
  );

  const tabCount = visibleRoutes.length;

  const handleLayout = (e: LayoutChangeEvent) => {
    setBarWidth(e.nativeEvent.layout.width);
  };

  // Velger tab ut fra index i visibleRoutes
  const selectByVisibleIndex = (visibleIndex: number) => {
    const route = visibleRoutes[visibleIndex];
    if (!route) return;

    const globalIndex = state.routes.indexOf(route);
    const isFocused = state.index === globalIndex;
    if (isFocused) return;

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.name as never);

      // Haptics + lyd ved tab-skifte
      Haptics.selectionAsync().catch(() => {});
      if (soundEnabled) {
        playClick().catch(() => {});
      }
    }
  };

  // Regner ut hvilken tab brukeren er over basert på X-posisjon
  const getIndexFromX = (x: number) => {
    if (!barWidth || !tabCount) return null;

    const raw = (x / barWidth) * tabCount;
    const idx = Math.min(tabCount - 1, Math.max(0, Math.floor(raw)));
    return idx;
  };

  // PanResponder for å kunne dragge/sveipe over tabs
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const x = evt.nativeEvent.locationX;
        const idx = getIndexFromX(x);
        if (idx !== null) selectByVisibleIndex(idx);
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const x = evt.nativeEvent.locationX;
        const idx = getIndexFromX(x);
        if (idx !== null) selectByVisibleIndex(idx);
      },
      onPanResponderRelease: () => {},
      onPanResponderTerminationRequest: () => true,
      onPanResponderTerminate: () => {},
    })
  ).current;

  return (
    <View
      className="absolute left-0 right-0"
      style={{ bottom: Math.max(insets.bottom, 12) }}
    >
      <View
        onLayout={handleLayout}
        {...panResponder.panHandlers}
        className="mx-4 flex-row items-center bg-slate-950/95"
        style={{
          borderRadius: 999,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.tabBarBackground,
          shadowColor: "#000",
          shadowOpacity: 0.35,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 16,
        }}
      >
        {visibleRoutes.map((route, visibleIndex) => {
          const globalIndex = state.routes.indexOf(route);
          const isFocused = state.index === globalIndex;

          const Icon = ICON_MAP[route.name] ?? House;
          const onPress = () => selectByVisibleIndex(visibleIndex);

          return (
            <TabButton
              key={route.key}
              focused={isFocused}
              onPress={onPress}
              Icon={Icon}
              accentColor={colors.accent}
              inactiveColor={colors.tabBarInactive}
            />
          );
        })}
      </View>
    </View>
  );
}
