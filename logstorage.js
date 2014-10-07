!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.LogStorage=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/// <reference path="types/node.d.ts" />
var LogStorage;
(function (LogStorage) {
    "use strict";
    (function (Level) {
        Level[Level["TRACE"] = 0] = "TRACE";
        Level[Level["DEBUG"] = 1] = "DEBUG";
        Level[Level["INFO"] = 2] = "INFO";
        Level[Level["WORN"] = 3] = "WORN";
        Level[Level["ERROR"] = 4] = "ERROR";
    })(LogStorage.Level || (LogStorage.Level = {}));
    var Level = LogStorage.Level;
    var Message = (function () {
        function Message(message, timestamp, level) {
            this.message = message;
            this.timestamp = timestamp;
            this.level = level;
        }
        return Message;
    })();
    LogStorage.Message = Message;
    var DB = (function () {
        function DB() {
            if (typeof localStorage === "undefined" || localStorage === null) {
                this.db = _dereq_("localStorage");
            }
            else {
                this.db = localStorage;
            }
        }
        DB.prototype.set = function (key, value) {
            this.db.setItem(key, JSON.stringify(value));
        };
        DB.prototype.get = function (key) {
            return JSON.parse(this.db.getItem(key));
        };
        DB.prototype.each = function (fn) {
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                fn(k, this.get(k));
            }
        };
        DB.prototype.clear = function () {
            this.db.clear();
        };
        return DB;
    })();
    LogStorage.DB = DB;
    var Logger = (function () {
        function Logger(namespace) {
            this.namespace = namespace;
            this.db = new DB();
        }
        Logger.prototype.write = function (level, args) {
            var timestamp = (new Date(Date.now())).toISOString();
            var messages = Array.prototype.join.call(args, " ");
            var message = new Message(messages, timestamp, level);
            while (this.db.get(timestamp)) {
                timestamp += "#";
            }
            this.db.set(timestamp, message);
        };
        Logger.prototype.trace = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this.write(0 /* TRACE */, args);
        };
        Logger.prototype.debug = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this.write(1 /* DEBUG */, args);
        };
        Logger.prototype.info = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this.write(2 /* INFO */, args);
        };
        Logger.prototype.worn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this.write(3 /* WORN */, args);
        };
        Logger.prototype.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this.write(4 /* ERROR */, args);
        };
        Logger.prototype.dump = function (level) {
            if (typeof level === "undefined") {
                level = 0 /* TRACE */;
            }
            var keys = [];
            var cache = {};
            var values = [];
            this.db.each(function (key, value) {
                if (value.level > level) {
                    return;
                }
                keys.push(key);
                cache[key] = value;
            });
            keys.sort();
            for (var i = 0; i < keys.length; i++) {
                values.push(cache[keys[i]]);
            }
            return values;
        };
        Logger.prototype.pack = function (messages) {
            return messages.map(function (m) {
                return [m.timestamp, Level[m.level], m.message].join(" ");
            }).join("\n");
        };
        Logger.prototype.clear = function () {
            this.db.clear();
        };
        return Logger;
    })();
    LogStorage.Logger = Logger;
})(LogStorage = exports.LogStorage || (exports.LogStorage = {}));

},{"localStorage":2}],2:[function(_dereq_,module,exports){
(function (global){
// http://www.rajdeepd.com/articles/chrome/localstrg/LocalStorageSample.htm

// NOTE:
// this varies from actual localStorage in some subtle ways

// also, there is no persistence
// TODO persist
(function () {
  "use strict";

  var db;

  function LocalStorage() {
  }
  db = LocalStorage;

  db.prototype.getItem = function (key) {
    if (this.hasOwnProperty(key)) {
      return String(this[key]);
    }
    return null;
  };

  db.prototype.setItem = function (key, val) {
    this[key] = String(val);
  };

  db.prototype.removeItem = function (key) {
    delete this[key];
  };

  db.prototype.clear = function () {
    var self = this;
    Object.keys(self).forEach(function (key) {
      self[key] = undefined;
      delete self[key];
    });
  };

  db.prototype.key = function (i) {
    i = i || 0;
    return Object.keys(this)[i];
  };

  db.prototype.__defineGetter__('length', function () {
    return Object.keys(this).length;
  });

  if (global.localStorage) {
    module.exports = localStorage;
  } else {
    module.exports = new LocalStorage();
  }
}());

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])
(1)
});