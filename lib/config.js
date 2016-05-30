'use strict';

var path = require('path');
var templates = path.resolve.bind(path, __dirname, 'templates');
var utils = require('./utils');

module.exports = function(app, base) {
  var lazyFile = path.resolve(app.cwd, 'utils.js');
  var dest = app.options.dest || app.cwd;

  /**
   * Create lazy file
   */

  app.task('lazy', function(cb) {
    if (utils.exists(lazyFile)) {
      app.build('learn', cb);
      return;
    }

    if (utils.exists(path.resolve(app.cwd, 'lib/utils.js'))) {
      lazyFile = path.resolve(app.cwd, 'lib/utils.js');
      app.build('learn', cb);
      return;
    }

    return app.src(templates('default.js'))
      .pipe(render(app, app.options))
      .pipe(app.conflicts(dest))
      .pipe(app.dest(function(file) {
        file.name = 'utils.js';
        return dest;
      }));
  });

  /**
   * Save lazy file to package.json `files` array
   */

  app.task('save', function(cb) {
    if (app.options.save === 'false') return;
    var files = app.pkg.get('files') || [];
    if (files.indexOf('utils.js') === -1) {
      files.push('utils.js');
      files.sort();
      app.pkg.set('files', files);
      app.pkg.save();
    }
    cb();
  });

  /**
   * Learn aliases used in lazy file
   */

  app.task('learn', function(cb) {
    console.log('Learning variables in', path.relative(app.cwd, lazyFile));
    return app.src(lazyFile, {cwd: app.cwd})
      .pipe(learn(app, app.options));
  });

  /**
   * Default task
   */

  app.task('default', ['lazy', 'save']);
};

/**
 * Learn aliases in `utils.js`
 */

function learn(app, argv) {
  return utils.through.obj(function(file, enc, next) {
    var str = file.contents.toString();
    utils.parse(str).forEach(function(token) {
      if (token.alias) {
        app.store.set(token.name, token.alias);
      }
    });
    next(null, file);
  });
}

function render(app, argv) {
  return utils.through.obj(function(file, enc, next) {
    var str = file.contents.toString();
    var rendered = utils.createRequires(app, str);
    if (rendered === str) {
      next();
      return;
    }
    if (argv.s) {
      rendered = rendered.split(';').join('');
    }
    file.contents = new Buffer(rendered);
    next(null, file);
  });
}
