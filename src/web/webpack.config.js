const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = ({ NODE_ENV }, { mode }) => {
  const rules = [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      resolve: {
        extensions: ['.js', '.jsx']
      },
      use: 'babel-loader'
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            url: false,
            minimize: true,
            sourceMap: true
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: [
              autoprefixer({
                browsers: ['ie >= 8', 'last 5 version']
              })
            ],
            sourceMap: true
          }
        },
      ]
    }
  ];

  const plugins = [
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify(NODE_ENV),
      __VERSION__: JSON.stringify(require('./package.json').version)
    }),
    new CleanWebpackPlugin(['public/*']),
    new CopyWebpackPlugin([{
      from: './assets'
    }]),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ];

  if (mode === 'development') {
    rules.push({
      enforce: 'pre',
      test: /\.jsx?$/,
      exclude: /node_modules/,
      resolve: {
        extensions: ['.js', '.jsx']
      },
      use: {
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
          emitError: false
        },
      },
    });
    plugins.push(new CleanTerminalPlugin({
      message: 'Restarting dev server...'
    }));
  }

  const config = {
    entry: './main.js',
    output: {
      path: path.resolve(__dirname, 'public'),
      publicPath: '/',
      filename: 'bundle.[hash].js'
    },
    devServer: {
      compress: true,
      historyApiFallback: true,
      open: true
    },
    module: {
      rules
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './modules')
      }
    },
    plugins
  };

  return config;
};