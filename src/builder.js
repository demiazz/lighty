import findInTree from './selector';


export default class Builder {
  constructor(id, selector, proto, plugins) {
    this.id = id;
    this.selector = selector;
    this.proto = proto;
    this.plugins = plugins;
  }

  getInitializer(tree = document.body) {
    const nodes = findInTree(tree, this.selector);

    const components = nodes.reduce((cs, node) => {
      if (this.checkAndUpdateCache(node)) {
        cs.push(this.createComponent(node));
      }

      return cs;
    }, []);

    return function initializer() {
      components.forEach((component) => {
        if (!component.init) {
          return;
        }

        component.init();
      });
    };
  }

  createComponent(node) {
    const component = Object.keys(this.proto).reduce((instance, property) => {
      instance[property] = this.proto[property];

      return instance;
    }, { });

    this.transformComponent(component, node);

    return component;
  }

  checkAndUpdateCache(node) {
    if (node.ids && node.ids.indexOf(this.id) !== -1) {
      return false;
    }

    node.ids = node.ids ? node.ids.concat(this.id) : [this.id];

    return true;
  }

  transformComponent(component, node) {
    this.plugins.forEach((plugin) => {
      plugin.transform(component, node);
    });
  }
}
