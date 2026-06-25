const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const webpack = require('webpack')
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (webpackConfigEnv, argv) => {
  // webpackConfigEnv.analyze = true;
  const defaultConfig = singleSpaDefaults({
    orgName: "hexhive-apps",
    projectName: "hive-flow",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    module: {
      rules: [
        {
          test: /\.m?js/,
          resolve: {
              fullySpecified: false,
          },
        }
      ]
    },
    resolve: {
      alias: {
        // pdfjs-dist (pulled by react-pdf → react-doc-viewer → @hexhive/ui)
        // crashes the single-spa bootstrap. Stub it so the app can load.
        'pdfjs-dist': path.resolve(__dirname, 'src/__mocks__/pdfjs-dist'),
      },
      fallback: {
        "process": require.resolve('process/browser')
      },
      plugins: [
        new TsconfigPathsPlugin(),
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new webpack.EnvironmentPlugin({
        ...process.env,
        PUBLIC_URL: process.env.NODE_ENV == 'production' ? '/dashboard/flow' : '/dashboard/hive-flow'
      }), 
    ]
  });
};
