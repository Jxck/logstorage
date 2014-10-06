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
        public message: string;
        public timestamp: string;
        public level: Level;
        constructor(message: string, timestamp: string, level: Level);
    }
    class DB implements IDB {
        private db;
        constructor();
        public set(key: string, value: any): void;
        public get(key: string): any;
        public each(fn: (key: string, value: any) => void): void;
        public clear(): void;
    }
    class Logger implements ILogger {
        private namespace;
        private db;
        constructor(namespace: string);
        private write(level, args);
        public trace(...args: any[]): void;
        public debug(...args: any[]): void;
        public info(...args: any[]): void;
        public worn(...args: any[]): void;
        public error(...args: any[]): void;
        public dump(level: Level): Message[];
        private pack(messages);
        public clear(): void;
    }
}
