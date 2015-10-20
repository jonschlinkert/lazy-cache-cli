'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./utils');
var cwd = utils.cwd;

/**
 * Update `package.json` with the added file
 */

exports.updatePkg = function(filepath, cb) {
  if (typeof filepath === 'function') {
    cb = filepath;
    filepath = 'utils.js';
  }

  var pkg = utils.pkg();

  if (pkg.files.indexOf(filepath) !== -1) {
    return cb(null, false);
  }

  pkg.files.push(filepath);
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
  var keys = Object.keys(pkg.dependencies);
  var snippet = keys.map(function (key) {
    return 'require(\'' + key + '\');';
  }).join('\n');

  return utils.inject(template, snippet, {
    stripTags: true
  });
}
