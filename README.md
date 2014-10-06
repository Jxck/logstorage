# LogStorage

store your log to localstorage.
and upload it via XHR as File.

## API

```js
var logger = new LogStorage.Logger('your name space');
logger.trace('trace log');
logger.debug('debug log');
logger.info('info log');
logger.worn('worn log');
logger.error('error log');
logger.clear();
```

## install & commands

```sh
$ npm install logstorage
```

you can call all build task from npm run-scripts.
(actually it calls gulp task, please see package.json scripts directive.

```sh
$ npm install
$ npm test
$ npm lint
$ npm bower
$ npm build
$ npm server
```

## contribution

- written in typescript.
- compile as commonjs module style.
- browserify it for browser.
- testing it in mocha.

## License

The MIT License (MIT)
Copyright (c) 2013 Jxck
