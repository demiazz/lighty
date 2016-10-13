/* eslint no-unused-expressions: 0 */

import isDeepEqual from 'deep-equal';

import { fixture, clear } from './fixtures';

import { plugin as createPlugin } from '../src';
import Application from '../src/application';
import Builder from '../src/builder';


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
  afterEach(clear);

  describe('.constructor', () => {
    it('set given name', () => {
      const name = 'legacy-application';
      const application = new Application(name);

      expect(application.name).toBe(name);
    });

    it('creates empty plugins list', () => {
      const application = new Application();

      expect(isDeepEqual(application.plugins, [])).toBe(true);
    });

    it('creates empty builders list', () => {
      const application = new Application();

      expect(isDeepEqual(application.builders, [])).toBe(true);
    });

    it('creates isRunning flag equals to false', () => {
      const application = new Application();

      expect(application.isRunning).toBe(false);
    });

    it('creates isReady flag equals to false', () => {
      const application = new Application();

      expect(application.isReady).toBe(false);
    });
  });

  describe('.use', () => {
    describe('given nothing', () => {
      it('adds nothing to plugins list', () => {
        const application = new Application();

        application.use();

        expect(isDeepEqual(application.plugins, [])).toBe(true);
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

      expect(isDeepEqual(application.builders, [])).toBe(true);

      application.component('.selector', { });

      expect(application.builders.length).toEqual(1);
      expect(application.builders[0] instanceof Builder).toBe(true);
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

      expect(result instanceof Application).toBe(true);
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

        expect(
          document.querySelector(selector).className.split(' ')
        ).not.toContain(expectedClass);
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

        expect(
          document.querySelector(selector).className.split(' ')
        ).toContain(expectedClass);
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

      let fooNodes;
      let barNodes;

      fooNodes = document.querySelectorAll(fooSelector);

      for (let i = 0; i < fooNodes.length; i += 1) {
        const node = fooNodes.item(i);

        expect(node.className.split(' ')).not.toContain(expectedFooClass);
      }

      barNodes = document.querySelectorAll(barSelector);

      for (let i = 0; i < barNodes.length; i += 1) {
        const node = barNodes.item(i);

        expect(node.className.split(' ')).not.toContain(expectedBarClass);
      }

      application.vitalize();

      fooNodes = document.querySelectorAll(fooSelector);

      for (let i = 0; i < fooNodes.length; i += 1) {
        const node = fooNodes.item(i);

        expect(node.className.split(' ')).toContain(expectedFooClass);
      }

      barNodes = document.querySelectorAll(barSelector);

      for (let i = 0; i < barNodes.length; i += 1) {
        const node = barNodes.item(i);

        expect(node.className.split(' ')).toContain(expectedBarClass);
      }
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

        const fooNodes = document.querySelectorAll(fooSelector);

        for (let i = 0; i < fooNodes.length; i += 1) {
          const node = fooNodes.item(i);

          expect(node.className.split(' ')).not.toContain(expectedFooClass);
        }

        const barNodes = document.querySelectorAll(barSelector);

        for (let i = 0; i < barNodes.length; i += 1) {
          const node = barNodes.item(i);

          expect(node.className.split(' ')).not.toContain(expectedBarClass);
        }

        application.vitalize(`.${treeClass}`);

        const outsideFooNodes = document.querySelectorAll(
          `.${fooClass}.${outsideClass}`
        );

        for (let i = 0; i < outsideFooNodes.length; i += 1) {
          const node = outsideFooNodes.item(i);

          expect(node.className.split(' ')).not.toContain(expectedFooClass);
        }

        const insideFooNodes = document.querySelectorAll(
          `.${fooClass}.${insideClass}`
        );

        for (let i = 0; i < insideFooNodes.length; i += 1) {
          const node = insideFooNodes.item(i);

          expect(node.className.split(' ')).toContain(expectedFooClass);
        }

        const outsideBarNodes = document.querySelectorAll(
          `.${barClass}.${outsideClass}`
        );

        for (let i = 0; i < outsideBarNodes.length; i += 1) {
          const node = outsideBarNodes.item(i);

          expect(node.className.split(' ')).not.toContain(expectedBarClass);
        }

        const insideBarNodes = document.querySelectorAll(
          `.${barClass}.${insideClass}`
        );

        for (let i = 0; i < insideBarNodes.length; i += 1) {
          const node = insideBarNodes.item(i);

          expect(node.className.split(' ')).toContain(expectedBarClass);
        }
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

        let fooNodes;
        let barNodes;

        fooNodes = document.querySelectorAll(fooSelector);

        for (let i = 0; i < fooNodes.length; i += 1) {
          const node = fooNodes.item(i);

          expect(node.className.split(' ')).not.toContain(expectedFooClass);
        }

        barNodes = document.querySelectorAll(barSelector);

        for (let i = 0; i < barNodes.length; i += 1) {
          const node = barNodes.item(i);

          expect(node.className.split(' ')).not.toContain(expectedBarClass);
        }

        application.vitalize();

        fooNodes = document.querySelectorAll(fooSelector);

        for (let i = 0; i < fooNodes.length; i += 1) {
          const node = fooNodes.item(i);

          expect(node.className.split(' ')).toContain(expectedFooClass);
        }

        barNodes = document.querySelectorAll(barSelector);

        for (let i = 0; i < barNodes.length; i += 1) {
          const node = barNodes.item(i);

          expect(node.className.split(' ')).toContain(expectedBarClass);
        }
      });
    });

    describe('.run', () => {
      it('sets isReady flag to true', () => {
        const application = new Application();

        expect(application.isReady).toBe(false);

        application.run();

        expect(application.isReady).toBe(true);
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

          expect(application.isRunning).toBe(false);

          application.run();

          expect(application.isRunning).toBe(false);
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

            expect(application.isRunning).toBe(false);

            application.run();

            expect(application.isRunning).toBe(false);

            window.document.dispatchEvent(event);

            expect(application.isRunning).toBe(true);
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

            expect(application.isRunning).toBe(false);

            application.run();

            expect(application.isRunning).toBe(true);
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
