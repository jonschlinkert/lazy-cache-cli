'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./utils');
var cwd = utils.cwd;
var keys;

/**
 * Update `package.json` with the added file
 */

exports.updatePkg = function(files, cb) {
  if (typeof files === 'function') {
    cb = files;
    files = 'utils.js';
  }

  files = arrayify(files);
  var pkg = utils.pkg();
  var len = files.length, i = -1;
  var arr = [];

  while (++i < len) {
    if (pkg.files.indexOf(files[i]) > -1) continue;
    arr.push(files[i]);
  }

  if (!arr.length) {
    return cb(null, false);
  }

  pkg.files = pkg.files.concat(files);
  pkg.files.sort();
  utils.writeJson(cwd('package.json'), pkg, function (err) {
    if (err) return console.error(err);
    return cb(null, true);
  });
};

/**
 * Add a `utils.js` file, or specified filepath
 */

exports.addUtils = function(filepath, cb) {
  if (typeof filepath === 'function') {
    cb = filepath;
    filepath = 'utils.js';
  }

  var templatePath = path.join(__dirname, 'template.js');
  var template = fs.readFileSync(templatePath, 'utf8');
  var str = createUtils(template, utils.pkg());

  utils.writeFile(cwd(filepath), str, function (err) {
    if (err) return cb(err);

    exports.updatePkg(filepath, function(err, res) {
      if (err) return cb(err);
      cb(null, res);
    });
  });
};

/**
 * Create the listing of utils to add to the template
 */

function createUtils(template, pkg) {
  keys || (keys = Object.keys(pkg.dependencies));
  var len = keys.length, i = -1;
  var res = [];

  while (++i < len) {
    var key = keys[i];
    if (key === 'lazy-cache') continue;
    res.push('require(\'' + key + '\');');
  }

  var snippet = res.join('\n');
  return utils.inject(template, snippet, {
    stripTags: true
  });
}

function arrayify(val) {
  return Array.isArray(val) ? val : [val];
}
