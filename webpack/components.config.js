var path = require('path');
var getModeConfig = require('./shared.configs').getModeConfig;

module.exports = {
  entry: {
    PEP: './src/policy/PEP.js',
    ReThinkCtx: './src/policy/ReThinkCtx.js',
    sandbox: './src/sandbox-pack.js',
    minibus: './src/minibus-pack.js',
    rethink: './src/rethink.js',
    StorageManager: './src/storage-manager-pack.js'
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].js',
    library: '[name]',
//    libraryTarget: 'system'
    libraryTarget: 'umd',
    umdNamedDefine: true
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
      { parser: { system: false } },
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
