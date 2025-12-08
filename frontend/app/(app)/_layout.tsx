import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/src/context/AuthContext";

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/signin" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      {/* Main tab UI */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Detail screens now SIBLINGS of (tabs), not inside */}
      <Stack.Screen name="movie/[id]" />
      <Stack.Screen name="person/[id]" />
    </Stack>
  );
}
