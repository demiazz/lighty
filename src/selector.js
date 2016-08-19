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

const matchesFn = getMatchesFn();

function matches(element, selector) {
  return matchesFn.call(element, selector);
}

export default function findInTree(tree, selector) {
  if (tree.jquery) {
    return tree.filter(selector).add(tree.find(selector)).toArray();
  }

  let roots;

  if (tree instanceof HTMLElement) {
    roots = [tree];
  } else if (tree instanceof NodeList) {
    roots = [].slice.call(tree);
  } else if (Array.isArray(tree)) {
    roots = tree;
  } else if (typeof tree === 'string') {
    roots = [].slice.call(document.querySelectorAll(tree));
  }

  return roots.reduce((nodes, root) => {
    if (matches(root, selector)) {
      nodes.push(root);
    }

    return nodes.concat(
      [].slice.call(root.querySelectorAll(selector))
    );
  }, []);
}
