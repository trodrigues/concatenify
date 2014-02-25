'use strict';

var concatenify = require('../');
var browserify = require('browserify');
var vm = require('vm');
var test = require('tap').test;

var b = browserify();
b.add(__dirname+'/files/app.js');
b.transform(concatenify);

test(function (t) {
  b.bundle(function (err, src) {
    var calls = [];
    vm.runInNewContext(src, { console: { log: log } });

    function log(msg) {
      calls.push(msg);
    }

    t.equal(calls[0], 'lib1');
    t.equal(calls[1], 'lib2');
    t.equal(calls[2], 'util1');
    t.equal(calls[3], 'util2');
    t.equal(calls[4], 'app');
    t.end();
  });
});
