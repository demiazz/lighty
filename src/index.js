import Application from './application';
import Plugin from './plugin';
import querySelector from './query-selector';


export { querySelector };

export function create(options) {
  return new Application(options);
}

export function plugin(name, initializer) {
  return function factory(...args) {
    return new Plugin(name, initializer(...args));
  };
}
