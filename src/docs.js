/**
 * Optional function for component initialization.
 *
 * @callback ComponentInitFn
 *
 * @this Component
 *
 * @return {Void}
 *
 * @since 0.2.0
 */

/**
 * Function which will transform components.
 *
 * @callback TransformerFn
 *
 * @param {Component} component - component which will be transformed.
 * @param {external:Element} element - element which associated with the component.
 *
 * @return {Void}
 *
 * @since 0.2.0
 */

/**
 * Selects all elements by selector inside given tree (includes tree self too).
 *
 * @callback QuerySelector
 *
 * @param {Tree} tree - tree inside of which will be searched for elements.
 * @param {Selector} selector - valid CSS selector.
 *
 * @return {external:Element[]} elements selected by specified selector.
 *
 * @since 0.4.0
 */

/**
 * Creates transformation function.
 *
 * @callback PluginInitializationFn
 *
 * @param {...*} args - arguments for plugin initialization.
 *
 * @return {TransformerFn} created transformation function.
 *
 * @since 0.2.0
 */

/**
 * Creates {@link TransformerFn} with specified name and
 * {@link PluginInitializationFn} from closure.
 *
 * @callback PluginFactoryFn
 *
 * @param {...*} args - arguments for {@link PluginInitializationFn}.
 *
 * @return {module:plugin~Plugin} created {@link module:plugin~Plugin} instance.
 *
 * @since 0.2.0
 */


 /**
  * Component prototype which will be cloned for produce {@link Component}s.
  *
  * @typedef ComponentPrototype
  * @type {Object}
  *
  * @property {ComponentInitFn} ?init - initialization method.
  *
  * @since 0.2.0
  */

/**
 * Component instance.
 *
 * @typedef Component
 * @type {Object}
 *
 * @property {ComponentInitFn} ?init - initialization method.
 *
 * @since 0.2.0
 */

/**
 * Application options.
 *
 * @typedef ApplicationOptions
 * @type {Object}
 *
 * @property {?QuerySelector} querySelector - custom query selector.
 * @property {?Array.<PluginFactoryFn | module:plugin~Plugin>} plugins - list
 * of plugins.
 *
 * @since 0.4.0
 */

/**
 * @typedef {String} Selector
 *
 * @since 0.2.0
 */

/**
 * @typedef {(Selector|external:Element|Array.<external:Element>|external:jQuery)} Tree
 *
 * @since 0.4.0
 */


/**
 * The `Element.matches()` method returns true if the element would be
 * selected by the specified selector string; otherwise, returns false.
 *
 * @external MatchesFn
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/matches Mozilla Development Network}
 *
 * @since 0.4.0
 */

 /**
  * The {@link external:Element} interface represents an object of a Document.
  * This interface describes methods and properties common to all kinds of elements.
  * Specific behaviors are described in interfaces which inherit from
  * {@link external:Element} but add additional functionality. For example,
  * the `HTMLElement` interface is the base interface for `HTML`
  * elements, while the `SVGElement` interface is the basis
  * for all SVG elements.
  *
  * @external Element
  * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element Mozilla Development Network}
  *
  * @since 0.4.0
  */

/**
 * `jQuery` object.
 *
 * @external jQuery
 * @see {@link http://api.jquery.com/jQuery/ jQuery API Documentation}
 *
 * @since 0.4.0
 */
