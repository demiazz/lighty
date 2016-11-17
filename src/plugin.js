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
class Plugin {
  /**
   * Creates a plugin instance.
   *
   * @param {String} name - plugin's name.
   * @param {TransformerFn} transformer - transformation function.
   */
  constructor(name, transformer) {
    this.name = name;
    this.transformer = transformer;
  }

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
  transform(component, element) {
    this.transformer(component, element);
  }
}


export default Plugin;
