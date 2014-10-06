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

  // it('#each', function() {
  //   db.each(function(k, v) {
  //     assert.deepEqual(k + 'a', v);
  //   });
  // });
});

describe('logger', function(){
  var namespace, logger;
  beforeEach(function() {
    namespace = 'test';
    logger = new LogStorage.Logger(namespace);
  });

  afterEach(function() {
    logger.clear();
    namespace = null;
    logger = null;
  });

  it('constructor', function(){
    assert.deepEqual(logger.namespace, namespace);
  });

  it('dump', function() {
    for (var i = 0; i<10; i++) {
      logger.debug(i, 'a'+i);
    }

    var dumped = logger.dump('Trace');
    for (var i = 0; i<10; i++) {
      assert.deepEqual(dumped[i].message, i + ' a'+i);
    }
  });
});
