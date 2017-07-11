var path = require('path');
var processSuffix = require('./shared.configs').processSuffix;
var getModeConfig = require('./shared.configs').getModeConfig;

module.exports = {
  entry: {
    Runtime: './src/runtime/RuntimeUA.js'
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name]' + processSuffix() + '.js',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: process.env.MODE === 'dev' ? 'inline-eval-cheap-source-map' : false,
  module: {
    rules: [

      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   enforce: 'pre',
      //   use: [
      //     { loader: 'eslint-loader', options: { configFile: './.eslintrc.yml' }}
      //   ]
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ]
      }
    ]
  },

  //resolve: { extensions: ['.js'] },
  plugins: getModeConfig()
};
