// babel.config.js
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      "babel-preset-expo",
      "nativewind/babel", // må ligge her
    ],
    plugins: [
      "react-native-reanimated/plugin", // MÅ ligge nederst
    ],
  };
};
