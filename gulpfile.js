// jshint varstmt:false

var gulp = require('gulp');
var exec = require('child_process').exec;
var jsdoc = require('gulp-jsdoc3');
var pandoc = require('gulp-pandoc');
var fs = require('fs');

// Task and dependencies to distribute for all environments;
var babelify = require('babelify');
var babel = require('gulp-babel');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var insert = require('gulp-insert');
var uglify = require('gulp-uglify');
var bump = require('gulp-bump');
var argv = require('yargs').argv;
var through = require('through2');
var path = require('path');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var extensions = ['.js', '.json'];

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

/**
 * Make 3 distriution files
 * By default the compact mode is true;
 * How to use: gulp dist --compact false | true;
 */
gulp.task('dist', ['6to5'], function() {

  var debug = argv.development ? true : false;

  if (debug) {
    gutil.log(gutil.colors.blue('The files will be compiled in debug mode'));
    gutil.log('The generated files will include the source maps inside');
  } else {
    gutil.log(gutil.colors.blue('The files will be compiled in production mode'));
    gutil.log('The generated files will be uglified, minified, the sourcemaps files will be created separated');
  }

  var file = 'src/runtime/RuntimeUA.js';

  return gulp.src([file])
  .pipe(dist(debug))
  .on('end', function() {

    var command = 'browserify ' + file + ' -t babelify -s Runtime -o dist/NodeRuntime.js --node';
    if (debug) {
      command += ' --debug';
    }
    gutil.log(command);
    exec(command, function(err) {
      if (err) {
        gutil.log(gutil.colors.green('Need install browserify npm install -g browserify'));
        gutil.log(err.message);
        return err;
      }
      gutil.log('All the files are created');
    });

  });

});

gulp.task('6to5', function() {

  return gulp.src(['src/**/*.js'])
  .pipe(sourcemaps.init())
  .pipe(babel({
    sourceMaps: 'both',
    compact: true,
    presets: ['es2015'],
    plugins: ['add-module-exports']
  })).on('error', function(err) {
    gutil.log(gutil.colors.red(err));
    this.emit('end');
  })
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist'))
  .on('end', function() {
    gutil.log('Distribution files done');
  });

});

function dist(debug) {

  if (!debug) debug = false;

  return through.obj(function(file, enc, cb) {

    if (file.isNull()) {
      return cb(new Error('File is null'));
    }

    if (file.isStream()) {
      return cb(new Error('Streaming not supported'));
    }

    var filename = path.basename(file.path, '.js');

    var opts = {
      configuration: {},
      debug: debug,
      standalone: filename === 'RuntimeUA' ? 'Runtime' : filename,
      destination: __dirname + '/dist'
    };

    if (debug) {
      opts.sourceMaps = true;
    } else {
      opts.sourceMaps = false;
    }

    gutil.log(gutil.colors.yellow('Make a distribution file from', filename + '.js'));

    gulp.src([file.path])
    .pipe(transpile(opts))
    .pipe(mark())
    .pipe(gulp.dest(__dirname + '/dist'))
    .on('error', function(error) {
      gutil.log(gutil.colors.red(error));
    })
    .on('end', function() {
      gutil.log('> ' + gutil.colors.green('Distribution ') + gutil.colors.white(filename) + gutil.colors.green(' done!'));
      cb();
    });
  });

}

function mark() {

  return through.obj(function(file, enc, cb) {

    var fileObject = path.parse(file.path);

    gulp.src([file.path])
    .pipe(insert.prepend(license + '// Distribution file for {{package}} \n// version: {{version}}\n// Last build: {{date}}\n\n'))
    .pipe(replace('{{version}}', pkg.version))
    .pipe(replace('{{package}}', fileObject.name + '.js'))
    .pipe(replace('{{date}}', new Date()))
    .pipe(gulp.dest(__dirname + '/dist'))
    .on('end', function() {
      cb();
    });

  });

}

function transpile(opts) {

  return through.obj(function(file, enc, cb) {

    var fileObject = path.parse(file.path);
    var filename = fileObject.base === 'RuntimeUA.js' ? 'Runtime.js' : fileObject.base;
    var args = {};
    var babelArgs = {};

    var environment = argv.production || process.env.NODE_ENV;
    process.env.environment = environment ? 'production' : 'development';

    args.extensions = extensions;

    if (opts.debug) args.debug = opts.debug;
    if (opts.standalone) args.standalone = opts.standalone;

    if (opts.sourceMaps) babelArgs.sourceMaps = opts.sourceMaps;

    var ug = true;
    if (filename === 'Runtime.js' && opts.debug) {
      ug = false;
    }

    return browserify(file.path, args)
    .transform(babelify)
    .bundle()
    .on('error', function(err) {
      gutil.log(gutil.colors.red(err));
      this.emit('end');
    })
    .pipe(source(filename))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(gulpif(ug, uglify()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(opts.destination))
    .on('end', function() {
      file.contents = fs.readFileSync(opts.destination + '/' + filename);
      file.path = opts.destination + '/' + filename;
      cb(null, file);
    });

  });

}

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
