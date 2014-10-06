/// <reference path="types/node.d.ts" />

export module LogStorage {
  "use strict";

  enum Level {
    TRACE,
    DEBUG,
    INFO,
    WORN,
    ERROR,
  }

  export interface ILogger {
    trace(...args: any[]): void;
    debug(...args: any[]): void;
    info(...args: any[]): void;
    worn(...args: any[]): void;
    error(...args: any[]): void;
    clear(): void;
  }

  export interface IDB {
    set(key: string, value: Object): void;
    get(key: string): Object;
    clear(): void;
  }

  export class DB implements IDB {
    private db: Storage;

    constructor() {
      if (typeof localStorage === "undefined" || localStorage === null) {
        this.db = require("localStorage");
      } else {
        this.db = localStorage;
      }
    }

    set(key: string, value: Object): void {
      this.db.setItem(key, JSON.stringify(value));
    }

    get(key: string): Object {
      return JSON.parse(this.db.getItem(key));
    }

    clear(): void {
      this.db.clear();
    }
  }

  export class Logger implements ILogger {
    private namespace: string;
    private db: DB;

    constructor(namespace: string) {
      this.namespace = namespace;
      this.db = new DB();
    }

    private write(level: Level, args: any[]): void {
      var timestamp: string = (new Date(Date.now())).toISOString();
      var messages: string  = Array.prototype.join.call(args, " ");

      while (this.db.get(timestamp)) {
        timestamp += "#";
      }

      console.log(timestamp, {
        message: messages,
        timestamp: timestamp,
        level: level
      });
    }

    trace(...args: any[]): void {
      this.write(Level.TRACE, args);
    }

    debug(...args: any[]): void {
      this.write(Level.DEBUG, args);
    }

    info(...args: any[]): void {
      this.write(Level.INFO, args);
    }

    worn(...args: any[]): void {
      this.write(Level.WORN, args);
    }

    error(...args: any[]): void {
      this.write(Level.ERROR, args);
    }

    clear(): void {
      this.db.clear();
    }
  }
}
