var TRACE = 'TRACE',
    DEBUG = 'DEBUG',
    ERROR = 'ERROR';


if (typeof localStorage === 'undefined' || localStorage === null) {
  localStorage = require('localStorage');
}

function LogStorage(namespace) {
  this.namespace = namespace;
}

LogStorage.prototype.set = function(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
};

LogStorage.prototype.get = function(key) {
  return JSON.parse(localStorage.getItem(key));
};

LogStorage.prototype.clear = function() {
  localStorage.clear();
};

LogStorage.prototype.each = function(fn) {
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      fn(k, this.get(k));
    }
  } catch (e) {
    for (var key in localStorage) {
      if (key === 'key') continue;
      fn(key, this.get(key));
    }
  }
};

LogStorage.prototype.dump = function(level) {
  if (level === 'All') level = undefined;

  var arr = [];
  this.each(function(k, value) {
    if (level && value.level !== level) {
      return;
    }
    arr.push(value);
  });
  return arr;
};

LogStorage.prototype.write = function(level, args) {
  var timestamp = (new Date(Date.now())).toISOString();
  var message = Array.prototype.join.call(args, ' ');
  var logObj = {
    message: message,
    timestamp: timestamp,
    level: level
  };

  while(this.get(timestamp)) {
    timestamp += '#';
  }

  // DEBUG
  logObj.message = timestamp;

  this.set(timestamp, logObj);
};

LogStorage.prototype.trace = function() {
  this.write(TRACE, arguments);
};

LogStorage.prototype.debug = function() {
  this.write(DEBUG, arguments);
};

LogStorage.prototype.error = function() {
  this.write(ERROR, arguments);
};

// upload
LogStorage.prototype.pack = function(level) {
  return this.dump(level)
             .map(function(e) {
               return [e.timestamp, e.level, e.message].join(' ');
             }).join('\n');
};

LogStorage.prototype.upload = function(level, url) {
  var boundary = '----WebKitFormBoundaryQgCIV7W1WxKLHtbA';
  var logfile = this.pack();

  var xhr = new XMLHttpRequest();
  xhr.open('POST', url);

  xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
  xhr.send([
    '--' + boundary,
    'Content-Disposition: form-data; name="file"; filename="log.txt"',
    'Content-Type: text/plain',
    '',
    logfile,
    '',
    '--' + boundary + '--'
  ].join('\n'));
};


// main

var appLogger = new LogStorage('app');

appLogger.clear();
appLogger.debug('b', 'd');
appLogger.debug('b', 'd');

var n = 0;
while(n++ < 10) {
  appLogger.trace('a', 1, 20);
}
appLogger.error('e');

appLogger.upload(TRACE, 'http://localhost:8080/receive');
