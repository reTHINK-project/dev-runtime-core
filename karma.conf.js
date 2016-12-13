// Karma configuration
// Generated on Wed Sep 16 2015 12:17:06 GMT+0100 (WEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'browserify'],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/object.observe/dist/object-observe.js',
      'node_modules/array.observe/array-observe.js',
      'src/**/*.js',
      'test/**/GraphConnector.spec.js'
    ],

    // Define the root
    urlRoot: '/',

    // list of files to exclude
    exclude: [
<<<<<<< HEAD
      //'test/**/GraphConnector.spec.js'
=======
      //'test/GraphConnector.spec.js'
>>>>>>> 35895a8c2d55f49894b4852f217c87982844bedc
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['browserify'],
      'test/**/*.spec.js': ['browserify']
    },

    browserify: {
      transform: [
        ['babelify', {presets: ['es2016'], plugins: ['add-module-exports']}]
      ]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });

};
