# lazy-cache-cli [![NPM version](https://img.shields.io/npm/v/lazy-cache-cli.svg?style=flat)](https://www.npmjs.com/package/lazy-cache-cli) [![NPM downloads](https://img.shields.io/npm/dm/lazy-cache-cli.svg?style=flat)](https://npmjs.org/package/lazy-cache-cli) 

CLI for adding a `utils.js` file with lazy-cached requires.

## Install

Install globally with [npm](https://www.npmjs.com/)

```sh
$ npm install -g lazy-cache-cli
```

## CLI

```sh
$ lazy
# no semicolons
$ lazy -s
```

Running the `lazy` command will do two things:

1. Add `utils.js` with `var utils = require('lazy-cache')(require);` and a list of dependencies from package.json
2. Add the `utils.js` filepath to the `files` property in package.json

**Learn**

If a `utils.js` or `lib/utils.js` file already exists, lazy-cache-cli will try to learn any aliases used in that file, so that the next time you generate a `utils.js` file, it will try to use the aliases if any "known" module names are used.

## Related projects

You might also be interested in these projects:

* [lazy-cache](https://www.npmjs.com/package/lazy-cache): Cache requires to be lazy-loaded when needed. | [homepage](https://github.com/jonschlinkert/lazy-cache)
* [lint-deps](https://www.npmjs.com/package/lint-deps): CLI tool that tells you when dependencies are missing from package.json and offers you a… [more](https://www.npmjs.com/package/lint-deps) | [homepage](https://github.com/jonschlinkert/lint-deps)

## Contributing

This document was generated by [verb](https://github.com/verbose/verb), please don't edit directly. Any changes to the readme must be made in [.verb.md](.verb.md). See [Building Docs](#building-docs).

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/lazy-cache-cli/issues/new).

## Building docs

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-readme-generator && verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/jonschlinkert/lazy-cache-cli/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on May 30, 2016._