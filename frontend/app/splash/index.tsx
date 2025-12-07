// Splash screen: animated compass logo + auth routing.

import { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { useAuth } from "@/src/context/AuthContext";
import { StreamCompassLogo } from "@/assets/logo/StreamCompassLogo"


export default function SplashScreen() {
  const { user, loading } = useAuth();

  // Fade out container when leaving splash
  const outerOpacity = useRef(new Animated.Value(1)).current;

  // Fade in content
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Pulsating logo (scale)
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Rotation for spin + wiggle
  const rotation = useRef(new Animated.Value(0)).current;

  // Progress bar fill
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Main animation sequence
  useEffect(() => {
    // Pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Intro: fade in + progress + full spin
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1900,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false, // width cannot use native driver
      }),
      Animated.timing(rotation, {
        toValue: 360, // full spin
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) return;

      // Wiggle loop after full spin
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotation, {
            toValue: 372,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: 348,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: 360,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  // Navigate after auth is known
  useEffect(() => {
    if (loading) return;

    const timeout = setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

      Animated.timing(outerOpacity, {
        toValue: 0,
        duration: 260,
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
    }, 2100); // let the animation play a bit

    return () => clearTimeout(timeout);
  }, [loading, user, outerOpacity]);

  // Interpolations
  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1.06],
  });

  const rotate = rotation.interpolate({
    inputRange: [0, 360, 380],
    outputRange: ["0deg", "360deg", "380deg"],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 220],
  });

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: "#020617" }} // fixed background (not theme-dependent)
    >
      <Animated.View
        style={{ flex: 1, opacity: outerOpacity }}
        className="items-center justify-between pb-6"
      >
        {/* Center content */}
        <View className="flex-1 items-center justify-center">
          {/* Glow circle */}
          <View className="h-52 w-52 items-center justify-center rounded-full bg-emerald-500/15">
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ scale }, { rotate }],
              }}
              className="items-center justify-center"
            >
              <StreamCompassLogo width={160} height={160} />
            </Animated.View>
          </View>

          {/* App title + tagline */}
          <Animated.View
            style={{ opacity: fadeAnim }}
            className="mt-6 items-center"
          >
            <Text className="text-3xl font-extrabold tracking-tight text-slate-50">
              StreamCompass
            </Text>
            <Text className="mt-1 text-sm text-slate-400">
              Smarter picks for every movie night
            </Text>
          </Animated.View>

          {/* Progress bar */}
          <View className="mt-6 h-1.5 w-64 rounded-full bg-slate-800/60 overflow-hidden">
            <Animated.View
              style={{ width: progressWidth }}
              className="h-full rounded-full bg-emerald-500"
            />
          </View>
        </View>

        {/* Footer */}
        <View className="items-center">
          <Text className="text-[11px] text-slate-500">
            Powered by TMDB · AI-driven recommendations
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
