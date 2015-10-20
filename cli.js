#!/usr/bin/env node

process.title = 'lazy-cli';

var fs = require('fs');
var path = require('path');
var keys = Object.keys(pkg.dependencies);

if (!fs.existsSync(cwd('utils.js'))) {
  var templatePath = path.join(__dirname, 'template.js');
  var template = fs.readFileSync(templatePath, 'utf8');
  var str = createUtils(template, keys);
  writeFile(cwd('utils.js'), str, function (err) {
    if (err) return console.error(err);
    console.log(green(success), 'added utils.js');
  });
} else {
  console.log(green(success), 'utils.js already exists');
}

if (pkg.files.indexOf('utils.js') === -1) {
  pkg.files.push('utils.js');
  writeJson(cwd('package.json'), pkg, function (err) {
    if (err) return console.error(err);
    console.log(green(success), 'updated package.json `files` with utils.js');
  });
} else {
  console.log(green(success), 'package.json `files` is up to date');
}

function createUtils(template, keys) {
  var snippet = keys.map(function (key) {
    return 'require(\'' + key + '\');';
  }).join('\n');

  return inject(template, snippet, {
    stripTags: true
  });
}
