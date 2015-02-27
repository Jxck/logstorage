function Logger(category) {
  this.slice = Array.prototype.slice;
  this.category = category;
  this.out = {
    fatal: console.fatal || console.log,
    error: console.error || console.log,
    warn : console.warn  || console.log,
    info : console.info  || console.log,
    debug: console.debug || console.log,
    trace: console.trace || console.log
  }

  // pre concat LogLevel + Category + '-'
  this._fatal = '[FATAL] ' + this.category + ' -';
  this._error = '[ERROR] ' + this.category + ' -';
  this._warn  = '[WARN] '  + this.category + ' -';
  this._info  = '[INFO] '  + this.category + ' -';
  this._debug = '[DEBUG] ' + this.category + ' -';
  this._trace = '[TRACE] ' + this.category + ' -';
}

Logger.getLogger = function(category) {
  return new Logger(category);
}

// override for change timestamp format
Logger.prototype._time = function() {
  return '[' + new Date().toISOString() + ']';
}

Logger.prototype._save = function(line) {
}

Logger.prototype.fatal = function() {
  var line = [this._time(), this._fatal].concat(this.slice.call(arguments));
  this.out.fatal.apply(console, line);
  this._save(line);
}

Logger.prototype.error = function() {
  var line = [this._time(), this._error].concat(this.slice.call(arguments));
  this.out.error.apply(console, line);
  this._save(line);
}

Logger.prototype.warn = function() {
  var line = [this._time(), this._warn].concat(this.slice.call(arguments));
  this.out.warn.apply(console, line);
  this._save(line);
}

Logger.prototype.info = function() {
  var line = [this._time(), this._info].concat(this.slice.call(arguments));
  this.out.info.apply(console, line);
  this._save(line);
}

Logger.prototype.debug = function() {
  var line = [this._time(), this._debug].concat(this.slice.call(arguments));
  this.out.debug.apply(console, line);
  this._save(line);
}

Logger.prototype.trace = function() {
  var line = [this._time(), this._trace].concat(this.slice.call(arguments));
  this.out.trace.apply(console, line);
  this._save(line);
}

var logger = Logger.getLogger('APP');
var a = { hoge: 100 };
logger.fatal('the value of hoge', a, 'is', 100);
logger.error('the value of hoge', a, 'is', 100);
logger.warn('the value of hoge', a, 'is', 100);
logger.info('the value of hoge', a, 'is', 100);
logger.debug('the value of hoge', a, 'is', 100);
logger.trace('the value of hoge', a, 'is', 100);
