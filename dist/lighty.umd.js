/*!
 * lighty v0.4.2
 * https://github.com/demiazz/lighty
 *
 * Copyright Alexey Plutalov
 * Released under the MIT license
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.lighty = global.lighty || {})));
}(this, (function (exports) { 'use strict';

var Builder = function Builder(id, selector, proto, plugins, querySelector) {
  this.id = id;
  this.selector = selector;
  this.proto = proto;
  this.plugins = plugins;
  this.querySelector = querySelector;
};

Builder.prototype.getInitializer = function getInitializer (tree) {
    var this$1 = this;
    if ( tree === void 0 ) tree = document.body;

  var nodes = this.querySelector(tree, this.selector);

  var components = nodes.reduce(function (cs, node) {
    if (this$1.checkAndUpdateCache(node)) {
      cs.push(this$1.createComponent(node));
    }

    return cs;
  }, []);

  return function initializer() {
    components.forEach(function (component) {
      if (!component.init) {
        return;
      }

      component.init();
    });
  };
};

Builder.prototype.createComponent = function createComponent (node) {
    var this$1 = this;

  var component = Object.keys(this.proto).reduce(function (instance, property) {
    instance[property] = this$1.proto[property];

    return instance;
  }, { });

  this.transformComponent(component, node);

  return component;
};

Builder.prototype.checkAndUpdateCache = function checkAndUpdateCache (node) {
  if (node.ids && node.ids.indexOf(this.id) !== -1) {
    return false;
  }

  node.ids = node.ids ? node.ids.concat(this.id) : [this.id];

  return true;
};

Builder.prototype.transformComponent = function transformComponent (component, node) {
  this.plugins.forEach(function (plugin) {
    plugin.transform(component, node);
  });
};

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

function querySelector(tree, selector) {
  if (tree.jquery) {
    return tree.filter(selector).add(tree.find(selector)).toArray();
  }

  var roots;

  if (tree instanceof HTMLElement) {
    roots = [tree];
  } else if (tree instanceof NodeList) {
    roots = [].slice.call(tree);
  } else if (Array.isArray(tree)) {
    roots = tree;
  } else if (typeof tree === 'string') {
    roots = [].slice.call(document.querySelectorAll(tree));
  }

  return roots.reduce(function (nodes, root) {
    if (matches(root, selector)) {
      nodes.push(root);
    }

    return nodes.concat(
      [].slice.call(root.querySelectorAll(selector))
    );
  }, []);
}

var Application = function Application(options) {
  if ( options === void 0 ) options = { };

  this.builders = [];
  this.isRunning = false;

  // Query selector

  this.querySelector = options.querySelector || querySelector;

  // Plugins

  this.plugins = [];

  if (options.plugins) {
    this.plugins = options.plugins.map(function (plugin) {
      if (plugin instanceof Function) {
        return plugin();
      }

      return plugin;
    });
  }

  // Running

  if (document.readyState !== 'loading') {
    // See https://connect.microsoft.com/IE/feedback/details/792880/document-readystat
    setTimeout(this.start.bind(this), 1);
  } else {
    document.addEventListener('DOMContentLoaded', this.start.bind(this));
  }
};

Application.prototype.component = function component (selector, proto) {
  var id = this.builders.length;
  var builder = new Builder(
    id, selector, proto, this.plugins, this.querySelector
  );

  this.builders.push(builder);

  if (this.isRunning) {
    var initializer = builder.getInitializer();

    initializer();
  }

  return this;
};

Application.prototype.vitalize = function vitalize (tree) {
  this.builders.forEach(function (builder) {
    var initialize = builder.getInitializer(tree);

    initialize();
  });
};

Application.prototype.start = function start () {
  this.isRunning = true;

  this.vitalize();
};

var Plugin = function Plugin(name, transformer) {
  this.name = name;
  this.transformer = transformer;
};

Plugin.prototype.transform = function transform (component, node) {
  this.transformer(component, node);
};

function create(options) {
  return new Application(options);
}

function plugin(name, initializer) {
  return function factory() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return new Plugin(name, initializer.apply(void 0, args));
  };
}

exports.querySelector = querySelector;
exports.create = create;
exports.plugin = plugin;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=lighty.umd.js.map
