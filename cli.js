#!/usr/bin/env node

process.title = 'lazy-cli';

var fs = require('fs');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2), {
  alias: {f: 'filepath'}
});

var filepath = argv.f || utils.cwd('utils.js');

if (!fs.existsSync(filepath)) {
  lazy.addUtils(function(err) {
    if (err) return console.error(err);
    success('added "' + filepath + '"');
  });
} else {
  success('"' + filepath + '" already exists');
}

if (pkg.files.indexOf(filepath) === -1) {
  lazy.updatePkg(function(err) {
    if (err) return console.error(err);
    success('updated package.json `files` "' + filepath + '"');
  });
} else {
  success('package.json `files` is up to date');
}

function success() {
  var args = [].slice.call(arguments);
  args.unshift(utils.green(utils.success));
  console.log.apply(console, args);
}
