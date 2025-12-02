import React, { ReactNode, useRef } from "react";
import { View, Pressable } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { BookmarkSimple } from "phosphor-react-native";
import { MotiView } from "moti";

type SwipeableRowProps = {
  children: ReactNode;
  onPrimaryAction: () => void | Promise<void>;
  /** Whether this row's item is currently in the watchlist */
  active?: boolean;
};

export function SwipeableRow({
  children,
  onPrimaryAction,
  active = false,
}: SwipeableRowProps) {

  const swipeableRef = useRef<any>(null);

  const handleActionPress = () => {
    // small delay so the user can see the tap / bounce
    setTimeout(async () => {
      if (swipeableRef.current && typeof swipeableRef.current.close === "function") {
        swipeableRef.current.close();
      }
      await onPrimaryAction();
    }, 220);
  };

  const renderRightActions = () => (
    <View className="flex-row h-full items-stretch">
      <Pressable
        onPress={handleActionPress}
        className="w-24 items-center justify-center rounded-l-3xl bg-emerald-600 shadow-xl shadow-emerald-500/60"
      >
        <MotiView
          from={{ opacity: 0.85, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1.06 }}
          transition={{
            loop: true,
            type: "timing",
            duration: 500, // faster glow / bounce
          }}
          className="items-center justify-center"
        >
          <BookmarkSimple
            size={28}
            color="#f9fafb"
            weight={active ? "fill" : "regular"} // filled when added
          />
        </MotiView>
      </Pressable>
    </View>
  );

  return (
    // spacing only – height comes from MovieCard (h-40 poster + padding)
    <View className="mb-4">
      <ReanimatedSwipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
      >
        {children}
      </ReanimatedSwipeable>
    </View>
  );
}
