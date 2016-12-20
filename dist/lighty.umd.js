/*!
 * lighty v0.8.0
 * https://github.com/demiazz/lighty
 *
 * Copyright Alexey Plutalov
 * Released under the MIT license
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('lighty', factory) :
  (global.lighty = factory());
}(this, (function () { 'use strict';

function getMatchesFn() {
  var e = document.documentElement;

  return (
    e.matches ||
    e.matchesSelector ||
    e.msMatchesSelector ||
    e.mozMatchesSelector ||
    e.webkitMatchesSelector ||
    e.oMatchesSelector
  );
}

var matchesFn = getMatchesFn();

function matches(element, selector) {
  return matchesFn.call(element, selector);
}

function filterElements(elements) {
  return elements.filter(function (e) { return e instanceof Element; });
}

function toArray(nodeList) {
  return [].slice.call(nodeList);
}

function walk(trees, selector, callback) {
  var roots;

  if (trees instanceof Element) {
    roots = [trees];
  } else if (trees instanceof NodeList) {
    roots = filterElements(toArray(trees));
  } else if (Array.isArray(trees)) {
    roots = filterElements(trees);
  } else if (typeof trees === 'string') {
    roots = toArray(document.querySelectorAll(trees));
  } else {
    throw new TypeError('Unsupported type of tree root');
  }

  roots.forEach(function (root) {
    if (matches(root, selector)) {
      callback(root);
    }

    [].slice.call(root.querySelectorAll(selector)).forEach(callback);
  });
}

var Engine = function Engine(builder, onStart) {
  var this$1 = this;

  if (!(builder instanceof Function)) {
    throw new TypeError('Builder must be a function');
  }

  this.cacheKey = "__lighty__" + (Engine.getUniqueId());
  this.builder = builder;
  this.onStart = onStart;

  this.isRunning = false;
  this.components = [];

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { return this$1.start(); });
  } else {
    // See https://connect.microsoft.com/IE/feedback/details/792880/document-readystat
    setTimeout(function () { return this$1.start(); }, 1);
  }
};

Engine.prototype.component = function component (selector) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  var id = this.components.length;

  this.components.push([id, selector, args]);

  if (this.isRunning) {
    this.build(document.body, id, selector, args);
  }
};

Engine.prototype.vitalize = function vitalize (trees) {
    var this$1 = this;
    if ( trees === void 0 ) trees = document.body;

  if (!this.isRunning) {
    throw Error('Document is not ready yet.');
  }

  this.components.forEach(function (component) {
    (ref = this$1).build.apply(ref, [ trees ].concat( component ));
      var ref;
  });
};

Engine.prototype.start = function start () {
  this.isRunning = true;

  this.vitalize();

  if (this.onStart) {
    this.onStart();
  }
};

Engine.prototype.build = function build (trees, id, selector, args) {
    var this$1 = this;

  walk(trees, selector, function (element) {
    if (this$1.isCached(element, id)) {
      return;
    }

    (ref = this$1).builder.apply(ref, [ element ].concat( args ));
    this$1.cache(element, id);
      var ref;
  });
};

Engine.prototype.isCached = function isCached (element, id) {
  var cache = element[this.cacheKey];

  return cache && cache.indexOf(id) !== -1;
};

Engine.prototype.cache = function cache (element, id) {
  var cache = element[this.cacheKey];

  element[this.cacheKey] = cache ? cache.concat(id) : [id];
};


Engine.getUniqueId = function getUniqueId() {
  if (this.incrementalId == null) {
    this.incrementalId = 0;
  }

  var result = this.incrementalId;

  this.incrementalId += 1;

  return result;
};

function createEngine(builder, onStart) {
  return new Engine(builder, onStart);
}

return createEngine;

})));
