/* eslint no-unused-expressions: 0 */

import application, { create, plugin } from '../src';
import Application from '../src/application';
import Plugin from '../src/plugin';

import { matchers } from './helpers';


describe('application', () => {
  beforeEach(() => {
    window.jasmine.addMatchers(matchers);
  });

  it('is instance of Application', () => {
    expect(application).toBeInstanceOf(Application);
  });

  it('has name equals to `default`', () => {
    expect(application.name).toBe('default');
  });

  it('has empty plugins list', () => {
    expect(application.plugins).toBeEmptyArray();
  });

  it('has empty builders list', () => {
    expect(application.builders).toBeEmptyArray();
  });

  it('has isReady flag which equals to false', () => {
    expect(application.isReady).toBeFalse();
  });

  it('has isRunning flag which equals to false', () => {
    expect(application.isRunning).toBeFalse();
  });
});

describe('create', () => {
  beforeEach(() => {
    window.jasmine.addMatchers(matchers);
  });

  it('returns `application` by default', () => {
    const created = create();

    expect(application).toBe(created);
  });

  it('returns new application with given name', () => {
    const name = 'new-application';
    const created = create(name);

    expect(created.name).toBe(name);
    expect(created.plugins).toBeEmptyArray();
    expect(created.builders).toBeEmptyArray();
    expect(created.isReady).toBeFalse();
    expect(created.isRunning).toBeFalse();
  });

  it('returns instance with given name if exists', () => {
    const name = 'existing-application';
    const created = create(name);
    const cached = create(name);

    expect(cached).toBe(created);
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
