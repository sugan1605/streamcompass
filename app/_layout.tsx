// app/_layout.tsx (or wherever this file lives)
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider } from "../src/context/AuthContext";
import "./../global.css";
import { ThemeProvider } from "../src/context/ThemeContext";
import { SoundProvider } from "@/src/context/SoundContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <SoundProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
            </SoundProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
