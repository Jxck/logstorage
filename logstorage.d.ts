/// <reference path="../types/node.d.ts" />
export declare module LogStorage {
    interface ILogger {
        trace(...args: any[]): void;
        debug(...args: any[]): void;
        info(...args: any[]): void;
        worn(...args: any[]): void;
        error(...args: any[]): void;
        clear(): void;
    }
    interface IDB {
        set(key: string, value: Object): void;
        get(key: string): Object;
        clear(): void;
    }
    class DB implements IDB {
        private db;
        constructor();
        public set(key: string, value: Object): void;
        public get(key: string): Object;
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
        public clear(): void;
    }
}
