
// Simple animated overlay dialog with Close + Undo actions.

import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { UIButton } from "@/src/components/ui/UIButton";
import { MotiView } from "moti";
import * as Haptics from "expo-haptics";

export type UIDialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  primaryLabel: string; // Undo
  onPrimary: () => void | Promise<void>;
  secondaryLabel?: string; // Close
  onSecondary?: () => void;
};

export function UIDialog({
  visible,
  title,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: UIDialogProps) {
  // If dialog is hidden, render nothing.
  if (!visible) return null;

  // This state is used to retrigger the shake animation on Undo.
  const [shakeKey, setShakeKey] = useState(0);

  // Dismiss when tapping outside the dialog.
  const handleBackdropPress = () => {
    onSecondary?.();
  };

  // Handle Undo press with haptics + shake.
  const handleUndoPress = () => {
    // Haptic feedback for undo.
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    // Trigger a new shake animation.
    setShakeKey((k) => k + 1);

    // Let the shake play, then call primary action.
    setTimeout(() => {
      onPrimary();
    }, 180);
  };

  return (
    <View className="absolute inset-0 z-50 items-center justify-center">
      {/* Backdrop */}
      <Pressable
        className="absolute inset-0 bg-black/45"
        onPress={handleBackdropPress}
      />

      {/* Dialog container with fade/slide-in */}
      <MotiView
        from={{ opacity: 0, translateY: 12, scale: 0.96 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: "timing", duration: 160 }}
      >
        <View className="w-11/12 max-w-sm rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 shadow-2xl shadow-black/80">
          <Text className="text-base font-semibold text-slate-50">
            {title}
          </Text>

          {message && (
            <Text className="mt-2 text-sm text-slate-300">{message}</Text>
          )}

          {/* Button row: Close (ghost) + Undo (danger) */}
          <View className="mt-4 flex-row items-center justify-end">
            {/* Close button (ghost style) */}
            {secondaryLabel && onSecondary && (
              <UIButton
                label={secondaryLabel}
                onPress={onSecondary}
                variant="ghost"
                hapticStyle="light"
                fullWidth={false}
                className="mr-3"
              />
            )}

            {/* Undo – red button with shake animation */}
            <MotiView
              key={shakeKey}
              from={{ translateX: 0 }}
              animate={{ translateX: [0, -6, 6, -6, 0] }}
              transition={{ type: "timing", duration: 180 }}
            >
              <UIButton
                label={primaryLabel}
                onPress={handleUndoPress}
                variant="danger"
                fullWidth={false}
              />
            </MotiView>
          </View>
        </View>
      </MotiView>
    </View>
  );
}
