const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'my-camera': './index.ts'
  },
  // devtool: "inlin-source-map",
  module: {
    rules: [
      {
        test: /.ts$/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
};
