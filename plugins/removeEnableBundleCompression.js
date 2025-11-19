const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withRemoveEnableBundleCompression(config) {
  return withAppBuildGradle(config, (config) => {
    if (typeof config.modResults.contents === 'string') {
      config.modResults.contents = config.modResults.contents.replace(/\n\s*enableBundleCompression\s*=\s*[^\n]+/g, '');
    }
    return config;
  });
};
