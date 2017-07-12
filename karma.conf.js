module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      './test/*.spec.js'
    ],
    exclude: [
      './test/PolicyEngine.spec.js'
    ],
    preprocessors: {
      './test/*.spec.js': ['webpack', 'sourcemap']
    },

    // webpack configuration
    webpack: require('./webpack.config.js'),
    reporters: ['mocha'],

    client: {
      mocha: {
        reporter: 'html'
      },
      captureConsole: true
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeTravis'],

    customLaunchers: {
      ChromeTravis: {
        base: 'Chrome',
        flags: [
          '--disable-web-security',
          '--ignore-certificate-errors'
        ]
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
