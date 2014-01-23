var assert = require('assert');
var read = require(__dirname + '/../');
var debug = require('debug')('testRead');

describe('ReadFileLines', function() {

  it('line event, line and next callback parameters', function(done) {
    var mockfile = '/fixtures/Unix.txt';
    var file2 = new read(__dirname + mockfile);
    var fs = require('fs');
    var lines = fs.readFileSync(__dirname + mockfile).toString().split('\n');
    var numLines = 0;
    var expectNumLines = lines.length;
    file2.on('error', function(err) {
      console.log(err);
    });
    file2.on('line', function(line, next) {
      var expectedLine = lines.shift();
      if (numLines < 19) {
        assert.equal(line, expectedLine);
        debug(line);
        numLines++;
      }
      next();
    });
    file2.on('end', function() {
      assert.equal(numLines, (expectNumLines - 1));
      file2.removeAllListeners();
      file2.close(function() {
        done();
      });
    });
  });

  it('emits open, line and end events', function(done) {
    var file = new read(__dirname + '/fixtures/Unix.txt');
    var checks = 0;
    file.removeAllListeners();
    debugger;
    file.on('open', function() {
      checks++;
    });
    file.on('line', function(line) {
      debugger;
      checks++;
      file.close(function(err) {
        if (err) {
          done(err);
        } else {
          checks++;
          assert.equal(checks, 3);
          done();
        }
      });
    });

    file.on('error', function(err) {
      console.log(err);
      done(err);
    });
  });
});
/*
it.skip('Should if line is the same size than the buffer', function(done) {
  var file = new read(__dirname + '/fixtures/sameLineSizeThanBuffer.txt');
  var lines = ['1ffer is set to 200, don\'t ask me why, it should b',
    '2ffer is set to 200, don\'t ask me why, it should b',
    '3ffer is set to 200, don\'t ask me why, it should b',
    '4ffer is set to 200, don\'t ask me why, it should b',
    '5ffer is set to 200, don\'t ask me why, it should b'
  ];
  var originalNumberOfLines = lines.length;
  var countedNumberOfLines = 0;

  file.on('line', function(line, next) {
    debug('got: ' + line);
    var expectedLine = lines.shift();
    debug('exp: ' + expectedLine);
    assert.equal(line, expectedLine);
    countedNumberOfLines++;
    next();
  });

  file.on('end', function() {
    assert.equal(originalNumberOfLines, countedNumberOfLines);
    done();
  });
});
*/
