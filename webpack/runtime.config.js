var path = require('path');
var processSuffix = require('./shared.configs').processSuffix;
var getModeConfig = require('./shared.configs').getModeConfig;

var WebpackMonitor = require('webpack-monitor');

var plugins = getModeConfig();

plugins.push(new WebpackMonitor({
  capture: true, // -> default 'true'
  target: '../monitor/myStatsStore.json', // default -> '../monitor/stats.json'
  launch: true, // -> default 'false'
  port: 3031 // default -> 8081
}));


module.exports = {
  entry: {
    Runtime: ['babel-polyfill', './src/runtime/RuntimeUA.js']
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
  plugins: plugins
};
