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

    return this.createInitializer(components);
  }

  createComponent(node) {
    const component = { };
    const properties = Object.keys(this.proto);

    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i];

      component[property] = this.proto[property];
    }

    this.transformComponent(component, node);

    return component;
  }

  checkAndUpdateCache(node) {
    if (node.ids && node.ids.indexOf(this.id) !== -1) {
      return false;
    }

    // eslint-disable-next-line
    node.ids = node.ids ? node.ids.concat(this.id) : [this.id];

    return true;
  }

  transformComponent(component, node) {
    for (let i = 0; i < this.plugins.length; i += 1) {
      this.plugins[i].transform(component, node);
    }
  }

  // eslint-disable-next-line
  createInitializer(components) {
    return function initializer() {
      for (let i = 0; i < components.length; i += 1) {
        const component = components[i];

        if (component.init) {
          component.init();
        }
      }
    };
  }
}
