const cacheKey = "__lighty__";

function isCached(element, id) {
  return element[cacheKey] && element[cacheKey][id];
}

function cache(element, id) {
  if (!element[cacheKey]) {
    element[cacheKey] = {};
  }

  element[cacheKey][id] = true;
}

export { isCached, cache };
