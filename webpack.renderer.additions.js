const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const {
  TsConfigPathsPlugin
} = require('awesome-typescript-loader');

module.exports = {
  resolve: {
    plugins: [
      new TsConfigPathsPlugin()
    ]
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [{
        loader: 'tslint-loader',
        options: {
          emitErrors: true,
          failOnHint: true
        }
      }],
      enforce: 'pre',
      exclude: /node_modules/
    }]
  },
  plugins: [
    new SentryWebpackPlugin({
      include: './dist',
      ignoreFile: '.sentrycliignore',
      ignore: ['node_modules', 'primus.js', 'ScriptsHelpers.js'],
      configFile: 'sentry.properties'
    })
  ]
}
