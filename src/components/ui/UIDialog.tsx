import React from "react";
import { View, Text, Pressable } from "react-native";
import { UIButton } from "@/src/components/ui/UIButton";

export type UIDialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  primaryLabel: string;    // Undo
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
  if (!visible) return null;

  const handleBackdropPress = () => {
    onSecondary?.();
  };

  return (
    <View className="absolute inset-0 z-50 items-center justify-center">
      {/* backdrop */}
      <Pressable
        className="absolute inset-0 bg-black/45"
        onPress={handleBackdropPress}
      />

      {/* Dialog */}
      <View className="w-11/12 max-w-sm rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 shadow-2xl shadow-black/80">
        <Text className="text-base font-semibold text-slate-50">{title}</Text>

        {message && (
          <Text className="mt-2 text-sm text-slate-300">{message}</Text>
        )}

        <View className="mt-4 flex-row justify-end items-center">
          {/* Close */}
          {secondaryLabel && onSecondary && (
            <View className="mr-3">
              <UIButton
                label={secondaryLabel}
                onPress={onSecondary}
                variant="ghost"
                hapticStyle="light"
                fullWidth={false}
                className="px-3"
              />
            </View>
          )}

          {/* Undo – red button */}
          <Pressable
            onPress={onPrimary}
            className="rounded-full bg-red-600 px-5 py-2.5"
          >
            <Text className="text-sm font-semibold text-white">
              {primaryLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
