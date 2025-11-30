// types/declarations.d.ts

// 🔹 Phosphor icons – React Native
declare module "phosphor-react-native";

// 🔹 PNG / JPG / JPEG / WEBP – bundlet med Metro
declare module "*.png" {
  const value: number;
  export default value;
}

declare module "*.jpg" {
  const value: number;
  export default value;
}

declare module "*.jpeg" {
  const value: number;
  export default value;
}

declare module "*.webp" {
  const value: number;
  export default value;
}

// 🔹 SVG – brukt sammen med react-native-svg-transformer
declare module "*.svg" {
  import type React from "react";
  import type { SvgProps } from "react-native-svg";

  const content: React.FC<SvgProps>;
  export default content;
}
