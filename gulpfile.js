// jshint varstmt:false

var gulp = require('gulp');
var exec = require('child_process').exec;

// Gulp task to generate development documentation;
gulp.task('doc', function(done) {

  console.log('Generating documentation...');
  exec('node_modules/.bin/jsdoc -R readme.md -d docs src/*', function(err) {
    if (err) return done(err);
    console.log('Documentation generated in "docs" directory');
    done();
  });

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
var argv = require('yargs').argv;

var pkg = require('./package.json');

gulp.task('runtime', function() {

  return browserify({
    entries: ['./src/runtimeUA.js'],
    standalone: 'runtimeUA',
    debug: true
  })
  .transform(babel)
  .bundle()
  .on('error', function(err) {
    console.error(err);
    this.emit('end');
  })
  .pipe(source('runtimeUA.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(insert.prepend('// Runtime User Agent \n\n// version: {{version}}\n\n'))
  .pipe(replace('{{version}}', pkg.version))
  .pipe(gulp.dest('./dist'));

});

gulp.task('minibus', function() {

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
  .pipe(uglify())
  .pipe(insert.prepend('// Runtime User Agent \n\n// version: {{version}}\n\n'))
  .pipe(replace('{{version}}', pkg.version))
  .pipe(gulp.dest('./dist'));

});

gulp.task('sandbox', function() {

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
  .pipe(uglify())
  .pipe(insert.prepend('// Runtime User Agent \n\n// version: {{version}}\n\n'))
  .pipe(replace('{{version}}', pkg.version))
  .pipe(gulp.dest('./dist'));

});

gulp.task('dist', ['runtime', 'minibus', 'sandbox']);

/**
 * Compile on specific file from ES6 to ES5
 * @param  {string} 'compile' task name
 *
 * How to use: gulp compile --file 'path/to/file';
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

function encode(filename, descriptorName) {

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

    if (json.hasOwnProperty(filename)) {
      value = filename;
    }

    json[value].sourcePackage.sourceCode = encoded;
    json[value].sourcePackage.sourceCodeClassname = filename;
    json[value].sourcePackage.encoding = 'Base64';
    json[value].sourcePackage.signature = '';

    var newDescriptor = new Buffer(JSON.stringify(json, null));
    cb(null, newDescriptor);

  });

}

gulp.task('watch', function() {

  var watcher = gulp.watch(['resources/*Hyperty.js', 'resources/*ProtoStub.js']);
  watcher.on('change', function(event) {

    if (event.type === 'deleted') return;

    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');

    var filename = event.path;
    var splitIndex = filename.lastIndexOf('/') + 1;
    filename = filename.substr(splitIndex).replace('.js', '');

    var descriptorName = 'Hyperties';
    if (filename.indexOf('Hyperty') === -1) {
      descriptorName = 'ProtoStubs';
    }

    var bundler = browserify({
      entries: ['resources/' + filename + '.js'],
      standalone: 'activate',
      debug: false
    }).transform(babel);

    console.log(descriptorName);

    bundler.bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('resources/'))
      .pipe(buffer())
      .pipe(encode(filename, descriptorName))
      .pipe(source(descriptorName + '.json'))
      .pipe(gulp.dest('resources/descriptors/'));
  });

});

gulp.task('encode', ['watch']);

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
