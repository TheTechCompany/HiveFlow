const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const webpack = require('webpack')
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
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
        // react-doc-viewer (unused transitive dep of @hexhive/ui) brings in react-pdf
        // which crashes single-spa. Stub it.
        'react-doc-viewer': path.resolve(__dirname, 'src/__mocks__/react-doc-viewer.js'),
      },
      fallback: {
        "process": require.resolve('process/browser')
      },
      plugins: [
        new TsconfigPathsPlugin(),
      ]
    },
    plugins: [
      new ReactRefreshWebpackPlugin(),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new webpack.EnvironmentPlugin({
        ...process.env,
        PUBLIC_URL: process.env.NODE_ENV == 'production' ? '/dashboard/flow' : '/dashboard/hive-flow'
      }), 
    ],
  });
};
