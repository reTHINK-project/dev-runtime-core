var path = require('path');
var webpack = require('webpack');
var packageFile = require('./package.json');

var PrependText = require('./webpack/PrependText.js');

var license = '/**\n' +
'* Copyright 2016 PT Inovação e Sistemas SA\n' +
'* Copyright 2016 INESC-ID\n' +
'* Copyright 2016 QUOBIS NETWORKS SL\n' +
'* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V\n' +
'* Copyright 2016 ORANGE SA\n' +
'* Copyright 2016 Deutsche Telekom AG\n' +
'* Copyright 2016 Apizee\n' +
'* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN\n' +
'*\n' +
'* Licensed under the Apache License, Version 2.0 (the "License");\n' +
'* you may not use this file except in compliance with the License.\n' +
'* You may obtain a copy of the License at\n' +
'*\n' +
'*   http://www.apache.org/licenses/LICENSE-2.0\n' +
'*\n' +
'* Unless required by applicable law or agreed to in writing, software\n' +
'* distributed under the License is distributed on an "AS IS" BASIS,\n' +
'* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n' +
'* See the License for the specific language governing permissions and\n' +
'* limitations under the License.\n' +
'**/\n\n';

function getModeConfig() {

  var plugins = [];

  plugins.push(new PrependText({
    bundleDir: './dist/',
    data: {
      version: packageFile.version,
      date: new Date(),
      licence: '\n' + license
    }
  }));

  if (process.env.MODE === 'prod') {

    plugins.push(new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    }));

  }

  return plugins;
}

// 'src/sandbox.js', 'src/minibus.js'
module.exports = {
  entry: {
    Runtime: './src/runtime/RuntimeUA.js',
    PEP: './src/policy/PEP.js',
    ReThinkCtx: './src/policy/ReThinkCtx.js',
    sandbox: './src/sandbox.js',
    minibus: './src/minibus.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: process.env.MODE === 'dev' ? 'inline-eval-cheap-source-map' : false,
  module: {
    rules: [

      /*{
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [
          { loader: 'eslint-loader', options: { configFile: './.eslintrc.yml' }}
        ]
      },*/
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
