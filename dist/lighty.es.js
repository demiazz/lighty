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

function findInTree(tree, selector) {
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

var Builder = function Builder(id, selector, proto, plugins) {
  this.id = id;
  this.selector = selector;
  this.proto = proto;
  this.plugins = plugins;
};

Builder.prototype.getInitializer = function getInitializer (tree) {
    var this$1 = this;
    if ( tree === void 0 ) tree = document.body;

  var nodes = findInTree(tree, this.selector);

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

var Application = function Application(name) {
  this.name = name;
  this.plugins = [];
  this.builders = [];
  this.isReady = false;
  this.isRunning = false;
};

Application.prototype.use = function use () {
    var plugins = [], len = arguments.length;
    while ( len-- ) plugins[ len ] = arguments[ len ];

  this.plugins = this.plugins.concat(
    this.normalize(plugins)
  );

  return this;
};

Application.prototype.component = function component (selector, proto) {
  var id = this.builders.length;
  var builder = new Builder(id, selector, proto, this.plugins);

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

Application.prototype.run = function run () {
    var this$1 = this;

  this.isReady = true;

  if (document.readyState !== 'loading') {
    this.start();
  } else {
    document.addEventListener('DOMContentLoaded', function () { return this$1.start(); });
  }

  return this;
};

Application.prototype.start = function start () {
  this.isRunning = true;

  this.vitalize();
};

Application.prototype.normalize = function normalize (plugins) {
    var this$1 = this;

  return plugins.reduce(function (ps, p) {
    var instances = Array.isArray(p)
      ? p.map(function (plugin) { return this$1.instantiatePlugin(plugin); })
      : this$1.instantiatePlugin(p);

    return ps.concat(instances);
  }, []);
};

// eslint-disable-next-line
Application.prototype.instantiatePlugin = function instantiatePlugin (plugin) {
  if (plugin instanceof Function) {
    return plugin();
  }

  return plugin;
};

var Plugin = function Plugin(name, transformer) {
  this.name = name;
  this.transformer = transformer;
};

Plugin.prototype.transform = function transform (component, node) {
  this.transformer(component, node);
};

var applications = {
  default: new Application('default'),
};


var index = applications.default;

function create(name) {
  if ( name === void 0 ) name = 'default';

  var instance = applications[name];

  if (!instance) {
    instance = new Application(name);

    applications[name] = instance;
  }

  return instance;
}

function plugin(name, initializer) {
  return function factory() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return new Plugin(name, initializer.apply(void 0, args));
  };
}

export { create, plugin };export default index;
//# sourceMappingURL=lighty.es.js.map
