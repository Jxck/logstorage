/// <reference path="../types/node.d.ts" />
export declare module LogStorage {
    enum Level {
        TRACE = 0,
        DEBUG = 1,
        INFO = 2,
        WORN = 3,
        ERROR = 4,
    }
    interface ILogger {
        trace(...args: any[]): void;
        debug(...args: any[]): void;
        info(...args: any[]): void;
        worn(...args: any[]): void;
        error(...args: any[]): void;
        clear(): void;
    }
    interface IDB {
        set(key: string, value: any): void;
        get(key: string): any;
        clear(): void;
    }
    class Message {
        message: string;
        timestamp: string;
        level: Level;
        constructor(message: string, timestamp: string, level: Level);
    }
    class DB implements IDB {
        private db;
        constructor();
        set(key: string, value: any): void;
        get(key: string): any;
        each(fn: (key: string, value: any) => void): void;
        clear(): void;
    }
    class Logger implements ILogger {
        private namespace;
        private db;
        constructor(namespace: string);
        private write(level, args);
        trace(...args: any[]): void;
        debug(...args: any[]): void;
        info(...args: any[]): void;
        worn(...args: any[]): void;
        error(...args: any[]): void;
        dump(level: Level): Message[];
        pack(messages: Message[]): string;
        clear(): void;
    }
}
