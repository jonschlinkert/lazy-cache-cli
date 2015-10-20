'use strict';

require('mocha');
var fs = require('fs');
var assert = require('assert');
var del = require('delete');
var writeJson = require('write-json');
var utils = require('./utils');
var lazy = require('./');

describe('lazy-cache cli', function () {
  it('should add the specified file:', function (done) {
    lazy.addUtils('foo.js', function (err) {
      if (err) return done(err);
      assert(fs.existsSync('foo.js'));
      var pkg = utils.pkg();
      var idx = pkg.files.indexOf('foo.js');
      assert(idx > -1);
      pkg.files.splice(idx, 1);

      writeJson('package.json', pkg, function(err) {
        if (err) return done(err);

        del('foo.js', function (err) {
          if (err) return done(err);
          done();
        });
      });
    });
  });
});
