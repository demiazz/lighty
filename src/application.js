import Builder from './builder';
import querySelector from './query-selector';


export default class Application {
  constructor(options = { }) {
    this.builders = [];
    this.isRunning = false;

    // Query selector

    this.querySelector = options.querySelector || querySelector;

    // Plugins

    this.plugins = [];

    if (options.plugins) {
      this.plugins = options.plugins.map((plugin) => {
        if (plugin instanceof Function) {
          return plugin();
        }

        return plugin;
      });
    }

    // Running

    if (document.readyState !== 'loading') {
      this.isRunning = true;
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        this.isRunning = true;

        this.vitalize();
      });
    }
  }

  component(selector, proto) {
    const id = this.builders.length;
    const builder = new Builder(
      id, selector, proto, this.plugins, this.querySelector
    );

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
}
