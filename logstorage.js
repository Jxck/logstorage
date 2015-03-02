function Logger(category, option) {
  this.slice = Array.prototype.slice;
  this.category = category;

  option = option || {};

  var noop = function() {};

  // initialize all output to noop
  this.out = {
    TRACE: noop,
    DEBUG: noop,
    INFO: noop,
    WARN: noop,
    ERROR: noop,
    FATAL: noop
  };

  // default loglevel is TRACE
  var loglevel = option.loglevel || 'TRACE';

  switch (loglevel) {
    // use fallthrough for loglevel
    case 'TRACE':
      this.out.TRACE = console.trace || console.log;
    case 'DEBUG':
      this.out.DEBUG = console.debug || console.log;
    case 'INFO':
      this.out.INFO = console.info || console.log;
    case 'WARN':
      this.out.WARN = console.warn || console.log;
    case 'ERROR':
      this.out.ERROR = console.error || console.log;
    case 'FATAL':
      this.out.FATAL = console.fatal || console.log;
    default:
  }

  // default format
  this.format = option.format || '%date [%level] %category [%file] - %message';

  // default save to storage
  this._save = noop;

  if (option.storage) {
    // storategy for logging to localStorage
    if (option.storage.type === 'localStorage' && typeof localStorage !== 'undefined') {

      // max limit to save to localStorage is 20K, ignore value over it.
      var limit = option.storage.limit || 20 * 1000; // 20K
      if (limit > 20 * 2000) throw new Error('not recommend over 20K to log storage limit for localStorage');

      // default key is logstorage
      var key = option.storage.key || 'logstorage';

      // override _save with saving log function
      this._save = function(log) {

        // make it non-blocking
        // TODO: replace this with setImmediate if ready
        setTimeout(function() {

          // get saved data
          var saved = localStorage.getItem(key);

          // append new log
          if (saved) {
            saved = saved + '\n' + log;
          } else {
            saved = log;
          }

          // if log overs limit
          if (saved.length > limit) {
            // remove first half line of log
            var logs = saved.split('\n');
            var start = logs.length * 0.5;
            saved = logs.slice(start).join('\n');
          }

          // save
          localStorage.setItem(key, saved);
        }, 0);
      };
    }
  }
}

// factory
Logger.getLogger = function(category, option) {
  return new Logger(category, option);
};

// override this for change format of DATE
Logger.prototype._date = function() {
  return new Date().toISOString();
};

// override this for chage getting file/line path
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

  // serialize arguments to message string
  var message = args.map(function(arg) {
    // null/undefined to empty string
    if (!arg) return '';

    // string as is
    if (typeof arg === 'string') {
      return arg;
    }

    // number, function toString()
    if ([ 'number', 'function' ].indexOf(typeof arg) > 0) {
      return arg.toString();
    }

    // otherwise to JSON
    return JSON.stringify(arg);
  }).join(' ');

  log = log.replace('%message', message);

  // call level specified function
  // lovel = 'TRACE' -> console.trace();
  this.out[level].call(console, log);

  // save to storage, it's non blocking withou callback
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
