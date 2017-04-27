## 0.9.0 (27 April 2017)

* Migrate from Buble to Babel
* Use Flow for type annotations inside source code
* Rewrite build, and change packed package scheme
* Upgrade code quality tools configuration

## 0.8.0 (20 December 2016)

* Add TypeScript annotations
* Add FlowType annotations
* Remove source maps for ES, CommonJS, and not minified UMD
* Use named exports (`module.exports = ` now instead of
  `module.exports['default'] = `)
* Recommend use `createEngine` name instead of `create`

## 0.7.0 (19 December 2016)

* Not existing version. It has been created by mistake early then 0.6.0 by
  mistake, and unpublished. NPM policy doesn't let publish this version anymore.

## 0.6.0 (19 December 2016)

* Fully incompatible version
* Change library concept from framework to framework engine

## 0.5.0 (17 November 2016)

* Rewrite build script. Use named modules in UMD build
* Add API documentation based on JSDoc
* Use `element` instead `node` for naming inside library
* `Application.component` not return `this` anymore
* `querySelector` uses `Element` instead `HTMLElement` as base class for checks
* `querySelector` returns empty array when type of `tree` is incorrect
* `querySelector` filter `tree` for `Element` instances if `tree` is `NodeList`
  or `Array`
* Rename `create` to `createApplication`
* Rename `plugin` to `createPlugin`

## 0.4.2 (11 November 2016)

* Add workaround for `document.readyState` bug in IE

## 0.4.1 (10 November 2016)

* Export `querySelector`

## 0.4.0 (10 November 2016)

* Remove default application
* Remove application names
* Remove application instances cache
* Remove `Application.use`
* Remove `Application.run`
* Add options for application creating
* Add custom querySelector option
* Application automatically started after creating

## 0.3.0 (14 October 2016)

* Throw error when `use` method called after `run`
* Add Microsoft Edge 14 to CI
* Fix specs

## 0.2.3 (14 October 2016)

* Remove `for` loops, use `forEach`/`map` instead
* Remove `np` from development dependencies
* Remove `sinon` from development dependencies
* Refactor specs

## 0.2.2 (1 October 2016)

* Add test coverage for library source code

## 0.2.1 (1 October 2016)

* Add compiled files to release process

## 0.2.0 (1 October 2016)

* Add creating few named application instances
* Add prebuilded files to Git
* Refactor npm scripts

## 0.1.0 (25 August 2016)

* Initial release
