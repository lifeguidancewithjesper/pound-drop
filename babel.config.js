<<<<<<< HEAD
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin' // Must be last
    ]
  };
};
=======
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: []
  };
};
>>>>>>> b071341a0df3807704a99d711ac06b6de3345bd5
