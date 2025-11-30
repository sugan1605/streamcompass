// app/index.tsx
import { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { useAuth } from "../src/context/AuthContext";
import { useTheme } from "../src/context/ThemeContext";

// 🔹 Oppdater path hvis logo ligger et annet sted
import Logo from "../assets/images/splash.png";

export default function SplashScreen() {
  const { user, loading } = useAuth();
  const { themeName, colors } = useTheme();
  const isDark = themeName === "dark";

  // Animations
  const outerOpacity = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Play logo + progress animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false, // width kan ikke bruke native driver
      }),
    ]).start();
  }, []);

  // Når auth er klar → fade ut + navigate
  useEffect(() => {
    if (loading) return;

    const timeout = setTimeout(() => {
      // liten haptic “pop” før vi går videre
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

      Animated.timing(outerOpacity, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        if (user) {
          router.replace("/home");
        } else {
          router.replace("/signin");
        }
      });
    }, 1600);

    return () => clearTimeout(timeout);
  }, [loading, user, outerOpacity]);

  // Interpolasjoner
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 220],
  });

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <Animated.View
        style={{ flex: 1, opacity: outerOpacity }}
        className="items-center justify-between pb-6"
      >
        {/* Center content */}
        <View className="flex-1 items-center justify-center">
          {/* Glow circle */}
          <View
            className={`h-52 w-52 items-center justify-center rounded-full ${
              isDark ? "bg-emerald-400/10" : "bg-emerald-500/15"
            }`}
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }}
              className="items-center justify-center"
            >
              {/* Rotating logo */}
              <Animated.Image
                source={Logo}
                style={{
                  width: 160,
                  height: 160,
                  resizeMode: "contain",
                  transform: [{ rotate }],
                }}
              />
            </Animated.View>
          </View>

          {/* App title + tagline */}
          <Animated.View
            style={{ opacity: fadeAnim }}
            className="mt-6 items-center"
          >
            <Text
              className={`text-3xl font-extrabold tracking-tight ${
                isDark ? "text-slate-50" : "text-slate-900"
              }`}
            >
              StreamCompass
            </Text>
            <Text
              className={`mt-1 text-sm ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Smarter picks for every movie night
            </Text>
          </Animated.View>

          {/* Progress bar */}
          <View className="mt-6 h-1.5 w-64 rounded-full bg-slate-800/40 overflow-hidden">
            <Animated.View
              style={{ width: progressWidth }}
              className="h-full rounded-full bg-emerald-500"
            />
          </View>
        </View>

        {/* Footer */}
        <View className="items-center">
          <Text
            className={`text-[11px] ${
              isDark ? "text-slate-500" : "text-slate-500"
            }`}
          >
            Powered by TMDB · AI-driven recommendations
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
