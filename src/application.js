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
      // See https://connect.microsoft.com/IE/feedback/details/792880/document-readystat
      setTimeout(this.start.bind(this), 1);
    } else {
      document.addEventListener('DOMContentLoaded', this.start.bind(this));
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

  start() {
    this.isRunning = true;

    this.vitalize();
  }
}
