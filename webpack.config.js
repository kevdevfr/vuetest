module.exports = {
  entry: ['./app/index.js'],
  output: {
    path: __dirname + '/build/js',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/,  use: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  devServer: {
    port: 3001,
    contentBase: './build',
    inline: true
  }
}
