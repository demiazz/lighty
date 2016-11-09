/* eslint no-unused-expressions: 0 */

import { create, plugin } from '../src';
import Plugin from '../src/plugin';
import querySelector from '../src/query-selector';

import { matchers } from './helpers';


describe('create', () => {
  beforeEach(() => {
    window.jasmine.addMatchers(matchers);
  });

  it('returns new application', () => {
    const application = create();

    expect(application.plugins).toBeEmptyArray();
    expect(application.builders).toBeEmptyArray();
    expect(application.isRunning).toBeFalse();
    expect(application.querySelector).toEqual(querySelector);
  });

  it('returns new application with custom query selector', () => {
    const customQuerySelector = () => { };
    const options = {
      querySelector: customQuerySelector,
    };
    const application = create(options);

    expect(application.querySelector).toEqual(customQuerySelector);
  });

  it('returns new application with custom plugins list', () => {
    const transformer = () => { };
    const initializer = () => transformer;
    const factory = plugin('my-plugin', initializer);
    const pluginInstance = factory();
    const options = { plugins: [pluginInstance] };
    const application = create(options);

    expect(application.plugins.length).toEqual(1);
    expect(application.plugins[0]).toEqual(pluginInstance);
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
    const factory = plugin(name, initializer);
    const instance = factory();

    expect(instance).toBeInstanceOf(Plugin);
    expect(instance.name).toEqual(name);
    expect(initializer).toHaveBeenCalledTimes(1);

    instance.transform();

    expect(transform).toHaveBeenCalledTimes(1);
  });

  it('call plugin initializer with given arguments', () => {
    const initializer = jasmine.createSpy('initializer').and.callFake(() => { });
    const name = 'my-plugin';
    const factory = plugin(name, initializer);

    const args = [1, {}, []];
    factory(...args);

    expect(initializer).toHaveBeenCalledTimes(1);
    expect(initializer).toHaveBeenCalledWith(...args);
  });
});
