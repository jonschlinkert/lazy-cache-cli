#!/usr/bin/env node

process.title = 'lazy-cli';

var fs = require('fs');
var path = require('path');
var lazy = require('./');
var utils = require('./utils');
var pkg = utils.pkg();
var argv = require('minimist')(process.argv.slice(2), {
  alias: {f: 'filepath'}
});

/**
 * The "lazy" file to add
 */

var filepath = argv.f || 'utils.js';

/**
 * Add the file if doesn't already exist
 */

if (!fs.existsSync(utils.cwd(filepath))) {
  lazy.addUtils(function(err, updated) {
    if (err) return console.error(err);
    success('added "' + filepath + '"');
    if (updated) {
      success('updated package.json `files` with: "' + filepath + '"');
    } else {
      success('package.json `files` is already up to date');
    }
  });
} else {
  success('filepath "' + filepath + '" already exists');

  if (pkg.files.indexOf(filepath) === -1) {
    lazy.updatePkg(function(err) {
      if (err) return console.error(err);
      success('updated package.json `files` with: "' + filepath + '"');
    });
  } else {
    success('package.json `files` is already up to date');
  }
}



function success() {
  var args = [].slice.call(arguments);
  args.unshift(utils.green(utils.success));
  console.log.apply(console, args);
}
