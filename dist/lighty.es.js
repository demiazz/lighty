/**
 * Provides Builder class.
 *
 * @module builder
 *
 * @protected
 * @since 0.2.0
 */


/**
 * Creates {@link ComponentPrototype}'s instances for elements in specified tree.
 *
 * @property {Number} id - unique identificator.
 * @property {Selector} selector - CSS selector for searching elements.
 * @property {ComponentPrototype} proto - components' prototype.
 * @property {Array.<module:plugin~Plugin>} plugins - list of plugins.
 * @property {QuerySelector} querySelector - function for search elements in a tree.
 *
 * @protected
 * @since 0.2.0
 */
var Builder = function Builder(id, selector, proto, plugins, querySelector) {
  this.id = id;
  this.selector = selector;
  this.proto = proto;
  this.plugins = plugins;
  this.querySelector = querySelector;
};

/**
 * Search elements in specified tree. Creates {@link Component}'s instance
 * for each element (if not has been set up early). And generate
 * initialization function, which calls {@link ComponentInitFn} for each
 * created component, if a component has a {@link ComponentInitFn}.
 *
 * @param {Tree} [tree = document.body] - specified tree.
 *
 * @return {InitializerFn} initialization function.
 *
 * @protected
 * @since 0.2.0
 */
Builder.prototype.getInitializer = function getInitializer (tree) {
    var this$1 = this;
    if ( tree === void 0 ) tree = document.body;

  var elements = this.querySelector(tree, this.selector);

  var components = elements.reduce(function (cs, element) {
    if (this$1.checkAndUpdateCache(element)) {
      cs.push(this$1.createComponent(element));
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

/**
 * Creates {@link Component}'s instance and applies plugins to them.
 *
 * @param {external:Element} element - specified element.
 *
 * @return {Component} created {@link Component}'s instance.
 *
 * @private
 * @since 0.2.0
 */
Builder.prototype.createComponent = function createComponent (element) {
    var this$1 = this;

  var component = Object.keys(this.proto).reduce(function (instance, property) {
    instance[property] = this$1.proto[property];

    return instance;
  }, { });

  this.transformComponent(component, element);

  return component;
};

/**
 * Checks have been created a component for specified element. Update meta
 * information about linked components if not.
 *
 * @param {external:Element} element - specified element.
 *
 * @return {Boolean} `true` if component isn't has been created; otherwise
 * returns `false`.
 *
 * @private
 * @since 0.2.0
 */
Builder.prototype.checkAndUpdateCache = function checkAndUpdateCache (element) {
  if (element.ids && element.ids.indexOf(this.id) !== -1) {
    return false;
  }

  element.ids = element.ids ? element.ids.concat(this.id) : [this.id];

  return true;
};

/**
 * Applies plugins to specified component and element one by one.
 *
 * @param {Component} component - component which will be transformed.
 * @param {external:Element} element - element which associated
 * with the component.
 *
 * @return {void} nothing.
 *
 * @private
 * @since 0.2.0
 */
Builder.prototype.transformComponent = function transformComponent (component, element) {
  this.plugins.forEach(function (plugin) {
    plugin.transform(component, element);
  });
};

/**
 * Provides utilities to work with the search for `DOM` tree.
 *
 * @module query-selector
 *
 * @protected
 * @since 0.4.0
 */


/**
 * Extracts {@link external:MatchesFn} method from `DOM API`.
 *
 * Uses workaround for vendor prefixed methods in old browsers.
 *
 * @example
 *
 * <div class="element"><div>
 *
 * @example
 *
 * const element = document.querySelector('.element');
 * const matchesFn = getMatchesFn();
 *
 * matchesFn.call(element, '.element'); // => true
 * matchesFn.call(element, '.not-element'); // => false
 *
 * @return {external:MatchesFn} extracted {@link external:MatchesFn} method.
 *
 * @private
 * @since 0.4.0
 */
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

/**
 * {@link external:MatchesFn} extracted from `DOM API`.
 *
 * @example
 *
 * <div class="element"><div>
 *
 * @example
 *
 * const element = document.querySelector('.element');
 *
 * matchesFn.call(element, '.element'); // => true
 * matchesFn.call(element, '.not-element'); // => false
 *
 * @type external:MatchesFn
 *
 * @private
 * @since 0.4.0
 */
var matchesFn = getMatchesFn();

/**
 * Wrapper around {@link matchesFn}.
 *
 * @example
 *
 * <div class="element"><div>
 *
 * @example
 *
 * const element = document.querySelector('.element');
 *
 * matches(element, '.element'); // => true
 * matches(element, '.not-element'); // => false
 *
 * @param {external:Element} element - element to test.
 * @param {Selector} selector - CSS selector to test.
 *
 * @return {Boolean} `true` if the specified selector would select the element;
 * otherwise, returns `false`.
 *
 * @private
 * @since 0.4.0
 */
function matches(element, selector) {
  return matchesFn.call(element, selector);
}

/**
 * Creates new array with all items that is a {@link external:Element}'s
 * instances.
 *
 * @param {Array.<*>} nodes - items.
 *
 * @return {Array.<external:Element>} filtered array.
 *
 * @private
 * @since 0.5.0
 */
function filterElements(elements) {
  return elements.filter(function (element) { return element instanceof Element; });
}

/**
 * Selects all elements by selector inside given tree (includes tree self too).
 *
 * @example
 *
 * <div class="tree">
 *   <div class="leaf">
 *   <div class="leaf">
 * </div>
 *
 * @example
 *
 * querySelector('.tree', '.leaf'); // => [<.leaf>, <.leaf>]
 *
 * @example
 *
 * querySelector('.tree', '.tree, .leaf'); // => [<.tree>, <.leaf>, <.leaf>]
 *
 * @example
 *
 * const tree = document.querySelector('.tree');
 *
 * querySelector(tree, '.leaf') // => [<.leaf>, <.leaf>]
 *
 * @example
 *
 * const tree = document.querySelectorAll('.tree');
 *
 * querySelector(tree, '.leaf') // => [<.leaf>, <.leaf>]
 *
 * @example
 *
 * const tree = [document.querySelector('.tree')];
 *
 * querySelector(tree, '.leaf') // => [<.leaf>, <.leaf>]
 *
 * @example
 *
 * const tree = $('.tree');
 *
 * querySelector(tree, '.leaf') // => [<.leaf>, <.leaf>]
 *
 * @param {Tree} tree - tree inside of which will be searched for elements.
 * @param {Selector} selector - valid CSS selector.
 *
 * @return {external:Element[]} elements selected by specified selector.
 *
 * @protected
 * @since 0.4.0
 */
function querySelector(tree, selector) {
  if (tree.jquery) {
    return tree.filter(selector).add(tree.find(selector)).toArray();
  }

  var roots = [];

  if (tree instanceof Element) {
    roots = [tree];
  } else if (tree instanceof NodeList) {
    roots = filterElements([].slice.call(tree));
  } else if (Array.isArray(tree)) {
    roots = filterElements(tree);
  } else if (typeof tree === 'string') {
    roots = [].slice.call(document.querySelectorAll(tree));
  }

  return roots.reduce(function (elements, root) {
    if (matches(root, selector)) {
      elements.push(root);
    }

    return elements.concat(
      [].slice.call(root.querySelectorAll(selector))
    );
  }, []);
}

/**
 * Provides Application class.
 *
 * @module application
 *
 * @protected
 * @since 0.2.0
 */

/**
 * Creates an application and start them immediately or when a document
 * will be loaded.
 *
 * @property {Array.<module:builder~Builder>} builders - list of builders.
 * @property {Boolean} isRunning - flag which indicates application running or not.
 * @property {QuerySelector} querySelector - query selector used by application.
 * @property {Array.<module:plugin~Plugin>} plugins - list of plugins.
 *
 * @public
 * @since 0.2.0
 */
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

/**
 * Creates {@link module:builder~Builder} instance for specified selector
 * and prototype, and register them inside of application.
 *
 * Creates the {@link ComponentPrototype}'s instances for all suitable
 * components on a page if application already running.
 *
 * @param {Selector} selector - specified CSS selector.
 * @param {ComponentPrototype} proto - specified prototype.
 *
 * @return {Void} nothing.
 *
 * @public
 * @since 0.2.0
 */
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
};

/**
 * Creates components through all registered {@link module:builder~Builder}s
 * for all elements inside specified tree.
 *
 * @param {Tree} tree - specified tree.
 *
 * @return {Void} nothing.
 *
 * @public
 * @since 0.2.0
 */
Application.prototype.vitalize = function vitalize (tree) {
  this.builders.forEach(function (builder) {
    var initialize = builder.getInitializer(tree);

    initialize();
  });
};

/**
 * Sets `isRunning` flag to true and vitalizes all elements on a page.
 *
 * @return {Void} nothing.
 *
 * @private
 * @since 0.2.0
 */
Application.prototype.start = function start () {
  this.isRunning = true;

  this.vitalize();
};

/**
 * Provides Plugin class.
 *
 * @module plugin
 *
 * @protected
 * @since 0.2.0
 */


/**
 * Plugin keeps self name and transformation function.
 *
 * It's is a simple structure now, but in future may be extended for
 * providing additional functionality.
 *
 * @property {String} name - plugin's name.
 * @property {TransformerFn} transformer - transformation function.
 *
 * @protected
 * @since 0.2.0
 */
var Plugin = function Plugin(name, transformer) {
  this.name = name;
  this.transformer = transformer;
};

/**
 * Applies transformation function to component instance and
 * HTML element.
 *
 * @param {Component} component - component which will be transformed.
 * @param {external:Element} element - element which associated
 * with the component.
 *
 * @return {void} nothing.
 *
 * @since 0.2.0
 */
Plugin.prototype.transform = function transform (component, element) {
  this.transformer(component, element);
};

/**
 * Provides public API.
 *
 * @module index
 *
 * @public
 */

/**
 * Creates application instance.
 *
 * @example
 *
 * const application = createApplication();
 *
 * application.component('.example', {
 *   // ...
 * });
 *
 * @param {?ApplicationOptions} options - application options.
 *
 * @return {module:application~Application} created application instance.
 *
 * @public
 * @since 0.5.0
 */
function createApplication(options) {
  return new Application(options);
}

/**
 * Creates {@link module:plugin~Plugin} factory with given name and initializer.
 *
 * Initializer used for transportation arguments to transformation function if
 * needed.
 *
 * @example
 *
 * const plugin = createPlugin('awesome-plugin', function initializer() {
 *   return function transform(component, element) {
 *     // transform component here
 *   }
 * });
 *
 * const application = create({ plugins: [plugin] });
 *
 * @example
 *
 * const factory = createPlugin('awesome-plugin', function initializer(...args) {
 *   return function transform(component, element) {
 *     // `args` available here
 *   };
 * });
 *
 * const plugin = factory(
 *   // your awesome arguments here
 * );
 *
 * const application = createApplication({ plugins: [plugin] });
 *
 * @param {String} name - plugin's name.
 * @param {PluginInitializationFn} initializer - add description.
 *
 * @return {PluginFactoryFn} plugin's factory.
 *
 * @public
 * @since 0.5.0
 */
function createPlugin(name, initializer) {
  return function factory() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return new Plugin(name, initializer.apply(void 0, args));
  };
}

export { querySelector, createApplication, createPlugin };
//# sourceMappingURL=lighty.es.js.map
