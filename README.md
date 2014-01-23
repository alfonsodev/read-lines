[![Build Status](https://travis-ci.org/alfonsodev/read-lines.png?branch=master)](https://travis-ci.org/alfonsodev/read-lines) [![Coverage Status](https://coveralls.io/repos/alfonsodev/read-lines/badge.png)](https://coveralls.io/r/alfonsodev/read-lines)

read-lines
============
Read big files, line by line.

    npm install read-lines

##Usage
The module emits the first line and then stops until you call the  
```next()``` callback, in this way you can make async stuff with your line  
and call ```next()``` when your are done.  

    var ReadLines = require('read-lines');
    var read = new ReadLines('/path/to/my/file');

    read.on('line', function(line, next) {
      console.log(line);
      setTimeout(function() {
        next();
      },1000);
    });
    read.on('error', function(err) {
      // handle here the errors
    });


