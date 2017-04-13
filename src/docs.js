/* Types */

/**
 * A valid CSS selector.
 *
 * @typedef {String} CSSSelector
 */

/**
 * One or many DOM elements for search.
 *
 * @typedef {Element|NodeList|Array.<Element>|CSSSelector} Trees
 */

/* Callbacks */

/**
 * Creates component's instance with linked arguments for given `element`.
 *
 * @callback BuilderFn
 *
 * @param {Element} element - an element for which a component's instance will
 * be created.
 * @param {...any} args - linked arguments list for builder.
 *
 * @return {any}.
 */

/**
 * Callback which will be called on engine start.
 *
 * @callback OnStartFn
 *
 * @return {any}.
 */

/* Public API */

/**
 * Creates engine's instance with given `builder`.
 *
 * @function createEngine
 *
 * @param {BuilderFn} builder - user defined builder of components.
 * @param {OnStartFn} [onStart] - callback which will be called on application
 * launch.
 *
 * @throws {TypeError} when `builder` is not a function.
 *
 * @return {Engine} engine's instance.
 */

/**
 * @class Engine
 * @classdesc Application's engine. Controls application's lifecycle, register
 * and vitalize components.
 */

/**
 * Register component with given `selector` and builder's `args` list.
 *
 * Vitalize component if an application is already running.
 *
 * @method component
 *
 * @param {CSSSelector} selector - linked selector.
 * @param {...any} args - linked builder's arguments list.
 *
 * @return {undefined}.
 *
 * @memberof Engine
 */

/**
 * Vitalize all registered components inside given `trees`.
 *
 * Recommended use this method inside components. Components always created
 * after application launch, so `vitalize` don't be called before start.
 *
 * If you update HTML inside some element, then use them as tree root for
 * performance purposes.
 *
 * @example
 *
 * ```js
 * element.innerHTML = `...`;
 *
 * engine.vitalize(element);
 * ```
 *
 * @method vitalize
 *
 * @param {Trees} [trees = document.body] - roots of search trees.
 *
 * @throws {Error} when an application is not launched yet.
 * @throws {TypeError} when trees have not acceptable type.
 *
 * @return {undefined}.
 *
 * @memberof Engine
 */
