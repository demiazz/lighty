/**
 * Provides public API.
 *
 * @module index
 *
 * @public
 */

import Application from './application';
import Plugin from './plugin';
import querySelector from './query-selector';


/**
 * Default query selector which used by default.
 *
 * Use them as a base if you want to write custom query selector.
 *
 * @example
 *
 * function customQuerySelector(tree, selector) {
 *   const modifiedSelector = modifySelector(selector);
 *
 *   return querySelector(tree, modifiedSelector);
 * }
 *
 * @constant querySelector
 * @type QuerySelector
 *
 * @public
 * @since 0.4.1
 */
export { querySelector };

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
 * @since 0.2.0
 */
export function createApplication(options) {
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
 * const application = create({ plugins: [plugin] });
 *
 * @param {String} name - plugin's name.
 * @param {PluginInitializationFn} initializer - add description.
 *
 * @return {PluginFactoryFn} plugin's factory.
 *
 * @public
 * @since 0.2.0
 */
export function createPlugin(name, initializer) {
  return function factory(...args) {
    return new Plugin(name, initializer(...args));
  };
}
