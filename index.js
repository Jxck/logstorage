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

LogStorage.prototype.upload = function(level, url, filename, options) {
  var logfile = this.pack(level);
  var xhr = new XMLHttpRequest();

  xhr.open('POST', url);

  if (options) {
    if (options.headers) {
      for (h in options.headers) {
        xhr.setRequestHeader(h, options.headers.h);
      }
    }
  }

  if (typeof Blob === 'undefined') {
    var boundary = '----logstrageboundary';
    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
    xhr.send([
        '--' + boundary,
        'Content-Disposition: form-data; name="file"; filename="' + filename + '"',
        'Content-Type: text/plain',
        '',
        logfile,
        '',
        '--' + boundary + '--'
        ].join('\n'));
  } else {
    var form = new FormData();
    var blob = new Blob([logfile], { type: 'text/plain' });

    form.append('file', blob, filename);
    xhr.send(form);
  }
};
