// main

var appLogger = new LogStorage('app');

appLogger.clear();
appLogger.debug('b', 'd');
appLogger.debug('b', 'd');

var n = 0;
while(n++ < 10) {
  appLogger.trace('a', 1, 20);
}
appLogger.error('e');

console.log("up");
appLogger.upload(TRACE, 'http://localhost:8080/receive', 'browser.log', 'dummyauth');
