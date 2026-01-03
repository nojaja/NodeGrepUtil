const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  target: 'node',
  entry: './src/index.ts',
  output: {
    filename: 'GrepUtil.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    library: {
      name: 'GrepUtil',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['node_modules']
  }
};