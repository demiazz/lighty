import matches from "./matches";

function queryAll(element, selector) {
  return element.querySelectorAll(selector);
}

function onlyElements(items) {
  const elements = [];

  for (let i = 0; i < items.length; i += 1) {
    if (items[i] instanceof Element) {
      elements.push(items[i]);
    }
  }

  return elements;
}

function walk(trees, selector, callback) {
  let roots;

  if (typeof trees === "string") {
    roots = queryAll(document, trees);
  } else if (trees instanceof Element) {
    roots = [trees];
  } else if (trees instanceof NodeList || Array.isArray(trees)) {
    roots = onlyElements(trees);
  } else {
    throw new TypeError("unsupported type of tree root");
  }

  for (let i = 0; i < roots.length; i += 1) {
    const root = roots[i];

    if (matches(root, selector)) {
      callback(root);
    }

    const rootElements = queryAll(root, selector);

    for (let j = 0; j < rootElements.length; j += 1) {
      callback(rootElements[j]);
    }
  }
}

export default walk;
