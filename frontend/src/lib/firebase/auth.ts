import { app } from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";

// @ts-ignore - getReactNativePersistence typings are missing in some versions
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
