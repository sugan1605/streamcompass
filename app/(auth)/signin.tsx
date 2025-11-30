// Handles email/password authentication for sign in + sign up.

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "@/src/firebaseConfig";
import { createUserProfile } from "@/src/services/userService";
import { router } from "expo-router";

export default function SignInScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        await createUserProfile(cred.user);
      }

      router.replace("/home");
    } catch (error: any) {
      console.log("Auth error:", error);

      let message = "Something went wrong. Please try again.";

      switch (error.code) {
        case "auth/invalid-email":
          message = "Invalid email format.";
          break;
        case "auth/user-not-found":
          message = "User not found.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password.";
          break;
        case "auth/email-already-in-use":
          message = "Email already in use.";
          break;
      }

      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const buttonClasses =
    "mt-2 items-center rounded-lg bg-emerald-500 py-3" +
    (loading ? " opacity-70" : "");

  return (
    <View className="flex-1 justify-center bg-slate-950 px-6">
      {/* App Title */}
      <Text className="mb-2 text-center text-3xl font-bold text-slate-50">
        StreamCompass 🎬
      </Text>

      <Text className="mb-6 text-center text-base text-slate-300">
        {mode === "signin" ? "Sign in to continue" : "Create a new account"}
      </Text>

      {/* Email */}
      <TextInput
        className="mb-3 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-base text-slate-100"
        placeholder="Email"
        placeholderTextColor="#94a3b8"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <TextInput
        className="mb-3 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-base text-slate-100"
        placeholder="Password"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Submit button */}
      <Pressable
        className={buttonClasses}
        onPress={handleAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-base font-semibold text-slate-950">
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </Text>
        )}
      </Pressable>

      {/* Switch between signin/signup */}
      <Pressable
        className="mt-4"
        onPress={() =>
          setMode((prev) => (prev === "signin" ? "signup" : "signin"))
        }
      >
        <Text className="text-center text-sm text-sky-400">
          {mode === "signin"
            ? "Don't have an account? Create one"
            : "Already have an account? Sign in"}
        </Text>
      </Pressable>
    </View>
  );
}
