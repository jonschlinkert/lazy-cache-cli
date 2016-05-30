'use strict';

var re = /^\w+\(['"]([^)]+)['"]\)/gm;

module.exports = function(str, tokens) {
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
