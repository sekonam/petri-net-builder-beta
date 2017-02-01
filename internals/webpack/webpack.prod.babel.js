// Important modules this config uses
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const OfflinePlugin = require('offline-plugin');

module.exports = require('./webpack.base.babel')({
  // In production, we skip all hot-reloading stuff
  entry: [
    path.join(process.cwd(), 'app/app.js'),
  ],

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },
  // resolve: {
  //   alias: {
  //     'react$': path.join(__dirname, 'node_modules', 'react','dist', 'react.js'),
  //     'react-dom$': path.join(__dirname, 'node_modules', 'react-dom','dist', 'react-dom.js'),
  //     'redux$': path.join(__dirname, 'node_modules', 'redux','dist', 'redux.js'),
  //     'react-redux$': path.join(__dirname, 'node_modules', 'react-redux','dist', 'react-redux.js'),
  //   }
  // },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      children: true,
      minChunks: 2,
      async: true,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      mangle: {
        keep_fnames: true,
      },
    }),
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        // minifyJS: false,
        minifyJS: false,
        // minifyJS: {
        //   mangle: {
        //     keep_fnames: true,
        //   },
        // },
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),

    // Put it in the end to capture all the HtmlWebpackPlugin's
    // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
    // new OfflinePlugin({
    //   relativePaths: false,
    //   publicPath: '/',
    //
    //   // No need to cache .htaccess. See http://mxs.is/googmp,
    //   // this is applied before any match in `caches` section
    //   excludes: ['.htaccess'],
    //
    //   caches: {
    //     main: [':rest:'],
    //
    //     // All chunks marked as `additional`, loaded after main section
    //     // and do not prevent SW to install. Change to `optional` if
    //     // do not want them to be preloaded at all (cached only when first loaded)
    //     additional: ['*.chunk.js'],
    //   },
    //
    //   // Removes warning for about `additional` section usage
    //   safeToUseOptionalCaches: true,
    //
    //   AppCache: false,
    // }),
  ],

  performance: {
    assetFilter: (assetFilename) => !(/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)),
  },
});
