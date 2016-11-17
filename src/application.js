/**
 * Provides Application class.
 *
 * @module application
 *
 * @protected
 * @since 0.2.0
 */

import Builder from './builder';
import querySelector from './query-selector';


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
class Application {
  /**
   * Creates an application instance.
   *
   * @param {ApplicationOptions} [options = { }] - options object.
   */
  constructor(options = { }) {
    this.builders = [];
    this.isRunning = false;

    // Query selector

    this.querySelector = options.querySelector || querySelector;

    // Plugins

    this.plugins = [];

    if (options.plugins) {
      this.plugins = options.plugins.map((plugin) => {
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
  }

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
   * @return {module:application~Application} self.
   *
   * @public
   * @since 0.2.0
   */
  component(selector, proto) {
    const id = this.builders.length;
    const builder = new Builder(
      id, selector, proto, this.plugins, this.querySelector
    );

    this.builders.push(builder);

    if (this.isRunning) {
      const initializer = builder.getInitializer();

      initializer();
    }

    return this;
  }

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
  vitalize(tree) {
    this.builders.forEach((builder) => {
      const initialize = builder.getInitializer(tree);

      initialize();
    });
  }

  /**
   * Sets `isRunning` flag to true and vitalizes all elements on a page.
   *
   * @return {Void} nothing.
   *
   * @private
   * @since 0.2.0
   */
  start() {
    this.isRunning = true;

    this.vitalize();
  }
}


export default Application;
