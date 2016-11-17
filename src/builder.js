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
class Builder {
  /**
   * Creates a builder instance.
   *
   * @param {Number} id - unique identificator.
   * @param {Selector} selector - CSS selector for searching elements.
   * @param {ComponentPrototype} proto - components' prototype.
   * @param {Array.<module:plugin~Plugin>} plugins - list of plugins.
   * @param {QuerySelector} querySelector - function for search elements in a tree.
   */
  constructor(id, selector, proto, plugins, querySelector) {
    this.id = id;
    this.selector = selector;
    this.proto = proto;
    this.plugins = plugins;
    this.querySelector = querySelector;
  }

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
  getInitializer(tree = document.body) {
    const nodes = this.querySelector(tree, this.selector);

    const components = nodes.reduce((cs, node) => {
      if (this.checkAndUpdateCache(node)) {
        cs.push(this.createComponent(node));
      }

      return cs;
    }, []);

    return function initializer() {
      components.forEach((component) => {
        if (!component.init) {
          return;
        }

        component.init();
      });
    };
  }

  /**
   * Creates {@link Component}'s instance and applies plugins to them.
   *
   * @param {external:Element} node - specified element.
   *
   * @return {Component} created {@link Component}'s instance.
   *
   * @private
   * @since 0.2.0
   */
  createComponent(node) {
    const component = Object.keys(this.proto).reduce((instance, property) => {
      instance[property] = this.proto[property];

      return instance;
    }, { });

    this.transformComponent(component, node);

    return component;
  }

  /**
   * Checks have been created a component for specified element. Update meta
   * information about linked components if not.
   *
   * @param {external:Element} node - specified element.
   *
   * @return {Boolean} `true` if component isn't has been created; otherwise
   * returns `false`.
   *
   * @private
   * @since 0.2.0
   */
  checkAndUpdateCache(node) {
    if (node.ids && node.ids.indexOf(this.id) !== -1) {
      return false;
    }

    node.ids = node.ids ? node.ids.concat(this.id) : [this.id];

    return true;
  }

  /**
   * Applies plugins to specified component and element one by one.
   *
   * @param {Component} component - component which will be transformed.
   * @param {external:Element} node - element which associated
   * with the component.
   *
   * @return {void} nothing.
   *
   * @private
   * @since 0.2.0
   */
  transformComponent(component, node) {
    this.plugins.forEach((plugin) => {
      plugin.transform(component, node);
    });
  }
}


export default Builder;
