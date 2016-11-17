/* eslint no-unused-expressions: 0 */

import { createPlugin } from '../src';
import Builder from '../src/builder';
import querySelector from '../src/query-selector';

import { fixture, clear, matchers } from './helpers';


describe('Builder', () => {
  beforeEach(() => {
    window.jasmine.addMatchers(matchers);
  });

  afterEach(clear);

  describe('.constructor', () => {
    it('gives id, selector, proto, plugins and querySelector list', () => {
      const id = 0;
      const selector = '.component';
      const proto = { init() { } };
      const plugins = [
        createPlugin('my-plugin', () => () => { })(),
      ];

      const builder = new Builder(id, selector, proto, plugins, querySelector);

      expect(builder.id).toEqual(id);
      expect(builder.selector).toEqual(selector);
      expect(builder.proto).toDeepEqual(proto);
      expect(builder.plugins).toDeepEqual(plugins);
      expect(builder.querySelector).toEqual(querySelector);
    });
  });

  describe('.getInitializer', () => {
    it('returns initializer which call init for each component', () => {
      const elementClass = 'build';

      fixture(`
        <div class="${elementClass}"></div>
        <div class="${elementClass}"></div>
      `);

      const selector = `.${elementClass}`;
      const spy = jasmine.createSpy('init');
      const proto = {
        init() {
          spy();
        },
      };

      const builder = new Builder(0, selector, proto, [], querySelector);

      expect(spy).not.toHaveBeenCalled();

      const initialize = builder.getInitializer();

      expect(spy).not.toHaveBeenCalled();

      initialize();

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it("returns initializer which doesn't call `init` if it doesn't exists", () => {
      const elementClass = 'build';

      fixture(`<div class="${elementClass}"></div>`);

      const selector = `.${elementClass}`;
      const proto = { };
      const builder = new Builder(0, selector, proto, [], querySelector);
      const initialize = builder.getInitializer();

      expect(initialize).not.toThrow();
    });

    it('transforms component with plugins before creating initializer', () => {
      const elementClass = 'build';

      fixture(`<div class="${elementClass}"></div>`);

      const expectedPluginClass = 'from-plugin';
      const expectedComponentClass = 'from-component';
      const selector = `.${elementClass}`;
      const proto = {
        init() {
          this.element.className =
            `${this.element.className} ${expectedComponentClass}`;
        },
      };
      const plugins = [
        createPlugin('element-binding', () => (component, element) => {
          element.className = `${element.className} ${expectedPluginClass}`;

          component.element = element;
        })(),
      ];

      expect(selector).not.toHaveCSSClass(expectedPluginClass);
      expect(selector).not.toHaveCSSClass(expectedComponentClass);

      const builder = new Builder(0, selector, proto, plugins, querySelector);

      expect(selector).not.toHaveCSSClass(expectedPluginClass);
      expect(selector).not.toHaveCSSClass(expectedComponentClass);

      const initialize = builder.getInitializer();

      expect(selector).toHaveCSSClass(expectedPluginClass);
      expect(selector).not.toHaveCSSClass(expectedComponentClass);

      initialize();

      expect(selector).toHaveCSSClass(expectedPluginClass);
      expect(selector).toHaveCSSClass(expectedComponentClass);
    });

    it('can use subtree for searching elements', () => {
      const treeClass = 'tree';
      const elementClass = 'build';

      fixture(`
        <div id="outside" class="${elementClass}"></div>
        <div class="${treeClass}">
          <div id="inside" class="${elementClass}"></div>
        </div>
      `);

      const expectedClass = 'is-ready';
      const selector = `.${elementClass}`;
      const proto = {
        init() {
          this.element.className = `${this.element.className} ${expectedClass}`;
        },
      };
      const plugins = [
        createPlugin('element-binding', () => (component, element) => {
          component.element = element;
        })(),
      ];
      const builder = new Builder(0, selector, proto, plugins, querySelector);
      const initialize = builder.getInitializer(`.${treeClass}`);

      initialize();

      expect('#inside').toHaveCSSClass(expectedClass);
      expect('#outside').not.toHaveCSSClass(expectedClass);
    });

    it('can use subtree including root for searching elements', () => {
      const elementClass = 'element';

      fixture(`
        <div id="parent" class="${elementClass}">
          <div id="children" class="${elementClass}"></div>
        </div>
      `);

      const expectedClass = 'is-ready';
      const selector = `.${elementClass}`;
      const proto = {
        init() {
          this.element.className = `${this.element.className} ${expectedClass}`;
        },
      };
      const plugins = [
        createPlugin('element-binding', () => (component, element) => {
          component.element = element;
        })(),
      ];
      const builder = new Builder(0, selector, proto, plugins, querySelector);
      const initialize = builder.getInitializer();

      initialize();

      expect('#parent').toHaveCSSClass(expectedClass);
      expect('#children').toHaveCSSClass(expectedClass);
    });

    it('builds component only once for each element', () => {
      const elementClass = 'build';

      fixture(`<div class="${elementClass}"></div>`);

      const calls = [];
      const selector = `.${elementClass}`;
      const firstBuilder = new Builder(0, selector, {
        init() {
          calls.push('first');
        },
      }, [], querySelector);
      const secondBuilder = new Builder(1, selector, {
        init() {
          calls.push('second');
        },
      }, [], querySelector);

      firstBuilder.getInitializer()();
      secondBuilder.getInitializer()();
      firstBuilder.getInitializer()();

      expect(calls).toDeepEqual(['first', 'second']);
    });

    it("use builder's query selector for searching elements", () => {
      const customQuerySelector =
        jasmine.createSpy('querySelector').and.callFake(querySelector);
      const selector = '.my-selector';
      const builder = new Builder(1, selector, { }, [], customQuerySelector);

      expect(customQuerySelector).not.toHaveBeenCalled();

      builder.getInitializer()();

      expect(customQuerySelector).toHaveBeenCalledTimes(1);

      const [tree, selectorString] = customQuerySelector.calls.argsFor(0);

      expect(tree).toEqual(document.body);
      expect(selectorString).toEqual(selector);
    });
  });
});
