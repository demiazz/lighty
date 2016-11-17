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
  const e = document.documentElement;

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
const matchesFn = getMatchesFn();

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
 * Creates new array with all items that is a {@link external:`Element`}'s
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
  return elements.filter(element => element instanceof Element);
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

  let roots = [];

  if (tree instanceof Element) {
    roots = [tree];
  } else if (tree instanceof NodeList) {
    roots = filterElements([].slice.call(tree));
  } else if (Array.isArray(tree)) {
    roots = filterElements(tree);
  } else if (typeof tree === 'string') {
    roots = [].slice.call(document.querySelectorAll(tree));
  }

  return roots.reduce((elements, root) => {
    if (matches(root, selector)) {
      elements.push(root);
    }

    return elements.concat(
      [].slice.call(root.querySelectorAll(selector))
    );
  }, []);
}


export default querySelector;
