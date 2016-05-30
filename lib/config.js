'use strict';

var path = require('path');
var dir = path.resolve.bind(path, __dirname, 'templates');
var tokenize = require('./tokenize');
var conflicts = require('base-fs-conflicts');
var exists = require('fs-exists-sync');
var inject = require('inject-snippet');
var through = require('through2');

module.exports = function(app, base) {
  app.use(conflicts());
  app.set('lazyFile', path.resolve(app.cwd, 'utils.js'));

  app.task('default', function(cb) {
    var argv = base.get('cache.argv');
    var dest = argv.dest || app.cwd;
    var name = formatName(argv.name || 'utils.js');
    var tmpl = formatName(argv.tmpl || 'default.js');
    var lazyFile = path.resolve(app.cwd, name);
    app.set('lazyFile', lazyFile);

    if (exists(lazyFile)) {
      app.build('learn', cb);
      return;
    }

    return app.src(dir(tmpl))
      .pipe(render(app, argv))
      .pipe(rename(app, name))
      .pipe(app.conflicts(dest))
      .pipe(app.dest(dest));
  });

  app.task('learn', function(cb) {
    var file = app.get('lazyFile');
    console.log('Learning variables in', path.relative(app.cwd, file));
    return app.src(file, {cwd: app.cwd})
      .pipe(learn(app, app.options));
  });
};

function learn(app, argv) {
  return through.obj(function(file, enc, next) {
    var str = file.contents.toString();
    tokenize(str).forEach(function(token) {
      if (token.alias) {
        app.store.set(token.name, token.alias);
      }
    });
    next(null, file);
  });
}

function rename(app, name) {
  return through.obj(function(file, enc, next) {
    file.basename = name;
    next(null, file);
  });
}

function render(app, argv) {
  var template = formatName(argv.tmpl || 'default');
  return through.obj(function(file, enc, next) {
    if (file.basename !== template) {
      next();
      return;
    }
    var str = file.contents.toString();
    var rendered = createRequires(app, str);
    if (rendered === str) {
      next();
      return;
    }
    if (argv.semi) {
      rendered = rendered.split(';').join('');
    }
    savePkg(app, argv);
    file.contents = new Buffer(rendered);
    next(null, file);
  });
}

/**
 * Ensure we don't have a double `.js.js`
 */

function formatName(str) {
  return str.split('.js').join('') + '.js';
}

function savePkg(app, argv) {
  if (argv.save === 'false') return;
  var files = app.pkg.get('files') || [];
  if (files.indexOf('utils.js') === -1) {
    files.push('utils.js');
    app.pkg.set('files', files);
    app.pkg.save();
  }
}

function createRequires(app, template) {
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

  return inject(template, res.join('\n'), {
    stripTags: true
  });
}
