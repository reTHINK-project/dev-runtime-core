// jshint varstmt:false

var gulp = require('gulp');
var exec = require('child_process').exec;
var jsdoc = require('gulp-jsdoc3');
var pandoc = require('gulp-pandoc');

// Gulp task to generate development documentation;
gulp.task('doc', function(done) {

  var config = require('./jsdocConfig.json');

  gulp.src(['readme.md', './src/**/*.js'], {read: false})
      .pipe(jsdoc(config, done));

});

gulp.task('api', ['doc'], function() {

  return gulp.src('docs/jsdoc/*.html')
    .pipe(pandoc({
      from: 'html',
      to: 'markdown_github',
      ext: '.md',
      args: ['--smart']
    }))
    .pipe(gulp.dest('docs/api/'));
});

gulp.task('docx', ['api'], function(done) {

  var source = argv.source;
  var file = argv.file;
  if (!source) source = 'docs/jsdoc';
  if (!file) file = 'runtime-core';
  var dir = 'docs/';
  var filename = dir + file + '.docx';

  // pandoc docs/*.html -o test.docx
  try {
    exec('pandoc ' + source + '/*.html -o ' + filename, function(err) {
      if (err) return done(err);
      done();
    });
  } catch (e) {
    console.log('Need install pandoc');
    done();
  }

});

// Task and dependencies to distribute for all environments;
var babel = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var replace = require('gulp-replace');
var insert = require('gulp-insert');
var uglify = require('gulp-uglify');
var bump = require('gulp-bump');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;

var pkg = require('./package.json');

gulp.task('runtime', function() {

  var compact = argv.compact;
  if (!compact) compact = true;

  return browserify({
    entries: ['./src/runtimeUA.js'],
    standalone: 'runtimeUA',
    debug: false
  })
  .transform(babel, {compact: false, optional: 'runtime'})
  .bundle()
  .on('error', function(err) {
    console.error(err);
    this.emit('end');
  })
  .pipe(source('runtimeUA.js'))
  .pipe(buffer())
  .pipe(gulpif(compact, uglify()))
  .pipe(gulpif(compact, insert.prepend('// Runtime User Agent \n\n// version: {{version}}\n\n')))
  .pipe(gulpif(compact, replace('{{version}}', pkg.version)))
  .pipe(gulp.dest('./dist'));

});

gulp.task('minibus', function() {

  var compact = argv.compact;
  if (!compact) compact = true;

  return browserify({
    entries: ['./src/minibus.js'],
    standalone: 'MiniBus',
    debug: true
  })
  .transform(babel)
  .bundle()
  .on('error', function(err) {
    console.error(err);
    this.emit('end');
  })
  .pipe(source('minibus.js'))
  .pipe(buffer())
  .pipe(gulpif(compact, uglify()))
  .pipe(gulpif(compact, insert.prepend('// Runtime User Agent \n\n// version: {{version}}\n\n')))
  .pipe(gulpif(compact, replace('{{version}}', pkg.version)))
  .pipe(gulp.dest('./dist'));

});

gulp.task('sandbox', function() {

  var compact = argv.compact;
  if (!compact) compact = true;

  return browserify({
    entries: ['./src/sandbox.js'],
    standalone: 'sandbox',
    debug: true
  })
  .transform(babel)
  .bundle()
  .on('error', function(err) {
    console.error(err);
    this.emit('end');
  })
  .pipe(source('sandbox.js'))
  .pipe(buffer())
  .pipe(gulpif(compact, uglify()))
  .pipe(gulpif(compact, insert.prepend('// Runtime User Agent \n\n// version: {{version}}\n\n')))
  .pipe(gulpif(compact, replace('{{version}}', pkg.version)))
  .pipe(gulp.dest('./dist'));

});

/**
 * Make 3 distriution files
 * By default the compact mode is true;
 * How to use: gulp dist --compact false | true;
 */
gulp.task('dist', ['runtime', 'minibus', 'sandbox']);

/**
 * Compile on specific file from ES6 to ES5
 * @param  {string} 'compile' task name
 *
 * How to use: gulp compile --file=path/to/file;
 */
gulp.task('compile', function() {

  var filename = argv.file;
  var path;

  if (!filename) {
    this.emit('end');
  } else {
    var splitIndex = filename.lastIndexOf('/') + 1;
    path = filename.substr(0, splitIndex);
    filename = filename.substr(splitIndex).replace('.js', '');
  }

  console.log('Converting ' + filename + ' on ' + path + ' to ES5');

  var bundler = browserify(path + filename, {
    standalone: 'activate',
    debug: true
  }).transform(babel);

  function rebundle() {
    return bundler.bundle()
      .on('error', function(err) {
        console.error(err);
        this.emit('end');
      })
      .pipe(source(filename + '.ES5.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest(path));
  }

  return rebundle();

});

var through = require('through2');
var Base64 = require('js-base64').Base64;
var fs = require('fs');

function encode(filename, descriptorName, configuration, isDefault) {

  var descriptor = fs.readFileSync('resources/descriptors/' + descriptorName + '.json', 'utf8');
  var json = JSON.parse(descriptor);

  return through.obj(function(file, enc, cb) {

    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new Error('Streaming not supported'));
    }

    var encoded = Base64.encode(file.contents);
    var value = 'default';

    if (isDefault) {
      value = 'default';
    } else {
      value = filename;
    }

    if (!json.hasOwnProperty(value)) {
      var newObject = {};
      json[value] = newObject;
      json[value].sourcePackage = {};
    }

    var language = 'javascript';
    if (descriptorName === 'DataSchemas') {
      language = 'JSON-Schema';
    }

    json[value].cguid = Math.floor(Math.random() + 1);
    json[value].type = descriptorName;
    json[value].version = '0.1';
    json[value].description = 'Description of ' + filename;
    json[value].objectName = filename;
    json[value].configuration = configuration;
    json[value].sourcePackageURL = '/sourcePackage';
    json[value].sourcePackage.sourceCode = encoded;
    json[value].sourcePackage.sourceCodeClassname = filename;
    json[value].sourcePackage.encoding = 'base64';
    json[value].sourcePackage.signature = '';
    json[value].language = language;
    json[value].signature = '';
    json[value].messageSchemas = '';
    json[value].dataObjects = [];
    json[value].accessControlPolicy = 'somePolicy';

    var newDescriptor = new Buffer(JSON.stringify(json, null, 2));
    console.log(value);
    cb(null, newDescriptor);

  });

}

