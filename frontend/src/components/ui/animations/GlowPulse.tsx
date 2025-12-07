// Looping glow/scale animation wrapper for icons or buttons.

import { MotiView } from "moti";

// This function is responsible for applying a pulsing glow effect.
export function GlowPulse({ children }: { children: React.ReactNode }) {
  return (
    <MotiView
      // Start slightly smaller and dimmer.
      from={{ opacity: 0.85, scale: 0.92 }}
      // Pulse to a brighter and larger state.
      animate={{ opacity: 1, scale: 1.08 }}
      transition={{
        loop: true, // Keeps the animation running.
        type: "timing",
        duration: 550,
      }}
      className="items-center justify-center"
    >
      {children}
    </MotiView>
  );
}
