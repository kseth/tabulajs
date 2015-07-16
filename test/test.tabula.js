var assert = require('assert'),
    Tabula = require('../index'),
    path = require('path'),
    fs = require('fs');

describe('Tabula', function() {
  describe('#convertPdfToCsv', function() {
    it('pdf-to-csv: translation should give expected results', function(done) {
      this.timeout(15000);
      var tabula = new Tabula();
      var outputCsv = '';

      tabula.on('data', function(data) {
        outputCsv += data;
      });

      tabula.on('error', function(err) {
        assert.fail('found error: '+err.toString(), 'error not expected');
      });

      tabula.on('close', function(exitCode) {
        assert.equal(exitCode, 0, "function exits with code 0");

        fs.readFile(path.join(__dirname, 'test.csv'), function (err, data) {
          assert.equal(outputCsv, data.toString());
          done();
        });

      });

      tabula.convertPdfToCsv(path.join(__dirname, 'test.pdf'));
    });

    it('pdf-to-csv: errors should be caught when file not found', function(done) {
      this.timeout(15000);
      var tabula = new Tabula();

      tabula.on('data', function(data) {
        assert.fail('no input should be received', 'input was received');
      });

      tabula.on('error', function(err) {
        assert(err.toString().toLowerCase().indexOf('file does not exist') !== -1);
      });

      tabula.on('close', function(exitCode) {
        assert(exitCode !== 0, "function exits with code 0");
        done();
      });

      tabula.convertPdfToCsv(path.join(__dirname, 'testnothere.pdf'));
    });

    it('pdf-to-csv: errors should be caught when file wrong type', function(done) {
      this.timeout(15000);
      var tabula = new Tabula();

      tabula.on('data', function(data) {
        assert.fail('no input should be received', 'input was received');
      });

      var errorThrown = false;
      tabula.on('error', function(err) {
        if(!errorThrown) {
          errorThrown = true;
        }
      });

      tabula.on('close', function(exitCode) {
        assert(exitCode !== 0, "function exits with code 0");
        assert(errorThrown);
        done();
      });

      tabula.convertPdfToCsv(path.join(__dirname, 'test.csv'));
    });
  });
});