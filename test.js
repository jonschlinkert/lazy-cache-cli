'use strict';

require('mocha');
var fs = require('fs');
var assert = require('assert');
var del = require('delete');
var lazy = require('./');

describe('lazy-cache cli', function () {
  it('should add the specified file:', function (done) {
    lazy.addUtils('foo.js', function (err) {
      if (err) return done(err);
      assert(fs.existsSync('foo.js'));
      del('foo.js', function (err) {
        if (err) return done(err);
        done();
      });
    });
  });
});
