var assert = require('assert');
var LogStorage = require('../index').LogStorage;
describe('logstorage', function(){
  describe('constructor', function(){
    it('should return instance with namespace', function(){
      var namespace = 'application';
      var logStorage = new LogStorage(namespace);
      assert.ok(!!logStorage);
      assert.deepEqual(logStorage.namespace, namespace);
    });
  });
});
