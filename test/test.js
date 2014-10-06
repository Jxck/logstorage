var assert;

if (typeof module !== 'undefined') { // for node
  assert = require('assert');
  localStorage = require('localStorage');
  LogStorage = require('../logstorage').LogStorage;
} else {
  LogStorage = LogStorage.LogStorage;
}


describe('db', function() {
  var DB = LogStorage.DB;
  var db = new DB();

  beforeEach(function() {
    db.clear();
  });

  it('#set', function() {
    var key = 'key', value = 'value';
    db.set(key, value);
    assert.deepEqual(value, JSON.parse(localStorage.getItem(key)));
  });

  it('#get', function() {
    var key = 'key', value = 'value';
    localStorage.setItem(key, JSON.stringify(value));
    assert.deepEqual(value, db.get(key));
  });

  it('#clear', function() {
    var max = 10;
    for(var i = 0; i < max; i++) {
      db.set(i, i + 'a');
    }
    assert.deepEqual(localStorage.length, max);
    db.clear();
    assert.deepEqual(localStorage.length, 0);
  });

  //it('#each', function() {
  //  logStorage.each(function(k, v) {
  //    assert.deepEqual(k + 'a', v);
  //  });
  //});
});

/**
describe('logstorage', function(){
  var namespace, logStorage;
  beforeEach(function() {
    namespace = 'application';
    logStorage = new LogStorage.LogStorage(namespace);
  });

  afterEach(function() {
    logStorage.clear();
    namespace = null;
    logStorage = null;
  });

  it('constructor', function(){
    assert.ok(!!logStorage);
    assert.deepEqual(logStorage.namespace, namespace);
  });

});
*/
