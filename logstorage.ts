/// <reference path="types/node.d.ts" />

export module LogStorage {
  "use strict";

  export enum Level {
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
    set(key: string, value: any): void;
    get(key: string): any;
    clear(): void;
  }

  export class Message {
    message: string;
    timestamp: string;
    level: Level;
    constructor(message: string, timestamp: string, level: Level) {
      this.message = message;
      this.timestamp = timestamp;
      this.level = level;
    }
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

    set(key: string, value: any): void {
      this.db.setItem(key, JSON.stringify(value));
    }

    get(key: string): any {
      return JSON.parse(this.db.getItem(key));
    }

    each(fn: (key: string, value: any) => void): void {
      for (var i: number = 0; i < localStorage.length; i++) {
        var k: string = localStorage.key(i);
        fn(k, this.get(k));
      }
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

      var message: Message = new Message(messages, timestamp, level);

      while (this.db.get(timestamp)) {
        timestamp += "#";
      }

      this.db.set(timestamp, message);
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

    dump(level: Level): Message[] {
      if (typeof level === 'undefined') {
        level = Level.TRACE;
      }

      var keys: string[] = [];
      var cache: any = {};
      var values: Message[] = [];
      this.db.each(function(key, value) {
        if (value.level > level) {
          return;
        }
        keys.push(key);
        cache[key] = value;
      });

      keys.sort();

      for (var k in keys) {
        values.push(cache[keys[k]]);
      }

      return values
    }

    private pack(messages: Message[]): string {
      return messages.map((m: Message): string => {
        return [m.timestamp, Level[m.level], m.message].join(' ');
      }).join('\n');
    }

    clear(): void {
      this.db.clear();
    }
  }
}
