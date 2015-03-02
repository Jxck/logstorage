function Logger(category, option) {
  this.slice = Array.prototype.slice;
  this.category = category;

  option = option || {};

  var noop = function() {};

  this.out = {
    TRACE: noop,
    DEBUG: noop,
    INFO: noop,
    WARN: noop,
    ERROR: noop,
    FATAL: noop
  };

  var loglevel = option.loglevel || 'TRACE';
  var defaultlog = console.log;

  switch (loglevel) {
    // use fallthrough for loglevel
    case 'TRACE':
      this.out.TRACE = console.trace || defaultlog;
    case 'DEBUG':
      this.out.DEBUG = console.debug || defaultlog;
    case 'INFO':
      this.out.INFO = console.info || defaultlog;
    case 'WARN':
      this.out.WARN = console.warn || defaultlog;
    case 'ERROR':
      this.out.ERROR = console.error || defaultlog;
    case 'FATAL':
      this.out.FATAL = console.fatal || defaultlog;
    default:
  }

  this.format = option.format || '%date [%level] %category [%file] - %message';

  this._save = noop;

  if (option.storage) {
    if (option.storage.type === 'localStorage' && typeof localStorage !== 'undefined') {
      var limit = option.storage.limit || 20 * 1000; // 20K
      if (limit > 20 * 2000) throw new Error('not recommend over 20K to log storage limit for localStorage');

      var key = option.storage.key || 'logstorage';
      this._save = function(log) {
        setTimeout(function() {
          var saved = localStorage.getItem(key);
          if (saved) {
            saved = saved + '\n' + log;
          } else {
            saved = log;
          }
          if (saved.length > limit) {
            var logs = saved.split('\n');
            var start = logs.length * 0.5;
            saved = logs.slice(start).join('\n');
          }
          localStorage.setItem(key, saved);
        }, 0);
      };
    }
  }
}

Logger.getLogger = function(category, option) {
  return new Logger(category, option);
};

Logger.prototype._date = function() {
  return new Date().toISOString();
};

Logger.prototype._file = function() {
  // get the stack trace
  var trace = (new Error()).stack.split('\n')[1];
  // extract file path
  var file = /\((.*?)\)/.exec(trace)[1];
  // return only file name and line number
  return file.split('/').pop();
};

Logger.prototype._write = function(level, args) {
  var log = this.format;
  log = log.replace('%date', this._date());
  log = log.replace('%category', this.category);
  log = log.replace('%level', level);
  log = log.replace('%file', this._file());

  var message = args.map(function(arg) {
    if (!arg) return '';

    if (typeof arg === 'string') {
      return arg;
    }

    if ([ 'number', 'function' ].indexOf(typeof arg) > 0) {
      return arg.toString();
    }

    return JSON.stringify(arg);
  }).join(' ');

  log = log.replace('%message', message);

  this.out[level].call(console, log);

  this._save(log);
};

Logger.prototype.fatal = function() {
  var args = this.slice.call(arguments);
  this._write('FATAL', args);
};

Logger.prototype.error = function() {
  var args = this.slice.call(arguments);
  this._write('ERROR', args);
};

Logger.prototype.warn = function() {
  var args = this.slice.call(arguments);
  this._write('WARN', args);
};

Logger.prototype.info = function() {
  var args = this.slice.call(arguments);
  this._write('INFO', args);
};

Logger.prototype.debug = function() {
  var args = this.slice.call(arguments);
  this._write('DEBUG', args);
};

Logger.prototype.trace = function() {
  var args = this.slice.call(arguments);
  this._write('TRACE', args);
};

this.Logger = Logger;
