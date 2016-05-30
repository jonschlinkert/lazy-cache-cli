'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('fs-exists-sync', 'exists');
require('inject-snippet', 'inject');
require('through2', 'through');
require = fn;

utils.parse = function(str, tokens) {
  var re = /^\w+\(['"]([^)]+)['"]\)/gm;
  tokens = tokens || [];
  var matches = str.match(re);
  if (!matches) return [];

  var len = matches.length;
  var idx = -1;

  while (++idx < len) {
    var match = matches[idx];
    var m = /\(['"]([^)]+)\)/.exec(match);
    if (!m) continue;
    var inner = chop(m[1]).split(/[, '"]+/);
    tokens.push({
      name: inner[0],
      alias: inner[1] || null
    });
  }
  return tokens;
};

function chop(str) {
  return str.replace(/^\W+|\W+$/g, '');
}

utils.createRequires = function(app, template) {
  var names = Object.keys(app.pkg.get('dependencies') || {});
  var res = [];

  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    var alias = app.store.get(name);

    if (name !== 'lazy-cache' && name !== 'debug') {
      if (typeof alias === 'string') {
        res.push(`require('${name}', '${alias}');`);
      } else {
        res.push(`require('${name}');`);
      }
    }
  }

  return utils.inject(template, res.join('\n'), {
    stripTags: true
  });
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
