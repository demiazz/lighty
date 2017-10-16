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

<hr />

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Installation](#installation)
  - [npm](#npm)
  - [Browser](#browser)
- [Usage](#usage)
- [Philosophy](#philosophy)
- [Concepts](#concepts)
  - [Engine](#engine)
  - [Application launch](#application-launch)
  - [Component registration](#component-registration)
  - [Component vitalize](#component-vitalize)
  - [Builder](#builder)
- [API](#api)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installation

## npm

You can install `lighty` from `npm`.

```sh
$ npm install --save lighty
```

And use it as CommonJS module:

```js
const createApplication = require('lighty');
```

Or as ES module:

```js
import createApplicaion from 'lighty';
```

Package provides CommonJS and ES6 module styles through `main` and `module` fields in `package.json`. It useful if
your build system supports this (for example Webpack 3 and Rollup successfully support both fields).

## Browser

Additionally, we provide full and minified UMD versions. Bundles included to
`npm` package, or you can download them from
[unpkg.io](https://unpkg.com/lighty@latest/dist/). After just include them
to your HTML:

```html
<script src="lighty.min.js"></script>
```

# Usage

Let's write simple application:

```html
<div class="awesome-component">
  Not awesome yet.
</div>
```

Import `lighty` first:

```js
import createApplication from 'lighty';
```

Then create simple component factory:

```js
function factory(element, component) {
  constructor(element);
}
```

And create application instance:

```js
const application = createApplication(factory);
```

Ok. Let's create our first component:

```js
application.component('.awesome-component', element => {
  element.innerText = "It's awesome now.";
});
```

And check result:

```js
console.log(document.querySelector('.awesome-component').innerText);
```

We should see next output:

```
It's awesome now.
```

Yeah! Now you can use component oriented structure in your project.

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

See also [Engine](#engine).

## Application launch

An application launched when DOM will be ready. Engine checks `document.readyState`
property and uses `DOMContentLoaded` event for this purpose.

Engine vitalize all registered components on launch. And will vitalize all newly
registered components immediately.

## Component registration

Component registration is a linking of a valid CSS selector with arguments list.
Selector will be used for select elements in DOM. Arguments list will be applied
to a builder.

See also [Engine.component](#component).

## Component vitalize

Vitalize is a process from two steps:

- search all elements which matched by the selector;
- call builder for each element with linked arguments.

Only one component's instance will be created for each element at application's
lifecycle.

See also [Engine.vitalize](#vitalize).

## Builder

User function which creates component's instance and binds then with DOM
element.

See also [BuilderFn](#builderfn).

# API

<!-- API: BEGIN --><!-- Generated by documentation.js. Update this documentation by updating the source code. -->
<!-- API: END -->

# License

Released under the [MIT license](https://github.com/demiazz/lighty/blob/master/LICENSE).
