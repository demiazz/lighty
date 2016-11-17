/* eslint no-unused-expressions: 0 */

import { createPlugin } from '../src';
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
    it('creates application without any builders', () => {
      const application = new Application();

      expect(application.builders).toBeEmptyArray();
    });

    describe('options', () => {
      describe('plugins', () => {
        it('set `plugins` to empty array if not given', () => {
          const application = new Application();

          expect(application.plugins).toEqual([]);
        });

        it('set `plugins` from options if given', () => {
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

          const application = new Application(options);

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

      describe('querySelector', () => {
        it('set `querySelector` to default `querySelector` if not given', () => {
          const application = new Application();

          expect(application.querySelector).toEqual(querySelector);
        });

        it('set `querySelector` from options if given', () => {
          const customQuerySelector = () => { };
          const options = { querySelector: customQuerySelector };
          const application = new Application(options);

          expect(application.querySelector).toEqual(customQuerySelector);
        });
      });
    });

    describe('running', () => {
      describe('when `document.readyState` is equal to `loading`', () => {
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

        it("don't vitalize components immediately'", () => {
          fixture('<div class="loading"></div>');

          expect(document.querySelector('.loading'))
            .not.toHaveCSSClass('is-ready');

          const plugin = createPlugin('bind', () => (component, element) => {
            component.element = element;
          });
          const application = new Application({ plugins: [plugin] });

          application.component('.loading', {
            init() {
              this.element.className = 'loading is-ready';
            },
          });

          expect(document.querySelector('.loading'))
            .not.toHaveCSSClass('is-ready');
        });

        describe('when `onDOMContentLoaded` raised', () => {
          it('vitalize components immediately after event', () => {
            fixture('<div class="loading"></div>');

            expect(document.querySelector('.loading'))
              .not.toHaveCSSClass('is-ready');

            const plugin = createPlugin('bind', () => (component, element) => {
              component.element = element;
            });
            const application = new Application({ plugins: [plugin] });

            application.component('.loading', {
              init() {
                this.element.className = 'loading is-ready';
              },
            });

            expect(document.querySelector('.loading'))
              .not.toHaveCSSClass('is-ready');

            const event = document.createEvent('Event');
            event.initEvent('DOMContentLoaded', true, true);
            window.document.dispatchEvent(event);

            expect(document.querySelector('.loading'))
              .toHaveCSSClass('is-ready');
          });

          it('vitalize new components immediately after event', () => {
            fixture('<div class="loading"></div>');

            expect(document.querySelector('.loading'))
              .not.toHaveCSSClass('is-ready');

            const plugin = createPlugin('bind', () => (component, element) => {
              component.element = element;
            });
            const application = new Application({ plugins: [plugin] });

            const event = document.createEvent('Event');
            event.initEvent('DOMContentLoaded', true, true);
            window.document.dispatchEvent(event);

            application.component('.loading', {
              init() {
                this.element.className = 'loading is-ready';
              },
            });

            expect(document.querySelector('.loading'))
              .toHaveCSSClass('is-ready');
          });
        });
      });

      ['interactive', 'complete'].forEach((state) => {
        describe(`when \`document.readyState\` is equal to \`${state}\``, () => {
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

          it('vitalize components immediately, but asyncronously', (done) => {
            Object.defineProperty(document, 'readyState', {
              value: state,
              writable: true,
            });

            fixture(`<div class="${state}"></div>`);

            expect(document.querySelector(`.${state}`))
              .not.toHaveCSSClass('is-ready');

            const plugin = createPlugin('bind', () => (component, element) => {
              component.element = element;
            });
            const application = new Application({ plugins: [plugin] });

            application.component(`.${state}`, {
              init() {
                this.element.className = `${state} is-ready`;
              },
            });

            setTimeout(() => {
              expect(document.querySelector(`.${state}`))
                .toHaveCSSClass('is-ready');

              done();
            }, 1);
          });
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

    it('create builder with querySelector used by application', () => {
      const customQuerySelector =
        (tree, selector) => querySelector(tree, selector);
      const options = { querySelector: customQuerySelector };
      const application = new Application(options);

      application.component('.my-component', { });

      expect(application.builders[0].querySelector)
        .toEqual(customQuerySelector);
    });

    describe('when `document.readyState` is equal to `loading`', () => {
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

      it("doesn't initialize component on elements matched by selector", () => {
        const elementClass = 'element';

        fixture(`
          <div class="${elementClass}"></div>
        `);

        const expectedClass = 'is-component';
        const selector = `.${elementClass}`;
        const proto = {
          init() {
            this.element.className = `${this.element.className} ${expectedClass}`;
          },
        };
        const plugin = createPlugin('element-binding', () => (component, element) => {
          component.element = element;
        });
        const application = new Application(plugin);

        application.isRunning = false;
        application.component(selector, proto);

        expect(selector).not.toHaveCSSClass(expectedClass);
      });
    });

    describe('when `document.readyState` is not equal to `loading`', () => {
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

      it('initialize component on elements matched by selector', () => {
        ['interactive', 'complete'].forEach((state) => {
          Object.defineProperty(document, 'readyState', {
            value: state,
            writable: true,
          });

          const elementClass = 'element';

          fixture(`
            <div class="${elementClass}"></div>
          `);

          const expectedClass = 'is-component';
          const selector = `.${elementClass}`;
          const proto = {
            init() {
              this.element.className = `${this.element.className} ${expectedClass}`;
            },
          };
          const plugin = createPlugin('element-binding', () => (component, element) => {
            component.element = element;
          });
          const application = new Application({ plugins: [plugin] });

          application.isRunning = true;
          application.component(selector, proto);

          expect(selector).toHaveCSSClass(expectedClass);
        });
      });
    });
  });

  describe('.vitalize', () => {
    it('creates components on all matched elements in document', () => {
      const fooClass = 'foo';
      const barClass = 'bar';

      const plugin = createPlugin('element-binding', () => (component, element) => {
        component.element = element;
      });
      const application = new Application({ plugins: [plugin] });

      const expectedFooClass = 'is-foo-component';
      const fooSelector = `.${fooClass}`;
      const fooProto = {
        init() {
          this.element.className = `${this.element.className} ${expectedFooClass}`;
        },
      };
      application.component(fooSelector, fooProto);

      const expectedBarClass = 'is-bar-component';
      const barSelector = `.${barClass}`;
      const barProto = {
        init() {
          this.element.className = `${this.element.className} ${expectedBarClass}`;
        },
      };
      application.component(barSelector, barProto);

      fixture(`
        <div class="${fooClass}"></div>
        <div class="${barClass}"></div>
        <div>
          <div class="${fooClass}"></div>
          <div class="${barClass}"></div>
        </div>
      `);

      expect(fooSelector).not.toHaveCSSClass(expectedFooClass);
      expect(barSelector).not.toHaveCSSClass(expectedBarClass);

      application.vitalize();

      expect(fooSelector).toHaveCSSClass(expectedFooClass);
      expect(barSelector).toHaveCSSClass(expectedBarClass);
    });

    describe('given tree', () => {
      it('creates components on all matched elements', () => {
        const treeClass = 'tree';
        const fooClass = 'foo';
        const barClass = 'bar';
        const outsideClass = 'outside';
        const insideClass = 'inside';

        const plugin = createPlugin('element-binding', () => (component, element) => {
          component.element = element;
        });
        const application = new Application({ plugins: [plugin] });

        const expectedFooClass = 'is-foo-component';
        const fooSelector = `.${fooClass}`;
        const fooProto = {
          init() {
            this.element.className = `${this.element.className} ${expectedFooClass}`;
          },
        };
        application.component(fooSelector, fooProto);

        const expectedBarClass = 'is-bar-component';
        const barSelector = `.${barClass}`;
        const barProto = {
          init() {
            this.element.className = `${this.element.className} ${expectedBarClass}`;
          },
        };
        application.component(barSelector, barProto);

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

        const plugin = createPlugin('element-binding', () => (component, element) => {
          component.element = element;
        });
        const application = new Application({ plugins: [plugin] });

        const expectedFooClass = 'is-foo-component';
        const fooSelector = `.${fooClass}`;
        const fooProto = {
          init() {
            this.element.className = `${this.element.className} ${expectedFooClass}`;
          },
        };
        application.component(fooSelector, fooProto);

        const expectedBarClass = 'is-bar-component';
        const barSelector = `.${barClass}`;
        const barProto = {
          init() {
            this.element.className = `${this.element.className} ${expectedBarClass}`;
          },
        };
        application.component(barSelector, barProto);

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

        expect(fooSelector).not.toHaveCSSClass(expectedFooClass);
        expect(barSelector).not.toHaveCSSClass(expectedBarClass);

        application.vitalize();

        expect(fooSelector).toHaveCSSClass(expectedFooClass);
        expect(barSelector).toHaveCSSClass(expectedBarClass);
      });
    });
  });
});
