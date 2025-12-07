// Swipeable row: swipe left to reveal an "Add to watchlist" action.
// Includes haptics, confetti, glassy icon and glow effect.

import React, { ReactNode, useRef, useState } from "react";
import { View, Pressable } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { BookmarkSimple, CheckCircle } from "phosphor-react-native";
import * as Haptics from "expo-haptics";

import { GlassyIcon } from "../ui/GlassyIcon";
import { GlowPulse } from "../ui/animations/GlowPulse";
import { ConfettiBurst } from "../ui/animations/ConfettiBurst"

type SwipeableRowProps = {
  children: ReactNode;
  onPrimaryAction: () => void | Promise<void>;
  active?: boolean; // Shows filled bookmark when already in watchlist
};

// This function is responsible for wrapping each movie card in a swipeable row.
export function SwipeableRow({
  children,
  onPrimaryAction,
  active = false,
}: SwipeableRowProps) {
  // Ref for controlling the Swipeable instance.
  const swipeableRef = useRef<any>(null);

  // Controls whether we show bookmark or check icon.
  const [iconPhase, setIconPhase] = useState<"bookmark" | "check">("bookmark");

  // Triggers a new confetti burst when incremented.
  const [burstKey, setBurstKey] = useState(0);

  // Handles tap on the green add-to-watchlist button.
  const handleActionPress = () => {
    // Trigger a medium haptic feedback.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Switch icon to checkmark.
    setIconPhase("check");

    // Trigger confetti burst animation.
    setBurstKey((k) => k + 1);

    (async () => {
      // Give the user time to see confetti + check.
      await new Promise((res) => setTimeout(res, 850));

      // Close the swipeable row.
      swipeableRef.current?.close?.();

      // Call the parent handler (e.g. add to Firebase watchlist).
      await onPrimaryAction();

      // Switch back to bookmark icon.
      setIconPhase("bookmark");
    })();
  };

  // Renders the right-side swipe action (green watchlist button).
  const renderRightActions = () => (
    <View className="flex-row h-full overflow-visible">
      {/* Confetti overlay above the button. */}
      <View className="absolute inset-0 z-20 pointer-events-none">
        <ConfettiBurst burstKey={burstKey} />
      </View>

      {/* Green action button that appears on swipe. */}
      <Pressable
        onPress={handleActionPress}
        className="w-24 h-full rounded-l-3xl bg-emerald-600 items-center justify-center shadow-xl shadow-emerald-500/60"
      >
        {/* GlowPulse keeps the icon gently breathing. */}
        <GlowPulse>
          {/* GlassyIcon gives the icon a circular glass look. */}
          <GlassyIcon>
            {iconPhase === "check" ? (
              <CheckCircle size={26} color="#ffffff" weight="fill" />
            ) : (
              <BookmarkSimple
                size={26}
                color="#ffffff"
                weight={active ? "fill" : "regular"}
              />
            )}
          </GlassyIcon>
        </GlowPulse>
      </Pressable>
    </View>
  );

  return (
    // Wrapper around the child row to provide spacing and avoid clipping.
    <View className="mb-4 overflow-visible">
      <ReanimatedSwipeable
        ref={swipeableRef}
        overshootRight={false}
        renderRightActions={renderRightActions}
      >
        {children}
      </ReanimatedSwipeable>
    </View>
  );
}
