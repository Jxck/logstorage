function Logger(category, format) {
  this.slice = Array.prototype.slice;
  this.category = category;
  this.out = {
    FATAL: console.fatal || console.log,
    ERROR: console.error || console.log,
    WARN : console.warn  || console.log,
    INFO : console.info  || console.log,
    DEBUG: console.debug || console.log,
    TRACE: console.trace || console.log
  }

  this.format = format || "%date [%level] %category [%file] - %message";
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
  log = log.replace("%date", this._date());
  log = log.replace("%category", this.category);
  log = log.replace("%level", level);
  log = log.replace("%file", this._file());

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
  log = log.replace("%message", message);

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

var logger = Logger.getLogger('APP');
var a = { hoge: 100 };
logger.fatal('the value of hoge', a, 'is', 100);
logger.error('the value of hoge', a, 'is', 100);
logger.warn('the value of hoge', a, 'is', 100);
logger.info('the value of hoge', a, 'is', 100);
logger.debug('the value of hoge', a, 'is', 100);
logger.trace('the value of hoge', a, 'is', 100);
