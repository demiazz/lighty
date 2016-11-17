## 0.5.0 (17 November 2016)

* Rewrite build script. Use named modules in UMD build
* Add API documentation based on JSDoc
* Use `element` instead `node` for naming inside library
* `Application.component` not return `this` anymore
* `querySelector` uses `Element` instead `HTMLElement` as base class for checks
* `querySelector` returns empty array when type of `tree` is incorrect
* `querySelector` filter `tree` for `Element` instances if `tree` is `NodeList`
  or `Array`
* rename `create` to `createApplication`
* rename `plugin` to `createPlugin`

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
