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
