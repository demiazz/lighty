import Builder from './builder';


export default class Application {
  constructor(name) {
    this.name = name;
    this.plugins = [];
    this.builders = [];
    this.isReady = false;
    this.isRunning = false;
  }

  use(...plugins) {
    this.plugins = this.plugins.concat(
      this.normalize(plugins)
    );

    return this;
  }

  component(selector, proto) {
    const id = this.builders.length;
    const builder = new Builder(id, selector, proto, this.plugins);

    this.builders.push(builder);

    if (this.isRunning) {
      const initializer = builder.getInitializer();

      initializer();
    }

    return this;
  }

  vitalize(tree) {
    this.builders.forEach((builder) => {
      const initialize = builder.getInitializer(tree);

      initialize();
    });
  }

  run() {
    this.isReady = true;

    if (document.readyState !== 'loading') {
      this.start();
    } else {
      document.addEventListener('DOMContentLoaded', () => this.start());
    }

    return this;
  }

  start() {
    this.isRunning = true;

    this.vitalize();
  }

  normalize(plugins) {
    return plugins.reduce((ps, p) => {
      const instances = Array.isArray(p)
        ? p.map(plugin => this.instantiatePlugin(plugin))
        : this.instantiatePlugin(p);

      return ps.concat(instances);
    }, []);
  }

  // eslint-disable-next-line
  instantiatePlugin(plugin) {
    if (plugin instanceof Function) {
      return plugin();
    }

    return plugin;
  }
}
