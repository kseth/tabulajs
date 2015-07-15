tabula.js
=========

Node bindings for tabula-extractor
----------------------------------

### Bindings

tabula.js spawns a process call to java (via java -jar) to run tabula-extractor. It emits the stdout (extracted csv) and stderr (warnings and errors) as data and error events. It also emits a close event with exitCode.

### Example
`var Tabula = require('../../../src/server/utils/tabula');`
var tabula = new Tabula();
tabula.on('data', function(data) {
  console.log(data);
});
tabula.on('error', function(err) {
  console.log(err);
});
tabula.on('close', function(exitCode) {
  console.log(exitCode);
});
tabula.convertPdfToCsv(input);`

### Updating tabula-extractor.jar

See [tabula-extractor](https://github.com/tabulapdf/tabula-extractor) for the original from which this is obtained. A jar is made from this git repository by bundling the files.

To make the jar file, have [jruby](https://github.com/jruby/jruby/wiki/GettingStarted) installed. Then clone [tabula-extractor](https://github.com/tabulapdf/tabula-extractor) and run the following commands from the root of the git repo:

`jruby -S gem install bundler`

`jruby -S gem install warbler`

`jruby -S bundle install`

`jruby -S warble`

This should produce the jar tabula-extractor.jar (located in `lib/`).