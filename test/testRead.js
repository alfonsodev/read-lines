var assert = require('assert');
var read = require(__dirname + '/../');

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
    file.on('open', function() {
      checks++;
    });
    file.on('line', function(line) {
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
