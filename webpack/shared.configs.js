var path = require('path');
var webpack = require('webpack');
var packageFile = require('../package.json');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var PrependText = require('./PrependText.js');

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

  plugins.push(new webpack.EnvironmentPlugin(['MODE']));
  plugins.push(new PrependText({
    bundleDir: path.resolve(__dirname, '..', 'dist'),
    data: {
      version: packageFile.version,
      date: new Date(),
      licence: '\n' + license
    }
  }));


  if (process.env.MODE === 'prod' || process.env.MODE === 'light') {

    plugins.push(new webpack.optimize.UglifyJsPlugin({
      beautify: false,

      ecma: 6,

      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },

      // Eliminate commentsecma: 6,
      comments: false,

      compress: {
        screw_ie8: true,

        //  remove unreachable code
        dead_code: true,

        // remove warnings
        warnings: false,

        // Drop console statements
        drop_console: true
      }
    }));

  } else {
    plugins.push(new UglifyJsPlugin());
  }

  return plugins;
}

function processSuffix() {
  var suffix = '';
  if (process.env.MODE === 'prod') {
    suffix = '.min';
  }

  if (process.env.MODE === 'light') {
    suffix = '.light';
  }

  return suffix;
}


module.exports = {
  getModeConfig: getModeConfig,
  processSuffix: processSuffix,
  resolve: {
    modules: [path.resolve(__dirname, 'hyperties'), 'node_modules']
  }
};