function resource(file, configuration, isDefault) {

  var filename = file;
  var splitIndex = filename.lastIndexOf('/') + 1;
  var extension = filename.substr(filename.lastIndexOf('.') + 1);

  switch (extension) {
    case 'js':
      filename = filename.substr(splitIndex).replace('.js', '');
      break;
    case 'json':
      filename = filename.substr(splitIndex).replace('.json', '');
      break;
  }

  var descriptorName;
  if (filename.indexOf('Hyperty') !== -1) {
    descriptorName = 'Hyperties';
  } else if (filename.indexOf('ProtoStub') !== -1) {
    descriptorName = 'ProtoStubs';
  } else if (filename.indexOf('DataSchema')) {
    descriptorName = 'DataSchemas';
  }

  console.log('DATA:', descriptorName);

  if (extension === 'js') {
    return browserify({
      entries: ['resources/' + filename + '.js'],
      standalone: 'activate',
      debug: false
    })
    .transform(babel)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('resources/'))
    .pipe(buffer())
    .pipe(encode(filename, descriptorName, configuration, isDefault))
    .pipe(source(descriptorName + '.json'))
    .pipe(gulp.dest('resources/descriptors/'));
  } else if (extension === 'json') {

    return gulp.src(['resources/' + filename + '.json'])
    .pipe(gulp.dest('resources/'))
    .pipe(buffer())
    .pipe(encode(filename, descriptorName, configuration, isDefault))
    .pipe(source(descriptorName + '.json'))
    .pipe(gulp.dest('resources/descriptors/'));

  }

}

gulp.task('watch', function() {

  var watcher = gulp.watch(['resources/*Hyperty.js', 'resources/*ProtoStub.js']);
  watcher.on('change', function(event) {

    if (event.type === 'deleted') return;
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    resource(event.path);

  });

});

gulp.task('encode', function(done) {

  var files = [];
  var dirFiles = fs.readdirSync('resources');
  files = dirFiles.filter(isFile);
  files = files.map(function(file) {
    return 'resources/' + file;
  });

  function isFile(file) {
    if (file.indexOf('Hyperty') !== -1 || file.indexOf('ProtoStub') !== -1 || file.indexOf('DataSchema') !== -1){
      return fs.statSync('resources/' + file).isFile();
    }
  }

  gulp.src('./', {buffer:false})
    .pipe(prompt.prompt([{
      type: 'list',
      name: 'file',
      message: 'File to be converted:',
      choices: files
    },
    {
      type: 'input',
      name: 'configuration',
      message: 'ProtoStub Configuration, use something like:\n{"url": "wss://msg-node.localhost:9090/ws"}\nConfiguration:',
      validate: function(value) {
        try {
          JSON.parse(value);
          return true;
        } catch (e) {
          console.error('Check your configuration JSON\nShould be something like:\n{"url": "wss://msg-node.localhost:9090/ws"}');
          return false;
        }
      }
    },
    {
      type: 'list',
      name: 'defaultFile',
      message: 'This will be a default file to be loaded?',
      choices: ['yes', 'no']
    }], function(res) {

      fs.access(res.file, fs.R_OK | fs.W_OK, function(err) {
        if (err) done(new Error('No such file or directory'));
        return;
      });

      var configuration = JSON.parse(res.configuration);

      var isDefault = true;
      if (res.defaultFile === 'no' || res.defaultFile === 'n') {
        isDefault = false;
      }

      if (res.file) {
        resource(res.file, configuration, isDefault);
      }
    })
  );

});

//gulp.task('encode', ['watch']);

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */
function inc(importance) {
  // get all the files to bump version in
  return gulp.src(['./package.json'])

    // bump the version number in those files
    .pipe(bump({type: importance}))

    // save it back to filesystem
   .pipe(gulp.dest('./'));
}

gulp.task('patch', ['test'], function() { return inc('patch'); });

gulp.task('feature', ['test'], function() {  return inc('minor'); });

gulp.task('release', ['test'], function() {  return inc('major'); });

var Server = require('karma').Server;

/**
 * Run test once and exit
 */
gulp.task('test', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

var git = require('gulp-git');
var prompt = require('gulp-prompt');

// Run git add
gulp.task('add', ['test'], function() {
  return gulp.src('./')
    .pipe(git.add());
});

// Run git commit
gulp.task('commit', ['test'], function() {
  var message;
  gulp.src('./', {buffer:false})
  .pipe(prompt.prompt({
    type: 'input',
    name: 'commit',
    message: 'Please enter commit message...'
  }, function(res) {
      message = res.commit;
    }))
    .pipe(git.commit(message));
});

// Run git push
gulp.task('push', ['test'], function() {
  git.push('origin', 'master', function(err) {
    if (err) throw err;
  });
});
