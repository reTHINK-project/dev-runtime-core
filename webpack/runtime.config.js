var path = require('path');
var processSuffix = require('./shared.configs').processSuffix;
var getModeConfig = require('./shared.configs').getModeConfig;

var WebpackMonitor = require('webpack-monitor');

var plugins = getModeConfig();

if (process.env.MONITOR) {
  plugins.push(new WebpackMonitor({
    launch: true, // -> default 'false'
    port: 3031 // default -> 8081
  }));
}

module.exports = {
  entry: {
    Runtime: ['systemjs/dist/extras/transform','@babel/polyfill', './src/runtime/RuntimeUA.js']
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name]' + processSuffix() + '.js',
    library: '[name]',
    libraryTarget: 'system'
//    libraryTarget: 'umd',
//    umdNamedDefine: true
  },
  devtool: process.env.MODE === 'dev' ? 'cheap-module-eval-source-map' : 'none',
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
//      { parser: { system: false } }
    ]
  },

  //resolve: { extensions: ['.js'] },
  plugins: plugins
};
