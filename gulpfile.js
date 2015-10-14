var gulp = require('gulp');
var exec = require('child_process').exec;

// Gulp task to generate development documentation;
gulp.task('doc', function(done) {

  console.log('Generating documentation...');
  exec('node_modules/.bin/jsdoc -R readme.md -d docs src/*', function(err, stdout, stderr) {
    if (err) return done(err);
    console.log('Documentation generated in "docs" directory');
    done();
  });

});

// Gulp task to distribute the RuntimeUA in ES6;
gulp.task('dist', function(done) {

  var systemDist = 'jspm bundle-sfx runtime/RuntimeUA dist/index.js --format --inject --no-mangle --skip-source-maps';
  var amdDist = 'jspm bundle-sfx runtime/RuntimeUA dist/index.amd.js --format amd --inject --no-mangle --skip-source-maps';

  exec(systemDist + '&&' + amdDist, function(err, stdout, stderr) {
    if (err) return done(err);
    done();
  });

});

// Task and dependencies to convert ES6 to ES5 with babel;
var babel = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('build', function() {

  var bundler = browserify('./src/protostub/VertxProtoStub.js', {
    standalone: 'VertxProtoStub',
    debug: false}).transform(babel.configure({
    modules: 'umd'
  }));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) {
        console.error(err);
        this.emit('end');
      })
      .pipe(source('VertxProtoStub.js'))
      .pipe(gulp.dest('./build'));
  }

  rebundle();

});
