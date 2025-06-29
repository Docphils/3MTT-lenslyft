const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(
        new WorkboxWebpackPlugin.InjectManifest({
          swSrc: './public/custom-sw.js',
          swDest: 'service-worker.js',
        })
      );
      return webpackConfig;
    },
  },
};
