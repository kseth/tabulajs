/**
 * Trifacta Inc. Confidential
 *
 * Copyright 2015 Trifacta Inc.
 * All Rights Reserved.
 *
 * Any use of this material is subject to the Trifacta Inc., Source License located
 * in the file 'SOURCE_LICENSE.txt' which is part of this package.  All rights to
 * this material and any derivative works thereof are reserved by Trifacta Inc.
 */

var spawn = require('child_process').spawn,
    path = require('path'),
    events = require('events');

function Tabula() {
  events.EventEmitter.call(this);
}

var prototype = Tabulate.prototype;

prototype.__proto__ = events.EventEmitter.prototype;

/**
 * name of inputFile
 * pageNumber is optional, defaults to 'all'
 * additionalArguments are optional (arguments to tabula-extractor)
 */
prototype.convertPdfToCsv = function tabulate(inputFile, pageNumber, additionalArguments) {
  var self = this;
  var args = ['-jar', path.join(__dirname, 'lib', 'tabula-extractor.jar'), inputFile];

  // if page number is given, use it
  // else, digest everything
  if (typeof pageNumber !== 'undefined') {
    args = args.concat(['-p', pageNumber]);
  } else {
    args = args.concat(['-p', 'all']);
  }

  if (additionalArguments) {
    args = args.concat(additionalArguments);
  }

  var childProcess = spawn('java', args);

  childProcess.stdout.on('data', function(data) {
    self.emit('data', data.toString());
  });

  childProcess.stderr.on('data', function(data) {
    self.emit('error', data.toString());
  });

  childProcess.on('close', function(exitCode) {
    self.emit('close', exitCode);
  });
};

module.exports = Tabula;