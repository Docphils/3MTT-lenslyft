const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Avoid pushing InjectManifest multiple times
      const hasInjectManifest = webpackConfig.plugins.some(
        (plugin) => plugin instanceof WorkboxWebpackPlugin.InjectManifest
      );

      if (!hasInjectManifest) {
        webpackConfig.plugins.push(
          new WorkboxWebpackPlugin.InjectManifest({
            swSrc: './public/custom-sw.js', 
            swDest: 'service-worker.js',
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, 
          })
        );
      }

      return webpackConfig;
    },
  },
};
