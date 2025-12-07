// Tiny confetti explosion animation for success feedback.

import { View } from "react-native";
import { MotiView } from "moti";

// This type controls when the confetti burst should replay.
export type ConfettiBurstProps = {
  burstKey: number; // Increment this to trigger a new burst
};

// This function is responsible for rendering the confetti burst.
export function ConfettiBurst({ burstKey }: ConfettiBurstProps) {
  // Each particle has its own offset, delay and color.
  const particles = [
    { dx: -18, delay: 0, color: "#fbbf24" },
    { dx: 0, delay: 70, color: "#22c55e" },
    { dx: 18, delay: 120, color: "#38bdf8" },
  ];

  return (
    // Centers the confetti around the button area.
    <View className="absolute inset-0 items-center justify-center">
      {particles.map((p, idx) => (
        <MotiView
          // Using burstKey in the key lets us replay the animation.
          key={`${burstKey}-${idx}`}
          from={{
            opacity: 1,
            translateY: 0,
            scale: 0.6,
          }}
          animate={{
            opacity: 0,
            translateY: -42,
            translateX: p.dx,
            scale: 1.25,
          }}
          transition={{
            type: "timing",
            duration: 1100,
            delay: p.delay,
          }}
          // Single confetti dot.
          className="absolute w-3.5 h-3.5 rounded-full"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </View>
  );
}
