#!/usr/bin/env node

var path = require('path');
var configfile = path.resolve(__dirname, '../lib/config.js');
var opts = {alias: {dest: 'd', tmpl: 't', name: 'n'}};
var argv = require('yargs-parser')(process.argv.slice(2), opts);
var conflicts = require('base-fs-conflicts');
var store = require('base-store');
var Lazy = require('base-app');
var tasks = argv._.length ? argv._ : ['default'];

Lazy.use(function fn() {
  if (!argv.v && !argv.verbose) {
    this.options.silent = true;
  }
  this.isApp = true;

  this.use(store('lazy-cache-aliases'));
  this.use(conflicts());
  return fn;
});

/**
 * Get the Base ctor and instance to use
 */

var app = new Lazy(argv)
  .use(require(configfile));

/**
 * Run tasks
 */

app.build(tasks, function(err) {
  if (err) handleError(err);
  app.emit('done');
});

function handleError(err) {
  console.error(err.stack);
  process.exit(1);
}
