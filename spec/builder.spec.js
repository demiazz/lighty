/* eslint no-unused-expressions: 0 */

import { plugin } from '../src';
import Builder from '../src/builder';

import { fixture, clear, matchers } from './helpers';


describe('Builder', () => {
  beforeEach(() => {
    window.jasmine.addMatchers(matchers);
  });

  afterEach(clear);

  describe('.constructor', () => {
    it('gives id, selector, proto and plugins list', () => {
      const id = 0;
      const selector = '.component';
      const proto = { init() { } };
      const plugins = [
        plugin('my-plugin', () => () => { })(),
      ];

      const builder = new Builder(id, selector, proto, plugins);

      expect(builder.id).toEqual(id);
      expect(builder.selector).toEqual(selector);
      expect(builder.proto).toDeepEqual(proto);
      expect(builder.plugins).toDeepEqual(plugins);
    });
  });

  describe('.getInitializer', () => {
    it('returns initializer which call init for each component', () => {
      const nodeClass = 'build';

      fixture(`
        <div class="${nodeClass}"></div>
        <div class="${nodeClass}"></div>
      `);

      const selector = `.${nodeClass}`;
      const spy = sinon.spy();
      const proto = {
        init() {
          spy();
        },
      };

      const builder = new Builder(0, selector, proto, []);

      expect(spy.callCount).toEqual(0);

      const initialize = builder.getInitializer();

      expect(spy.callCount).toEqual(0);

      initialize();

      expect(spy.callCount).toEqual(2);
    });

    it("returns initializer which doesn't call `init` if it doesn't exists", () => {
      const nodeClass = 'build';

      fixture(`<div class="${nodeClass}"></div>`);

      const selector = `.${nodeClass}`;
      const proto = { };
      const builder = new Builder(0, selector, proto, []);
      const initialize = builder.getInitializer();

      expect(initialize).not.toThrow();
    });

    it('transforms component with plugins before creating initializer', () => {
      const nodeClass = 'build';

      fixture(`<div class="${nodeClass}"></div>`);

      const expectedPluginClass = 'from-plugin';
      const expectedComponentClass = 'from-component';
      const selector = `.${nodeClass}`;
      const proto = {
        init() {
          this.node.className =
            `${this.node.className} ${expectedComponentClass}`;
        },
      };
      const plugins = [
        plugin('node-binding', () => (component, node) => {
          node.className = `${node.className} ${expectedPluginClass}`;

          component.node = node;
        })(),
      ];

      expect(selector).not.toHaveCSSClass(expectedPluginClass);
      expect(selector).not.toHaveCSSClass(expectedComponentClass);

      const builder = new Builder(0, selector, proto, plugins);

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
      const nodeClass = 'build';

      fixture(`
        <div id="outside" class="${nodeClass}"></div>
        <div class="${treeClass}">
          <div id="inside" class="${nodeClass}"></div>
        </div>
      `);

      const expectedClass = 'is-ready';
      const selector = `.${nodeClass}`;
      const proto = {
        init() {
          this.node.className = `${this.node.className} ${expectedClass}`;
        },
      };
      const plugins = [
        plugin('node-binding', () => (component, node) => {
          component.node = node;
        })(),
      ];
      const builder = new Builder(0, selector, proto, plugins);
      const initialize = builder.getInitializer(`.${treeClass}`);

      initialize();

      expect('#inside').toHaveCSSClass(expectedClass);
      expect('#outside').not.toHaveCSSClass(expectedClass);
    });

    it('can use subtree including root for searching elements', () => {
      const nodeClass = 'node';

      fixture(`
        <div id="parent" class="${nodeClass}">
          <div id="children" class="${nodeClass}"></div>
        </div>
      `);

      const expectedClass = 'is-ready';
      const selector = `.${nodeClass}`;
      const proto = {
        init() {
          this.node.className = `${this.node.className} ${expectedClass}`;
        },
      };
      const plugins = [
        plugin('node-binding', () => (component, node) => {
          component.node = node;
        })(),
      ];
      const builder = new Builder(0, selector, proto, plugins);
      const initialize = builder.getInitializer();

      initialize();

      expect('#parent').toHaveCSSClass(expectedClass);
      expect('#children').toHaveCSSClass(expectedClass);
    });

    it('builds component only once for each node', () => {
      const nodeClass = 'build';

      fixture(`<div class="${nodeClass}"></div>`);

      const calls = [];
      const selector = `.${nodeClass}`;
      const firstBuilder = new Builder(0, selector, {
        init() {
          calls.push('first');
        },
      }, []);
      const secondBuilder = new Builder(1, selector, {
        init() {
          calls.push('second');
        },
      }, []);

      firstBuilder.getInitializer()();
      secondBuilder.getInitializer()();
      firstBuilder.getInitializer()();

      expect(calls).toDeepEqual(['first', 'second']);
    });
  });
});
