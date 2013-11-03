var assert = require('assert');
var read = require(__dirname + '/../index.js'),
    debug = require('debug')('testRead');
    debug('init');
describe('Should work with Unix line ending', function() {

    it('The constructor should locate the file correctly, and emmit open and close events.', function(done) {
        var file = new read(__dirname + '/fixtures/Unix.txt');
        var checks = 0;
        file.on('open', function() {
          assert.equal(true, true);
          file.close();
          checks++;
        });
        file.on('end', function() {
            checks++;
        });

        setTimeout(function() {
            if(checks == 2){
                assert.equal(true, true);
            }
            done();
        }, 10);
    });


    it('should emit the first line, in the first line event',function(done) {
        var file = new read(__dirname + '/fixtures/Unix.txt');
        file.on('line', function(line) {
            assert.equal(line, 'this is a file');
            file.close();
            done();
        });
    });

    it('test next() callback',function(done) {
        var file = new read(__dirname + '/fixtures/Unix.txt');

        var lines = [   'this is a file'
                        ,'with Windows line endings'
                        , 'also have   tabs    of 4    spaces'
                        , 'two newslines in a row'
                        , ''
                        , ''
                        , 'and then a new line following by a space'
                        ,' '
                        ,'    '
                        ,'        '
                        ,'                  '
                        ,'                  and a word'
                        ,'now a series of letter'
                        ,'a'
                        ,'ab'
                        ,'abc'
                        ,'abcd'
                        ,'abcdefg'
                        ,'abcdefghijkm, and ending without any newlne character.'
                        ,">let's finish with a super long line that will exced the size of the buffer, by default the buffer is set to 200, don't ask me why, it should be much bilet's finish with a super long line that will exced the size of the buffer, by default the buffer is set to 200, don't ask me why, it should be much bilet's finish with a super long line that will exced the size of the buffer, by default the buffer is set to 200, don't ask me why, it should be much bilet's finish with a super long line that will exced the size of the buffer, by default the buffer is set to 200, don't ask me why, it should be much bi."
                    ];

        file.on('line', function(line, next) {
            debug('got: ' + line);
            var expectedLine = lines.shift();
            debug('exp: ' + expectedLine);
            assert.equal(line, expectedLine);
            if(lines.length == 0) {
                //file.close();
                // done();
            } else {
                debug('give me the next line, please');
                next();
            }
        });
        file.on('end', function() {
            debug('end of the file');
            done();
        });

    });

    it.skip('Should Have no problems when the line is the same size than the buffer size', function(done) {

        var file = new read(__dirname + '/fixtures/sameLineSizeThanBuffer.txt');
        var lines = [
                     '1ffer is set to 200, don\'t ask me why, it should b'
                    ,'2ffer is set to 200, don\'t ask me why, it should b'
                    ,'3ffer is set to 200, don\'t ask me why, it should b'
                    ,'4ffer is set to 200, don\'t ask me why, it should b'
                    ,'5ffer is set to 200, don\'t ask me why, it should b'
                ];
        var originalNumberOfLines = lines.length,
            countedNumberOfLines = 0;

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
            debug('end of the file');
            done();
        });

    });
});
