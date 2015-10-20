'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./utils');
var cwd = utils.cwd;

exports.updatePkg = function(pkg, cb) {
  if (typeof pkg === 'function') {
    cb = pkg;
    pkg = utils.pkg();
  }

  if (pkg.files.indexOf('utils.js') !== -1) {
    return cb();
  }

  pkg.files.push('utils.js');
  var filepath = cwd('package.json');
  utils.writeJson(filepath, pkg, function (err) {
    if (err) return console.error(err);
    return cb();
  });
};

exports.addUtils = function(filepath, cb) {
  if (typeof filepath === 'function') {
    cb = filepath;
    filepath = cwd('utils.js');
  }

  var templatePath = path.join(__dirname, 'template.js');
  var template = fs.readFileSync(templatePath, 'utf8');
  var str = createUtils(template, utils.pkg());

  utils.writeFile(filepath, str, function (err) {
    if (err) return cb(err);
    cb();
  });
};

function createUtils(template, pkg) {
  var keys = Object.keys(pkg.dependencies);
  var snippet = keys.map(function (key) {
    return 'require(\'' + key + '\');';
  }).join('\n');

  return utils.inject(template, snippet, {
    stripTags: true
  });
}
