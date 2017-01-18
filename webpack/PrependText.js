var fs = require('fs');
var path = require('path');

function PrependText(options) {
  this.opts = options;

  if (!this.opts.bundleDir) this.opts.bundleDir = './dist/';
  if (!this.opts.data) this.opts.data = '';

}

PrependText.prototype.apply = function(compiler) {
  var opts = this.opts;
  var dirFolder = opts.bundleDir;
  var userData = '';

  if (typeof(opts.data) === 'object') {
    Object.keys(opts.data).forEach(function(key) {
      userData += '// ' + key + ': ' + opts.data[key] + '\n';
    });
  } else {
    userData = JSON.stringify(opts.data);
  }

  compiler.plugin('done', function() {

    fs.readdir(dirFolder, (err, files) => {
      files.forEach(file => {

        var data = fs.readFileSync(path.join(dirFolder, file), 'utf8'); //read existing contents into data
        var fd = fs.openSync(path.join(dirFolder, file), 'w+');
        var buffer = new Buffer(userData);
        fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
        fs.writeSync(fd, data, buffer.length, data.length, 'utf8'); //append old data
        fs.close(fd);
      });
    });
  });
};

module.exports = PrependText;
