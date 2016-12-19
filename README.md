<h1 align="center">lighty</h1>

<div align="center">
  :spaghetti:&nbsp;&nbsp;<b>+</b>&nbsp;&nbsp;:zap:&nbsp;&nbsp;<b>=</b>&nbsp;&nbsp;:rocket:
</div>
<div align="center">
  <strong>Converts spaghetti to code.</strong>
  <br />
  The <code>2kb</code> engine for your handy microframework.
</div>

<br />

<div align="center">
  <!-- NPM version -->
  <a href="https://www.npmjs.com/package/lighty">
    <img src="https://img.shields.io/npm/v/lighty.svg?style=flat-square"
      alt="NPM version" />
  </a>
  <!-- Build Status -->
  <a href="https://travis-ci.org/demiazz/lighty">
    <img src="https://img.shields.io/travis/demiazz/lighty.svg?style=flat-square"
      alt="Build Status" />
  </a>
  <!-- Test Coverage -->
  <a href="https://coveralls.io/github/demiazz/lighty">
    <img src="https://img.shields.io/coveralls/demiazz/lighty.svg?style=flat-square"
      alt="Test Coverage" />
  </a>
  <!-- License -->
  <a href="https://github.com/demiazz/lighty/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/lighty.svg?style=flat-square"
      alt="License" />
  </a>
</div>

<div align="center">
  <sub>Built with ❤︎ by
  <a href="https://twitter.com/demiazz">demiazz</a>.
  Sponsored by <a href="http://evilmartians.com">Evil Martians</a>.
</div>

<br />

# Installation

## npm

You can install `lighty` from `npm`.

```sh
$ npm install --save lighty
```

And use it as CommonJS module:

```js
const lighty = require('lighty');
```

Or as ES module:

```js
import lighty from 'lighty';
```

## Browser

Additionally, we provide full and minified UMD versions. Bundles included to
`npm` package, or you can download them from
[unpkg.io](https://unpkg.com/lighty@latest/dist/). After just include them
to your HTML:

```html
<script src="lighty.umd.min.js"></script>
```

# Example

Let's write simple application:

```html
<div class="awesome-component">
  Not awesome yet.
</div>
```

```js
import create from 'lighty';

const engine = create((element, fn) => fn(element));

engine.component('.awesome-component', element => {
  element.innerText = "It's awesome now.";
});

console.log(document.querySelector('.awesome-component').innerText);
# => "It's awesome now."
```

# Philosophy

Modern frontend focused on developing RIA-applications. Most popular frameworks
and libraries created for this purpose.

There are still content websites at this time. This websites usually use simple
unstructured jQuery code which becomes difficult to maintain with the
growth of the project.

The primary objective of this project is a providing tool for structuring code
using the component model. Also, the objectives are:

- must have a small size, minimal API and no external dependencies;
- support for old browsers and modern trends (such as modules and types);
- users to decide how to implement the components.

# Concepts

## Engine

Core of any `lighty` application which launches an application, register and
vitalize components.

See also [Engine](#Engine).

## Application launch

An application launched when DOM will be ready. Engine checks `document.readyState`
property and uses `DOMContentLoaded` event for this purpose.

Engine vitalize all registered components on launch. And will vitalize all newly
registered components immediately.

## Component registration

Component registration is a linking of a valid CSS selector with arguments list.
Selector will be used for select elements in DOM. Arguments list will be applied
to a builder.

See also [component](#Engine.component).

## Component vitalize

Vitalize is a process from two steps:

- search all elements which matched by the selector;
- call builder for each element with linked arguments.

Only one component's instance will be created for each element at application's
lifecycle.

See also [vitalize](#Engine.vitalize).

## Builder

User function which creates component's instance and binds then with DOM
element.

See also [Builder](#Builder).

# API

<!-- API: BEGIN -->
<!-- API: END -->

# License

Released under the [MIT license](https://github.com/demiazz/lighty/blob/master/LICENSE).
