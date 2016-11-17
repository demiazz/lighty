/* eslint no-unused-expressions: 0 */

import { querySelector, createApplication, createPlugin } from '../src';
import Application from '../src/application';
import Plugin from '../src/plugin';
import internalQuerySelector from '../src/query-selector';

import { matchers } from './helpers';


describe('querySelector', () => {
  it('export internal implementration of `querySelector` function', () => {
    expect(querySelector).toEqual(internalQuerySelector);
  });
});

describe('create', () => {
  beforeEach(() => {
    window.jasmine.addMatchers(matchers);
  });

  it('returns new application', () => {
    const application = createApplication();

    expect(application).toBeInstanceOf(Application);
  });

  it('returns new application with custom query selector', () => {
    const customQuerySelector = () => { };
    const options = {
      querySelector: customQuerySelector,
    };
    const application = createApplication(options);

    expect(application.querySelector).toEqual(customQuerySelector);
  });

  it('returns new application with custom plugins list', () => {
    const transformer = () => { };
    const initializer = () => transformer;
    const factory = createPlugin('my-plugin', initializer);
    const plugin = factory();
    const options = { plugins: [plugin] };
    const application = createApplication(options);

    expect(application.plugins.length).toEqual(1);
    expect(application.plugins[0]).toEqual(plugin);
  });
});

describe('plugin', () => {
  beforeEach(() => {
    window.jasmine.addMatchers(matchers);
  });

  it('returns plugin factory', () => {
    const name = 'my-plugin';
    const transform = jasmine.createSpy('transform');
    const initializer = (
      jasmine.createSpy('initializer').and.callFake(() => transform)
    );
    const factory = createPlugin(name, initializer);
    const plugin = factory();

    expect(plugin).toBeInstanceOf(Plugin);
    expect(plugin.name).toEqual(name);
    expect(initializer).toHaveBeenCalledTimes(1);

    plugin.transform();

    expect(transform).toHaveBeenCalledTimes(1);
  });

  it('call plugin initializer with given arguments', () => {
    const initializer = jasmine.createSpy('initializer').and.callFake(() => { });
    const name = 'my-plugin';
    const plugin = createPlugin(name, initializer);

    const args = [1, {}, []];
    plugin(...args);

    expect(initializer).toHaveBeenCalledTimes(1);
    expect(initializer).toHaveBeenCalledWith(...args);
  });
});
