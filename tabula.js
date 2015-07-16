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
    util = require('util'),
    events = require('events');

function Tabula() {
  events.EventEmitter.call(this);
}

util.inherits(Tabula, events.EventEmitter);

/**
 * name of inputFile <-- absolute path
 * pageNumber is optional, defaults to 'all'
 * additionalArguments are optional (arguments to tabula-extractor)
 */
Tabula.prototype.convertPdfToCsv = function convertPdfToCsv(inputFile, pageNumber, additionalArguments) {
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
    // filter for error messages
    // when java/ruby emit error messages on stderr
    // they contain some version of "error:"
    var errorMsg = data.toString();
    if(errorMsg.toLowerCase().indexOf('error:') !== -1) {
      self.emit('error', new Error("PDF Extraction Error: " + errorMsg));
    }
  });

  // occurs on failure of spawn initiation/message passing/termination
  childProcess.on('error', function(err) {
    self.emit('error', err);
  });

  childProcess.on('close', function(exitCode) {
    self.emit('close', exitCode);
  });
};

module.exports = Tabula;