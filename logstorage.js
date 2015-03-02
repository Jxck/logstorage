function Logger(category, format, loglevel) {
  this.slice = Array.prototype.slice;
  this.category = category;

  var noop = function(){};
  this.out = {
    TRACE: noop,
    DEBUG: noop,
    INFO : noop,
    WARN : noop,
    ERROR: noop,
    FATAL: noop,
  }

  loglevel = loglevel || 'TRACE';
  switch (loglevel){
    case 'TRACE':
      this.out.TRACE = console.trace || console.log;
    case 'DEBUG':
      this.out.DEBUG = console.debug || console.log;
    case 'INFO':
      this.out.INFO = console.info  || console.log;
    case 'WARN':
      this.out.WARN = console.warn  || console.log;
    case 'ERROR':
      this.out.ERROR = console.error || console.log;
    case 'FATAL':
      this.out.FATAL = console.fatal || console.log;
    default:
  }

  this.format = format || '%date [%level] %category [%file] - %message';
}

Logger.getLogger = function(category, format) {
  return new Logger(category, format);
}

Logger.prototype._date = function() {
  return new Date().toISOString();
}

Logger.prototype._file = function () {
  // get the stack trace
  var trace = (new Error()).stack.split('\n')[1];
  // extract file path
  var file = /\((.*?)\)/.exec(trace)[1];
  // return only file name and line number
  return file.split('/').pop();
}

Logger.prototype._write = function(level, args) {
  var log = this.format;
  log = log.replace('%date', this._date());
  log = log.replace('%category', this.category);
  log = log.replace('%level', level);
  log = log.replace('%file', this._file());

  var message = args.map(function(arg) {
    if (!arg) return '';

    if (typeof arg === 'string') {
      return arg
    }

    if (['number', 'function'].indexOf(typeof arg) > 0) {
      return arg.toString();
    }

    return JSON.stringify(arg);
  }).join(' ');

  log = log.replace('%message', message);

  this.out[level].call(console, log);
}

Logger.prototype.fatal = function() {
  var args = this.slice.call(arguments);
  this._write('FATAL', args);
}

Logger.prototype.error = function() {
  var args = this.slice.call(arguments);
  this._write('ERROR', args);
}

Logger.prototype.warn = function() {
  var args = this.slice.call(arguments);
  this._write('WARN', args);
}

Logger.prototype.info = function() {
  var args = this.slice.call(arguments);
  this._write('INFO', args);
}

Logger.prototype.debug = function() {
  var args = this.slice.call(arguments);
  this._write('DEBUG', args);
}

Logger.prototype.trace = function() {
  var args = this.slice.call(arguments);
  this._write('TRACE', args);
}

var format = '[%date] %category %level (%file) - %message';
var logger = Logger.getLogger('APP', format);
var a = { hoge: 100 };
logger.trace('the value of "hoge" at', a, 'is', 100);
logger.debug('the value of "hoge" at', a, 'is', 100);
logger.info( 'the value of "hoge" at', a, 'is', 100);
logger.warn( 'the value of "hoge" at', a, 'is', 100);
logger.error('the value of "hoge" at', a, 'is', 100);
logger.fatal('the value of "hoge" at', a, 'is', 100);
