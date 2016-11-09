/* eslint no-unused-expressions: 0 */

import { plugin as createPlugin } from '../src';
import Application from '../src/application';
import Builder from '../src/builder';
import querySelector from '../src/query-selector';

import { fixture, clear, matchers } from './helpers';


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

    describe('when options is not given', () => {
      it('set query selector to default query selector', () => {
        const application = new Application();

        expect(application.querySelector).toEqual(querySelector);
      });

      it('set plugins list to empty array', () => {
        const application = new Application();

        expect(application.plugins).toEqual([]);
      });
    });

    describe('when options is given', () => {
      it('set query selector to custom selector from options', () => {
        const customQuerySelector = () => { };
        const options = { querySelector: customQuerySelector };
        const application = new Application('with-options', options);

        expect(application.querySelector).toEqual(customQuerySelector);
      });

      describe('when plugins in options object', () => {
        it('adds plugins to plugins list', () => {
          const fooTransformer = jasmine.createSpy('fooTransformer');
          const fooInitializer =
            jasmine.createSpy('fooInitializer').and.callFake(() => fooTransformer);
          const fooFactory = createPlugin('foo', fooInitializer);
          const barTransformer = jasmine.createSpy('barTransformer');
          const barInitializer = (
            jasmine.createSpy('barInitializer').and.callFake(() => barTransformer)
          );
          const barFactory = createPlugin('bar', barInitializer);
          const barPlugin = barFactory();
          const options = { plugins: [fooFactory, barPlugin] };

          expect(fooTransformer).not.toHaveBeenCalled();
          expect(fooInitializer).not.toHaveBeenCalled();
          expect(barTransformer).not.toHaveBeenCalled();

          const application = new Application('plugins', options);

          expect(fooTransformer).not.toHaveBeenCalled();
          expect(fooInitializer).toHaveBeenCalledTimes(1);
          expect(barTransformer).not.toHaveBeenCalled();

          application.plugins.forEach((plugin) => {
            plugin.transform();
          });

          expect(fooTransformer).toHaveBeenCalledTimes(1);
          expect(fooInitializer).toHaveBeenCalledTimes(1);
          expect(barTransformer).toHaveBeenCalledTimes(1);
        });
      });
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
        const plugin = createPlugin('node-binding', () => (component, node) => {
          component.node = node;
        });
        const application = new Application('is-running', { plugins: [plugin] });

        application.isRunning = true;
        application.component(selector, proto);

        expect(selector).toHaveCSSClass(expectedClass);
      });
    });

    it('create builder with querySelector used by application', () => {
      const customQuerySelector = () => { };
      const options = { querySelector: customQuerySelector };
      const application = new Application('builder-selector', options);

      application.component('.my-component', { });

      expect(application.builders[0].querySelector)
        .toEqual(customQuerySelector);
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

      const plugin = createPlugin('node-binding', () => (component, node) => {
        component.node = node;
      });
      const application = new Application('vitalize', { plugins: [plugin] });

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

        const plugin = createPlugin('node-binding', () => (component, node) => {
          component.node = node;
        });
        const application = new Application('vitalize', { plugins: [plugin] });

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

        const plugin = createPlugin('node-binding', () => (component, node) => {
          component.node = node;
        });
        const application = new Application('vitalize', { plugins: [plugin] });

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
          const spy = spyOn(application, 'vitalize').and.stub();

          application.run();

          expect(spy).not.toHaveBeenCalled();
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
            const spy = spyOn(application, 'vitalize').and.stub();

            const event = document.createEvent('Event');
            event.initEvent('DOMContentLoaded', true, true);

            expect(spy).not.toHaveBeenCalled();

            application.run();

            expect(spy).not.toHaveBeenCalled();

            window.document.dispatchEvent(event);

            expect(spy).toHaveBeenCalledTimes(1);
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
            const spy = spyOn(application, 'vitalize').and.stub();

            application.run();

            expect(spy).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });
});
