var assert;

if (typeof module !== 'undefined') { // for node
  assert = require('assert');
  localStorage = require('localStorage');
  LogStorage = require('../').LogStorage;
}

describe('logstorage', function(){
  var namespace, logStorage;
  beforeEach(function() {
    namespace = 'application';
    logStorage = new LogStorage(namespace);
  });

  afterEach(function() {
    logStorage.clear();
    namespace = null;
    logStorage = null;
  });

  it('constructor', function(){
    assert.ok(!!logStorage);
    assert.ok(!!logStorage.db);
    assert.deepEqual(logStorage.namespace, namespace);
  });

  it('#set', function() {
    var key = 'key', value = 'value';
    logStorage.set(key, value);
    assert.deepEqual(value, JSON.parse(logStorage.db.getItem(key)));
  });

  it('#get', function() {
    var key = 'key', value = 'value';
    logStorage.db.setItem(key, JSON.stringify(value));
    assert.deepEqual(value, logStorage.get(key));
  });

  it('#clear', function() {
    var max = 10;
    for(var i = 0; i < max; i++) {
      logStorage.set(i, i + 'a');
    }
    assert.deepEqual(logStorage.db.length, max);
    logStorage.clear();
    assert.deepEqual(logStorage.db.length, 0);
  });

  it('#each', function() {
    logStorage.each(function(k, v) {
      assert.deepEqual(k + 'a', v);
    });
  });
});
