const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const DotenvWebpackPlugin = require('dotenv-webpack');

module.exports = {
  entry: {
    popup: path.resolve('src/popup/popup.jsx'),
    options: path.resolve('src/options/options.js'),
    background: path.resolve('src/background/background.js'),
    problemContent: path.resolve('src/contentScript/problemContent.js'),
    submissionContent: path.resolve('src/contentScript/submissionContent.js'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // matches .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
    },
  },
  plugins: [
    new DotenvWebpackPlugin(),

    new webpack.DefinePlugin({
      'process.env.client_id': JSON.stringify(process.env.GOOGLE_CLIENT_ID),
    }),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('src/static'),
          to: path.resolve('dist'),
        },
      ],
    }),
    ...getHtmlPlugins(['popup', 'options']),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve('dist'),
  },
  optimization: {
    splitChunks: {
      chunks(chunk) {
        return chunk.name !== 'contentScript' && chunk.name !== 'background';
      },
    },
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlPlugin({
        title: 'LeetNotes',
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}
