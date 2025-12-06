// Lightweight animated shimmer skeleton for loading states

import React, { useEffect, useRef } from "react";
import { View, Animated, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

interface UISkeletonProps {
  width?: number;      // optional, numeric width only
  height: number;      // required height
  radius?: number;     // border radius
  className?: string;
}

export function UISkeleton({
  width,
  height,
  radius = 12,
  className,
}: UISkeletonProps) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );

    loop.start();
    return () => {
      loop.stop();
    };
  }, [shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const baseStyle: ViewStyle = {
    height,
    borderRadius: radius,
    overflow: "hidden",
    backgroundColor: "#0f172a", // slate-950-ish
  };

  return (
    <View
      className={className}
      style={[
        baseStyle,
        width != null ? { width } : { alignSelf: "stretch" },
      ]}
    >
      {/* base layer */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#1f2937", // slate-800-ish
        }}
      />

      {/* shimmer overlay */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 200,
          transform: [{ translateX }],
          opacity: 0.9,
        }}
      >
        <AnimatedGradient
          colors={["transparent", "rgba(148,163,184,0.5)", "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}
