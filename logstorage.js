/// <reference path="types/node.d.ts" />
(function (LogStorage) {
    "use strict";

    var Level;
    (function (Level) {
        Level[Level["TRACE"] = 0] = "TRACE";
        Level[Level["DEBUG"] = 1] = "DEBUG";
        Level[Level["INFO"] = 2] = "INFO";
        Level[Level["WORN"] = 3] = "WORN";
        Level[Level["ERROR"] = 4] = "ERROR";
    })(Level || (Level = {}));

    var DB = (function () {
        function DB() {
            if (typeof localStorage === "undefined" || localStorage === null) {
                this.db = require("localStorage");
            } else {
                this.db = localStorage;
            }
        }
        DB.prototype.set = function (key, value) {
            this.db.setItem(key, JSON.stringify(value));
        };

        DB.prototype.get = function (key) {
            return JSON.parse(this.db.getItem(key));
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

            while (this.db.get(timestamp)) {
                timestamp += "#";
            }

            console.log(timestamp, {
                message: messages,
                timestamp: timestamp,
                level: level
            });
        };

        Logger.prototype.trace = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            this.write(0 /* TRACE */, args);
        };

        Logger.prototype.debug = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            this.write(1 /* DEBUG */, args);
        };

        Logger.prototype.info = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            this.write(2 /* INFO */, args);
        };

        Logger.prototype.worn = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            this.write(3 /* WORN */, args);
        };

        Logger.prototype.error = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            this.write(4 /* ERROR */, args);
        };

        Logger.prototype.clear = function () {
            this.db.clear();
        };
        return Logger;
    })();
    LogStorage.Logger = Logger;
})(exports.LogStorage || (exports.LogStorage = {}));
var LogStorage = exports.LogStorage;
