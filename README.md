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
## Classes

<dl>
<dt><a href="#Engine">Engine</a></dt>
<dd><p>Application&#39;s engine. Controls application&#39;s lifecycle, register
and vitalize components.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#create">create(builder, [onStart])</a> ⇒ <code><a href="#Engine">Engine</a></code></dt>
<dd><p>Creates engine&#39;s instance with given <code>builder</code>.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#CSSSelector">CSSSelector</a> : <code>String</code></dt>
<dd><p>A valid CSS selector.</p>
</dd>
<dt><a href="#Trees">Trees</a> : <code>Element</code> | <code>NodeList</code> | <code>Array.&lt;Element&gt;</code> | <code><a href="#CSSSelector">CSSSelector</a></code></dt>
<dd><p>One or many DOM elements for search.</p>
</dd>
<dt><a href="#Builder">Builder</a> ⇒ <code>undefined</code></dt>
<dd><p>Creates component&#39;s instance with linked arguments for given <code>element</code>.</p>
</dd>
<dt><a href="#OnStart">OnStart</a> ⇒ <code>undefined</code></dt>
<dd><p>Callback which will be called on engine start.</p>
</dd>
</dl>

<a name="Engine"></a>

## Engine
Application's engine. Controls application's lifecycle, register
and vitalize components.

**Kind**: global class  

* [Engine](#Engine)
    * [.component(selector, ...args)](#Engine.component) ⇒ <code>undefined</code>
    * [.vitalize([trees])](#Engine.vitalize) ⇒ <code>undefined</code>

<a name="Engine.component"></a>

### Engine.component(selector, ...args) ⇒ <code>undefined</code>
Register component with given `selector` and builder's `args` list.

Vitalize component if an application is already running.

**Kind**: static method of <code>[Engine](#Engine)</code>  
**Returns**: <code>undefined</code> - nothing.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>[CSSSelector](#CSSSelector)</code> | linked selector. |
| ...args | <code>\*</code> | linked builder's arguments list. |

<a name="Engine.vitalize"></a>

### Engine.vitalize([trees]) ⇒ <code>undefined</code>
Vitalize all registered components inside given `trees`.

Recommended use this method inside components. Components always created
after application launch, so `vitalize` don't be called before start.

If you update HTML inside some element, then use them as tree root for
performance purposes.

**Kind**: static method of <code>[Engine](#Engine)</code>  
**Returns**: <code>undefined</code> - nothing.  
**Throws**:

- <code>Error</code> when an application is not launched yet.
- <code>TypeError</code> when trees have not acceptable type.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [trees] | <code>[Trees](#Trees)</code> | <code>document.body</code> | roots of search trees. |

**Example**  
```js
element.innerHTML = `...`;

engine.vitalize(element);
```
<a name="create"></a>

## create(builder, [onStart]) ⇒ <code>[Engine](#Engine)</code>
Creates engine's instance with given `builder`.

**Kind**: global function  
**Returns**: <code>[Engine](#Engine)</code> - engine's instance.  
**Throws**:

- <code>TypeError</code> when `builder` is not a function.


| Param | Type | Description |
| --- | --- | --- |
| builder | <code>[Builder](#Builder)</code> | user defined builder of components. |
| [onStart] | <code>[OnStart](#OnStart)</code> | callback which will be called on application launch. |

<a name="CSSSelector"></a>

## CSSSelector : <code>String</code>
A valid CSS selector.

**Kind**: global typedef  
<a name="Trees"></a>

## Trees : <code>Element</code> &#124; <code>NodeList</code> &#124; <code>Array.&lt;Element&gt;</code> &#124; <code>[CSSSelector](#CSSSelector)</code>
One or many DOM elements for search.

**Kind**: global typedef  
<a name="Builder"></a>

## Builder ⇒ <code>undefined</code>
Creates component's instance with linked arguments for given `element`.

**Kind**: global typedef  
**Returns**: <code>undefined</code> - nothing.  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | an element for which a component's instance will be created. |
| ...args | <code>any</code> | linked arguments list for builder. |

<a name="OnStart"></a>

## OnStart ⇒ <code>undefined</code>
Callback which will be called on engine start.

**Kind**: global typedef  
**Returns**: <code>undefined</code> - nothing.  

<!-- API: END -->

# License

Released under the [MIT license](https://github.com/demiazz/lighty/blob/master/LICENSE).
