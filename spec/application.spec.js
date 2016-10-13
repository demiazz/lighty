/* eslint no-unused-expressions: 0 */

import { plugin as createPlugin } from '../src';
import Application from '../src/application';
import Builder from '../src/builder';

import { fixture, clear } from './fixtures';
import matchers from './matchers';


function isReadyStateMockable() {
  try {
    Object.defineProperty(document, 'readyState', {
      value: document.readyState,
      writable: true,
    });

    return true;
  } catch (_) {
    return false;
  }
}


describe('Application', () => {
  beforeEach(() => {
    window.jasmine.addMatchers(matchers);
  });

  afterEach(clear);

  describe('.constructor', () => {
    it('set given name', () => {
      const name = 'legacy-application';
      const application = new Application(name);

      expect(application.name).toBe(name);
    });

    it('creates empty plugins list', () => {
      const application = new Application();

      expect(application.plugins).toBeEmptyArray();
    });

    it('creates empty builders list', () => {
      const application = new Application();

      expect(application.builders).toBeEmptyArray();
    });

    it('creates isRunning flag equals to false', () => {
      const application = new Application();

      expect(application.isRunning).toBeFalse();
    });

    it('creates isReady flag equals to false', () => {
      const application = new Application();

      expect(application.isReady).toBeFalse();
    });
  });

  describe('.use', () => {
    describe('given nothing', () => {
      it('adds nothing to plugins list', () => {
        const application = new Application();

        application.use();

        expect(application.plugins).toBeEmptyArray();
      });
    });

    describe('given single plugin', () => {
      describe('argument is a plugin factory', () => {
        it('creates plugin instance and add to plugins list', () => {
          const application = new Application();
          const transformer = sinon.spy();
          const initializer = sinon.spy(() => transformer);
          const factory = createPlugin('my-plugin', initializer);

          expect(transformer.callCount).toEqual(0);
          expect(initializer.callCount).toEqual(0);

          application.use(factory);

          expect(transformer.callCount).toEqual(0);
          expect(initializer.callCount).toEqual(1);

          application.plugins[0].transform();

          expect(transformer.callCount).toEqual(1);
          expect(initializer.callCount).toEqual(1);
        });
      });

      describe('argument is a Plugin instance', () => {
        it('adds plugin to plugins list', () => {
          const application = new Application();
          const transformer = sinon.spy();
          const initializer = sinon.spy(() => transformer);
          const factory = createPlugin('my-plugin', initializer);
          const plugin = factory();

          expect(transformer.callCount).toEqual(0);

          application.use(plugin);

          expect(transformer.callCount).toEqual(0);

          application.plugins[0].transform();

          expect(transformer.callCount).toEqual(1);
        });
      });
    });

    describe('given multiple plugins', () => {
      it('adds plugin instances and results of plugin factories', () => {
        const application = new Application();
        const fooTransformer = sinon.spy();
        const fooInitializer = sinon.spy(() => fooTransformer);
        const fooFactory = createPlugin('foo', fooInitializer);
        const barTransformer = sinon.spy();
        const barInitializer = sinon.spy(() => barTransformer);
        const barFactory = createPlugin('bar', barInitializer);
        const barPlugin = barFactory();

        expect(fooTransformer.callCount).toEqual(0);
        expect(fooInitializer.callCount).toEqual(0);
        expect(barTransformer.callCount).toEqual(0);

        application.use(fooFactory, barPlugin);

        expect(fooTransformer.callCount).toEqual(0);
        expect(fooInitializer.callCount).toEqual(1);
        expect(barTransformer.callCount).toEqual(0);

        for (let i = 0; i < application.plugins.length; i += 1) {
          application.plugins[i].transform();
        }

        expect(fooTransformer.callCount).toEqual(1);
        expect(fooInitializer.callCount).toEqual(1);
        expect(barTransformer.callCount).toEqual(1);
      });
    });

    describe('given array of plugins', () => {
      it('adds plugin instances and results of plugin factories from array', () => {
        const application = new Application();
        const fooTransformer = sinon.spy();
        const fooInitializer = sinon.spy(() => fooTransformer);
        const fooFactory = createPlugin('foo', fooInitializer);
        const barTransformer = sinon.spy();
        const barInitializer = sinon.spy(() => barTransformer);
        const barFactory = createPlugin('bar', barInitializer);
        const barPlugin = barFactory();

        expect(fooTransformer.callCount).toEqual(0);
        expect(fooInitializer.callCount).toEqual(0);
        expect(barTransformer.callCount).toEqual(0);

        application.use([fooFactory, barPlugin]);

        expect(fooTransformer.callCount).toEqual(0);
        expect(fooInitializer.callCount).toEqual(1);
        expect(barTransformer.callCount).toEqual(0);

        for (let i = 0; i < application.plugins.length; i += 1) {
          application.plugins[i].transform();
        }

        expect(fooTransformer.callCount).toEqual(1);
        expect(fooInitializer.callCount).toEqual(1);
        expect(barTransformer.callCount).toEqual(1);
      });
    });

    describe('given mixed arrays and plugins', () => {
      it('adds plugin instances and results of plugins factories', () => {
        const application = new Application();
        const fooTransformer = sinon.spy();
        const fooInitializer = sinon.spy(() => fooTransformer);
        const fooFactory = createPlugin('foo', fooInitializer);
        const barTransformer = sinon.spy();
        const barInitializer = sinon.spy(() => barTransformer);
        const barFactory = createPlugin('bar', barInitializer);
        const barPlugin = barFactory();

        expect(fooTransformer.callCount).toEqual(0);
        expect(fooInitializer.callCount).toEqual(0);
        expect(barTransformer.callCount).toEqual(0);

        application.use(fooFactory, barPlugin, [fooFactory, barPlugin]);

        expect(fooTransformer.callCount).toEqual(0);
        expect(fooInitializer.callCount).toEqual(2);
        expect(barTransformer.callCount).toEqual(0);

        for (let i = 0; i < application.plugins.length; i += 1) {
          application.plugins[i].transform();
        }

        expect(fooTransformer.callCount).toEqual(2);
        expect(fooInitializer.callCount).toEqual(2);
        expect(barTransformer.callCount).toEqual(2);
      });
    });

    it('returns application instance as result', () => {
      const application = new Application();

      expect(application.use()).toEqual(application);
    });
  });

  describe('.component', () => {
    it('creates builder instance', () => {
      const application = new Application();

      expect(application.builders).toBeEmptyArray();

      application.component('.selector', { });

      expect(application.builders.length).toEqual(1);
      expect(application.builders[0]).toBeInstanceOf(Builder);
    });

    it('assigns unique id to each new builder', () => {
      const application = new Application();

      application.component('.first', { });
      application.component('.second', { });

      const [first, second] = application.builders;

      expect(first.id).not.toEqual(second.id);
    });

    it('returns application instance', () => {
      const application = new Application();
      const result = application.component('.selector', { });

      expect(result).toBeInstanceOf(Application);
    });

    describe('isRunning flag is setted to false', () => {
      it("doesn't initialize component on nodes matched by selector", () => {
        const nodeClass = 'node';

        fixture(`
          <div class="${nodeClass}"></div>
        `);

        const expectedClass = 'is-component';
        const selector = `.${nodeClass}`;
        const proto = {
          init() {
            this.node.className = `${this.node.className} ${expectedClass}`;
          },
        };
        const plugin = createPlugin('node-binding', () => (component, node) => {
          component.node = node;
        });
        const application = new Application(plugin);

        application.isRunning = false;
        application.component(selector, proto);

        expect(selector).not.toHaveCSSClass(expectedClass);
      });
    });

    describe('isRunning flag is setted to true', () => {
      it('initialize component on nodes matched by selector', () => {
        const nodeClass = 'node';

        fixture(`
          <div class="${nodeClass}"></div>
        `);

        const expectedClass = 'is-component';
        const selector = `.${nodeClass}`;
        const proto = {
          init() {
            this.node.className = `${this.node.className} ${expectedClass}`;
          },
        };
        const application = new Application();

        application.use(createPlugin('node-binding', () => (component, node) => {
          component.node = node;
        }));

        application.isRunning = true;
        application.component(selector, proto);

        expect(selector).toHaveCSSClass(expectedClass);
      });
    });
  });

  describe('.vitalize', () => {
    it('creates components on all matched nodes in document', () => {
      const fooClass = 'foo';
      const barClass = 'bar';

      fixture(`
        <div class="${fooClass}"></div>
        <div class="${barClass}"></div>
        <div>
          <div class="${fooClass}"></div>
          <div class="${barClass}"></div>
        </div>
      `);

      const application = new Application();

      application.use(createPlugin('node-binding', () => (component, node) => {
        component.node = node;
      }));

      const expectedFooClass = 'is-foo-component';
      const fooSelector = `.${fooClass}`;
      const fooProto = {
        init() {
          this.node.className = `${this.node.className} ${expectedFooClass}`;
        },
      };
      application.component(fooSelector, fooProto);

      const expectedBarClass = 'is-bar-component';
      const barSelector = `.${barClass}`;
      const barProto = {
        init() {
          this.node.className = `${this.node.className} ${expectedBarClass}`;
        },
      };
      application.component(barSelector, barProto);

      expect(fooSelector).not.toHaveCSSClass(expectedFooClass);
      expect(barSelector).not.toHaveCSSClass(expectedBarClass);

      application.vitalize();

      expect(fooSelector).toHaveCSSClass(expectedFooClass);
      expect(barSelector).toHaveCSSClass(expectedBarClass);
    });

    describe('given tree', () => {
      it('creates components on all matched nodes', () => {
        const treeClass = 'tree';
        const fooClass = 'foo';
        const barClass = 'bar';
        const outsideClass = 'outside';
        const insideClass = 'inside';

        fixture(`
          <div class="${fooClass} ${outsideClass}"></div>
          <div class="${barClass} ${outsideClass}"></div>
          <div>
            <div class="${fooClass} ${outsideClass}"></div>
            <div class="${barClass} ${outsideClass}"></div>
          </div>
          <div class="${treeClass}">
            <div class="${fooClass} ${insideClass}"></div>
            <div class="${barClass} ${insideClass}"></div>
            <div>
              <div class="${fooClass} ${insideClass}"></div>
              <div class="${barClass} ${insideClass}"></div>
            </div>
          </div>
        `);

        const application = new Application();

        application.use(createPlugin('node-binding', () => (component, node) => {
          component.node = node;
        }));

        const expectedFooClass = 'is-foo-component';
        const fooSelector = `.${fooClass}`;
        const fooProto = {
          init() {
            this.node.className = `${this.node.className} ${expectedFooClass}`;
          },
        };
        application.component(fooSelector, fooProto);

        const expectedBarClass = 'is-bar-component';
        const barSelector = `.${barClass}`;
        const barProto = {
          init() {
            this.node.className = `${this.node.className} ${expectedBarClass}`;
          },
        };
        application.component(barSelector, barProto);

        expect(fooSelector).not.toHaveCSSClass(expectedFooClass);
        expect(barSelector).not.toHaveCSSClass(expectedBarClass);

        application.vitalize(`.${treeClass}`);

        expect(`.${fooClass}.${outsideClass}`)
          .not.toHaveCSSClass(expectedFooClass);
        expect(`.${fooClass}.${insideClass}`)
          .toHaveCSSClass(expectedFooClass);
        expect(`.${barClass}.${outsideClass}`)
          .not.toHaveCSSClass(expectedBarClass);
        expect(`.${barClass}.${insideClass}`)
          .toHaveCSSClass(expectedBarClass);
      });

      it('creates components on tree rootes if matched by component selectors', () => {
        const fooClass = 'foo';
        const barClass = 'bar';

        fixture(`
          <div class="${fooClass}"></div>
          <div class="${fooClass}">
            <div class="${fooClass}"></div>
          </div>
          <div class="${fooClass}">
            <div class="${barClass}"></div>
          </div>

          <div class="${barClass}"></div>
          <div class="${barClass}">
            <div class="${barClass}"></div>
          </div>
          <div class="${barClass}">
            <div class="${fooClass}"></div>
          </div>
        `);

        const application = new Application();

        application.use(createPlugin('node-binding', () => (component, node) => {
          component.node = node;
        }));

        const expectedFooClass = 'is-foo-component';
        const fooSelector = `.${fooClass}`;
        const fooProto = {
          init() {
            this.node.className = `${this.node.className} ${expectedFooClass}`;
          },
        };
        application.component(fooSelector, fooProto);

        const expectedBarClass = 'is-bar-component';
        const barSelector = `.${barClass}`;
        const barProto = {
          init() {
            this.node.className = `${this.node.className} ${expectedBarClass}`;
          },
        };
        application.component(barSelector, barProto);

        expect(fooSelector).not.toHaveCSSClass(expectedFooClass);
        expect(barSelector).not.toHaveCSSClass(expectedBarClass);

        application.vitalize();

        expect(fooSelector).toHaveCSSClass(expectedFooClass);
        expect(barSelector).toHaveCSSClass(expectedBarClass);
      });
    });

    describe('.run', () => {
      it('sets isReady flag to true', () => {
        const application = new Application();

        expect(application.isReady).toBeFalse();

        application.run();

        expect(application.isReady).toBeTrue();
      });

      it('returns application instance as result', () => {
        const application = new Application();

        expect(application.run()).toEqual(application);
      });

      describe('document.readyState is equal to `loading`', () => {
        let backup;

        if (!isReadyStateMockable()) {
          it("can't be tested because `document.readyState` can't be mocked in this browser");

          return;
        }

        beforeEach(() => {
          backup = document.readyState;

          Object.defineProperty(document, 'readyState', {
            value: 'loading',
            writable: true,
          });
        });

        afterEach(() => {
          Object.defineProperty(document, 'readyState', {
            value: backup,
            writable: true,
          });
        });

        it("doesn't set isRunning flag to true", () => {
          const application = new Application();

          expect(application.isRunning).toBeFalse();

          application.run();

          expect(application.isRunning).toBeFalse();
        });

        it("doesn't run vitalize", () => {
          const application = new Application();
          const spy = sinon.spy();

          sinon.stub(application, 'vitalize', spy);

          application.run();

          expect(spy.callCount).toEqual(0);
        });

        describe('on DOMContentLoaded', () => {
          it('sets isRunning flag to true', () => {
            const application = new Application();

            const event = document.createEvent('Event');
            event.initEvent('DOMContentLoaded', true, true);

            expect(application.isRunning).toBeFalse();

            application.run();

            expect(application.isRunning).toBeFalse();

            window.document.dispatchEvent(event);

            expect(application.isRunning).toBeTrue();
          });

          it('run vitalize', () => {
            const application = new Application();
            const spy = sinon.spy();

            sinon.stub(application, 'vitalize', spy);

            const event = document.createEvent('Event');
            event.initEvent('DOMContentLoaded', true, true);

            expect(spy.callCount).toEqual(0);

            application.run();

            expect(spy.callCount).toEqual(0);

            window.document.dispatchEvent(event);

            expect(spy.callCount).toEqual(1);
          });
        });
      });

      describe('document.readyState is not equal to `loading`', () => {
        let backup;

        if (!isReadyStateMockable()) {
          it("can't be tested because `document.readyState` can't be mocked in this browser");

          return;
        }

        beforeEach(() => {
          backup = document.readyState;
        });

        afterEach(() => {
          Object.defineProperty(document, 'readyState', {
            value: backup,
            writable: true,
          });
        });

        it('sets isRunning flag to true', () => {
          ['interactive', 'complete'].forEach((state) => {
            Object.defineProperty(document, 'readyState', {
              value: state,
              writable: true,
            });

            const application = new Application();

            expect(application.isRunning).toBeFalse();

            application.run();

            expect(application.isRunning).toBeTrue();
          });
        });

        it('runs vitalize', () => {
          ['interactive', 'complete'].forEach((state) => {
            Object.defineProperty(document, 'readyState', {
              value: state,
              writable: true,
            });

            const application = new Application();
            const spy = sinon.spy();

            sinon.stub(application, 'vitalize', spy);

            application.run();

            expect(spy.callCount).toEqual(1);
          });
        });
      });
    });
  });
});
