// jshint varstmt:false

var gulp = require('gulp');
var exec = require('child_process').exec;
var jsdoc = require('gulp-jsdoc3');
var pandoc = require('gulp-pandoc');

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
var through = require('through2');
var path = require('path');
var gulpif = require('gulp-if');

var git = require('gulp-git');
var prompt = require('gulp-prompt');

var pkg = require('./package.json');

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

gulp.task('license', function() {

  var clean = argv.clean;
  if (!clean) clean = false;

  return gulp.src(['src/**/*.js'])
  .pipe(prependLicense(clean));

});

function prependLicense(clean) {

  return through.obj(function(file, enc, cb) {

    if (file.isNull()) {
      return cb(new Error('Fil is null'));
    }

    if (file.isStream()) {
      return cb(new Error('Streaming not supported'));
    }

    var dest = path.dirname(file.path);

    return gulp.src(file.path)
    .pipe(replace(license, ''))
    .pipe(gulpif(!clean, insert.prepend(license)))
    .pipe(gulp.dest(dest))
    .on('end', function() {
      cb();
    });

  });

}

gulp.task('runtime', function() {

  var compact = argv.compact;
  if (!compact) compact = false;

  return browserify({
    entries: ['./src/runtime/RuntimeUA.js'],
    standalone: 'Runtime',
    debug: false
  })
  .transform(babel, {
    compact: compact,
    presets: ['es2015', 'stage-0'],
    plugins: ['add-module-exports']
  })
  .bundle()
  .on('error', function(err) {
    console.error(err);
    this.emit('end');
  })
  .pipe(source('Runtime.js'))
  .pipe(buffer())
  .pipe(gulpif(compact, uglify()))
  .pipe(gulpif(compact, insert.prepend(license + '// Runtime User Agent \n\n// version: {{version}}\n\n')))
  .pipe(gulpif(compact, replace('{{version}}', pkg.version)))
  .pipe(gulp.dest('./dist'));

});

gulp.task('minibus', function() {

  var compact = argv.compact;
  if (!compact) compact = false;

  var descriptionNote = '/**\n' +
  '* Minimal interface and implementation to send and receive messages. It can be reused in many type of components.\n' +
  '* Components that need a message system should receive this class as a dependency or extend it.\n' +
  '* Extensions should implement the following private methods: _onPostMessage and _registerExternalListener.\n' +
  '*/\n';

  return browserify({
    entries: ['./src/minibus.js'],
    standalone: 'MiniBus',
    debug: false
  })
  .transform(babel, {
    compact: compact,
    presets: ['es2015', 'stage-0'],
    plugins: ['add-module-exports']
  })
  .bundle()
  .on('error', function(err) {
    console.error(err);
    this.emit('end');
  })
  .pipe(source('minibus.js'))
  .pipe(buffer())
  .pipe(gulpif(compact, uglify()))
  .pipe(gulpif(compact, insert.prepend(descriptionNote + '// version: {{version}}\n\n')))
  .pipe(gulpif(compact, replace('{{version}}', pkg.version)))
  .pipe(gulp.dest('./dist'));

});

gulp.task('sandbox', function() {

  var descriptionNote = '/**\n' +
  '* @author micaelpedrosa@gmail.com\n' +
  '* Base class to implement external sandbox component\n' +
  '*/\n\n';

  var compact = argv.compact;
  if (!compact) compact = false;

  return browserify({
    entries: ['./src/sandbox.js'],
    standalone: 'sandbox',
    debug: false
  })
  .transform(babel, {
    compact: compact,
    presets: ['es2015', 'stage-0'],
    plugins: ['add-module-exports']
  })
  .bundle()
  .on('error', function(err) {
    console.error(err);
    this.emit('end');
  })
  .pipe(source('sandbox.js'))
  .pipe(buffer())
  .pipe(gulpif(compact, uglify()))
  .pipe(gulpif(compact, insert.prepend(descriptionNote + '// version: {{version}}\n\n')))
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
