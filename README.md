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
    var file = new ReadLines('/path/to/my/file');

    file.on('open', function(err) {
      //call read for start reading the first line
      file.read(); 
    });
    
    file.on('line', function(line, next) {
      console.log(line);
      //You call next to get the next line
      next();
    });

    file.on('error', function(err) {
      // handle here the errors
    });


