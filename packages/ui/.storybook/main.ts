// ── Storybook main configuration ───────────────────────────────────
import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/**/__stories__/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],

  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: false,
      },
    },
  },

  webpackFinal: async (webpackConfig) => {
    // ── Resolve ───────────────────────────────────────────────────
    webpackConfig.resolve = webpackConfig.resolve ?? {};
    webpackConfig.resolve.extensions = [
      ...(webpackConfig.resolve.extensions ?? []),
      '.ts', '.tsx', '.js', '.jsx', '.mjs',
    ];

    // tsconfig-paths-webpack-plugin for path aliases
    try {
      const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
      webpackConfig.resolve.plugins = [
        ...(webpackConfig.resolve.plugins ?? []),
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, '../tsconfig.json'),
        }),
      ];
    } catch { /* optional */ }

    // ── Module rules (our TS rule first so it beats defaults) ──────
    webpackConfig.module = webpackConfig.module ?? {};

    webpackConfig.module.rules = [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              ['@babel/preset-env', { targets: { browsers: ['last 2 versions'] }, modules: false }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
            plugins: [
              ['@babel/plugin-transform-runtime', { useESModules: true, regenerator: false }],
            ],
          },
        },
      },
      ...(webpackConfig.module.rules ?? []),
      {
        test: /\.m?js/,
        resolve: { fullySpecified: false },
      },
    ];

    return webpackConfig;
  },

  docs: {
    autodocs: 'tag',
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop: any) =>
        prop.parent ? !/node_modules\/(?!@mui)/.test(prop.parent.fileName) : true,
    },
  },
};

export default config;
