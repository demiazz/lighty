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

function filterElements(elements) {
  return elements.filter(e => e instanceof Element);
}

function toArray(nodeList) {
  return [].slice.call(nodeList);
}

function walk(trees, selector, callback) {
  let roots;

  if (trees instanceof Element) {
    roots = [trees];
  } else if (trees instanceof NodeList) {
    roots = filterElements(toArray(trees));
  } else if (Array.isArray(trees)) {
    roots = filterElements(trees);
  } else if (typeof trees === 'string') {
    roots = toArray(document.querySelectorAll(trees));
  } else {
    throw new TypeError('Unsupported type of tree root');
  }

  roots.forEach((root) => {
    if (matches(root, selector)) {
      callback(root);
    }

    [].slice.call(root.querySelectorAll(selector)).forEach(callback);
  });
}


export default walk;
