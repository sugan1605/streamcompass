// frontend/src/types/firebase-auth-react-native.d.ts

declare module "firebase/auth" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function getReactNativePersistence(storage: any): any;
}
