const { join } = require('node:path')
// const Dotenv = require('dotenv-webpack')
module.exports = {
  mode: 'development',
  entry: join(__dirname, 'index.tsx'),
  output: {
    path: join(__dirname, '../server/public'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devtool: 'source-map',
  devServer: {
    contentBase: join(__dirname, '../server/public'),
  },

  // plugins: [
  //   // !!! NEW for .env file
  //   new Dotenv({
  //     path: join(__dirname, '../.env'),
  //   }),
  // ]


}
