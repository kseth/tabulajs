var processor = require('child_process');

/*
* name of inputFile, outputFile
* callback function which receives the code, stdout, and stderr
* pageNumber is optional, defaults to 'all'
*/
function tabulate (inputFile, outputFile, callback, pageNumber) {
  var spawn = processor.spawn;
  var args = ['-jar', 'lib/tabula-extractor.jar', inputFile, '-o', outputFile];

  // if page number is given, use it
  // else, digest everything
  if(typeof pageNumber !== 'undefined') {
    args = args.concat(['-p', pageNumber]);
  } else {
    args = args.concat(['-p', 'all']);
  }

  var process = spawn('java', args);
  var stdout = '';
  var stderr = '';
  process.stdout.on('data', function (data) {
    stdout += data;
  });

  process.stderr.on('data', function (data) {
    stderr += data;
  });

  process.on('close', function (code) {
    callback(code, stdout, stderr);
  });
}

module.exports = tabulate;