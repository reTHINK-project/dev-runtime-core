var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('doc', function(done) {

  console.log('Generating documentation...');
  exec('node_modules/.bin/jsdoc -R readme.md -d Docs src/*', function(err, stdout, stderr) {
    if (err) return done(err);
    console.log('Documentation generated in "Docs" directory');
    done();
  });

});

gulp.task('dist', function(done) {

  var systemDist = 'jspm bundle-sfx runtime/RuntimeUA dist/index.js --format --inject --no-mangle --skip-source-maps';
  var amdDist = 'jspm bundle-sfx runtime/RuntimeUA dist/index.amd.js --format amd --inject --no-mangle --skip-source-maps';

  var workerDist = 'jspm bundle workers/* dist/workers/worker.js --minify  --no-mangle --skip-source-maps';

  exec(systemDist + '&&' + amdDist + '&&' + workerDist, function(err, stdout, stderr) {
    if (err) return done(err);
    done();
  });

});
