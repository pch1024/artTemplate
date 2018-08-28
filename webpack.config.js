const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const pages = {
  fsr: ['babel-polyfill', './src/pages/fsr/index.js'],
  one: ['babel-polyfill', './src/pages/one/index.js'],
  all: ['babel-polyfill', './src/pages/all/index.js']
};
const INDEX = 'all.html';

const plugins = [];
for (var key in pages) {
  if (pages.hasOwnProperty(key)) {
    plugins.push(
      new HtmlWebpackPlugin({
        filename: key + '.html',
        title: key.toUpperCase(),
        template: 'index.ejs',
        chunks: [key],
        hash: true,
        inject: true
      })
    );
  }
}

module.exports = {
  entry: pages,
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name]/[name].js'
  },
  module: {
    rules: [{
        test: /\.art$/,
        include: /src/,
        loader: 'art-template-loader'
      },
      {
        test: /\.(scss|css)$/,
        include: /src/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
          publicPath: '../'
        })
      },
      {
        test: /\.js$/,
        include: /src/,
        loader: 'babel-loader'
      },
      {
        test: /\.(woff2?|eot|ttf|otf|png|jpe?g|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'file-loader',
        include: /src/,
        options: {
          publicPath: './assets/',
          outputPath: 'assets',
          limit: 10000,
          name: '[name].[ext]?[hash]' // 源文件
        }
      }
    ]
  },
  performance: {
    maxEntrypointSize: 10000000,
    maxAssetSize: 1000000 // 1 MB  = 1000000 Bytes
  },
  // optimization: {
  //   minimize: true,
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'lib',
  //         chunks: 'all'
  //       }
  //     }
  //   }
  // },
  devServer: {
    open: true,
    index: INDEX,
    inline: true,
    hot: true,
    host: '192.168.1.165',
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
};

if (process.env.NODE_ENV === 'pro') {
  module.exports.mode = 'production';
  module.exports.devtool = 'none';
  module.exports.plugins = (module.exports.plugins || []).concat(
    [
      new CleanWebpackPlugin(['dist']),
      new ExtractTextPlugin('[name]/[name].css'),
      new CopyWebpackPlugin([{
        from: 'src/static/',
        to: 'assets/'
      }])
    ],
    plugins
  );
}

if (process.env.NODE_ENV === 'dev') {
  module.exports.mode = 'development';
  module.exports.devtool = '#source-map';
  module.exports.plugins = (module.exports.plugins || []).concat(
    [
      new webpack.HotModuleReplacementPlugin(),
      new ExtractTextPlugin('[name]/[name].css'),
      new CopyWebpackPlugin([{
        from: 'src/static/',
        to: 'assets/'
      }])
    ],
    plugins
  );
}