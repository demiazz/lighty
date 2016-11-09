import Application from './application';
import Plugin from './plugin';


const applications = { };


export function create(name = 'default') {
  let instance = applications[name];

  if (!instance) {
    instance = new Application(name);

    applications[name] = instance;
  }

  return instance;
}

export function plugin(name, initializer) {
  return function factory(...args) {
    return new Plugin(name, initializer(...args));
  };
}
