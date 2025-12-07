// Handles authenticated layout routing (signin → tabs)

import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import TabLayout from "@/src/navigation/TabLayout";
import { useAuth } from "@/src/context/AuthContext";

export default function AppLayout() {
  const { user, loading } = useAuth();

  // Wait until Firebase resolves the current auth state
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  // No authenticated user → redirect to signin screen
  if (!user) {
    return <Redirect href="/signin" />;
  }

  // User authenticated → show main tab navigation
  return <TabLayout />;
}
