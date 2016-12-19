import walk from './walk';


class Engine {
  constructor(builder, onStart) {
    if (!(builder instanceof Function)) {
      throw new TypeError('Builder must be a function');
    }

    this.cacheKey = `__lighty__${Engine.getUniqueId()}`;
    this.builder = builder;
    this.onStart = onStart;

    this.isRunning = false;
    this.components = [];

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      // See https://connect.microsoft.com/IE/feedback/details/792880/document-readystat
      setTimeout(() => this.start(), 1);
    }
  }

  component(selector, ...args) {
    const id = this.components.length;

    this.components.push([id, selector, args]);

    if (this.isRunning) {
      this.build(document.body, id, selector, args);
    }
  }

  vitalize(trees = document.body) {
    if (!this.isRunning) {
      throw Error('Document is not ready yet.');
    }

    this.components.forEach((component) => {
      this.build(trees, ...component);
    });
  }

  start() {
    this.isRunning = true;

    this.vitalize();

    if (this.onStart) {
      this.onStart();
    }
  }

  build(trees, id, selector, args) {
    walk(trees, selector, (element) => {
      if (this.isCached(element, id)) {
        return;
      }

      this.builder(element, ...args);
      this.cache(element, id);
    });
  }

  isCached(element, id) {
    const cache = element[this.cacheKey];

    return cache && cache.indexOf(id) !== -1;
  }

  cache(element, id) {
    const cache = element[this.cacheKey];

    element[this.cacheKey] = cache ? cache.concat(id) : [id];
  }
}


Engine.getUniqueId = function getUniqueId() {
  if (this.incrementalId == null) {
    this.incrementalId = 0;
  }

  const result = this.incrementalId;

  this.incrementalId += 1;

  return result;
};


export default Engine;
