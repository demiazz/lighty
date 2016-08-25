import Application from './application';
import Plugin from './plugin';


export default new Application();

export function plugin(name, initializer) {
  return function factory(...args) {
    return new Plugin(name, initializer(...args));
  };
}
