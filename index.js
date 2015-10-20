'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./utils');

module.exports = function() {

};

var pkg = utils.pkg();
var cwd = utils.cwd;
var keys = Object.keys(pkg.dependencies);

if (!fs.existsSync(cwd('utils.js'))) {
  var templatePath = path.join(__dirname, 'template.js');
  var template = fs.readFileSync(templatePath, 'utf8');
  var str = createUtils(template, keys);
  utils.writeFile(cwd('utils.js'), str, function (err) {
    if (err) return console.error(err);
    success('added utils.js');
  });
} else {
  success('utils.js already exists');
}

if (pkg.files.indexOf('utils.js') === -1) {
  pkg.files.push('utils.js');
  utils.writeJson.sync(cwd('package.json'), pkg, function (err) {
    if (err) return console.error(err);
    success('updated package.json `files` with utils.js');
  });
} else {
  success('package.json `files` is up to date');
}

function createUtils(template, keys) {
  var snippet = keys.map(function (key) {
    return 'require(\'' + key + '\');';
  }).join('\n');

  return utils.inject(template, snippet, {
    stripTags: true
  });
}

function success() {
  var args = [].slice.call(arguments);
  args.unshift(utils.green(utils.success));
  console.log.apply(console, args);
}
