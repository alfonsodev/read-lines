var fs = require ('fs'),
    debug = require('debug')('readline'),
    events = require('events');
debug('init');
var readline = function(fileName) {
    debug('readline constructor' + fileName);
    this.filePath = fileName;
    this.fileSize;
    this.bufferSize;
    this.fd;
    this.bufferPos = 0;
    this.currentLine = '';
    this.bufferedLines = [];
    var self = this;

    fs.stat(this.filePath, function(err, stat) {
        if(err) debug(err);
        self.fileSize = stat.size;
        if(stat.size > 200) {
            self.bufferSize = 50;
        } else {
            self.bufferSize = stat.size;
        }
    });

    fs.open(this.filePath, 'r', function(err, fd) {
        if(err) debug(err);
        self.fd = fd;
        self.read();
        self.emit('open');
        debug('open event emited');
    });

};

readline.prototype = new events.EventEmitter();
readline.prototype.close = function() {
    var self = this;
    fs.close(this.fd, function(err) {
      if (err) {
        debug(err);
      } else {
        debug('closing file');
        self.emit('end');
        debug('end event emited');
      }
    });
};

readline.prototype.read = function() {
    var self = this;
    // debug('READ from ' + self.bufferPos + ' > ' + numOfBytesToRead + ' bytes' );
    if(this.bufferedLines.length >= 1 ) {
        self.readFromBuffer();
    } else {
        self.readFromFile();
    }
};

readline.prototype.readFromBuffer = function() {
    var self = this;
    self.currentLine = self.bufferedLines.shift();
    debug('currentLine:' + self.currentLine);
    //if this line completes the file then ok , but if not , then read again.
    if(self.bufferedLines.length == 0 && self.bufferPos < self.fileSize ) {
        this.read();
    } else {
        self.emit('line', self.currentLine,  function() { self.read(); });
    }
};

/*
 * 
 *
 */
readline.prototype.readFromFile = function () {
    var self = this,
        buffer = new Buffer(this.bufferSize),
        numOfBytesToRead = (self.bufferPos + this.bufferSize) >= this.fileSize ?
                            this.fileSize - self.bufferPos
                            : this.bufferSize;

    fs.read(self.fd, buffer, 0, numOfBytesToRead, null, function(err, bytesRead, buffer) {
        if(self.bufferPos >= self.fileSize) {
            self.close();
        } else {
            self.bufferedLines = buffer.toString("utf8", 0, bytesRead).split('\n');
            if(self.bufferedLines.length > 1) {
                // self.bufferPos=self.bufferPos+1;
                var grabLine = self.bufferedLines.shift();
                debug('currentLine:' + self.currentLine + ' #'+ self.currentLine.length);
                if(self.currentLine.length>0){
                    grabLine = self.currentLine + grabLine;
                } else {
                    self.currentLine = grabLine;
                }
                self.emit('line', grabLine,  function() { self.read(); });
            } else {

                // no end of line found so keep reading
                 self.currentLine += self.bufferedLines.shift();
                 debugger;
                 self.read();
            }
        }
//        self.bufferPos = self.bufferPos + bytesRead;
    });
};

module.exports = readline;
