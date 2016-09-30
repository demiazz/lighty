/* eslint no-unused-expressions: 0 */

import isDeepEqual from 'deep-equal';

import application, { create, plugin } from '../src';
import Application from '../src/application';
import Plugin from '../src/plugin';


describe('application', () => {
  it('is instance of Application', () => {
    expect(application instanceof Application).toBe(true);
  });

  it('has name equals to `default`', () => {
    expect(application.name).toBe('default');
  });

  it('has empty plugins list', () => {
    expect(isDeepEqual(application.plugins, [])).toBe(true);
  });

  it('has empty builders list', () => {
    expect(isDeepEqual(application.builders, [])).toBe(true);
  });

  it('has isReady flag which equals to false', () => {
    expect(application.isReady).toBe(false);
  });

  it('has isRunning flag which equals to false', () => {
    expect(application.isRunning).toBe(false);
  });
});

describe('create', () => {
  it('returns `application` by default', () => {
    const created = create();

    expect(application).toBe(created);
  });

  it('returns new application with given name', () => {
    const name = 'new-application';
    const created = create(name);

    expect(created.name).toBe(name);
    expect(isDeepEqual(created.plugins, [])).toBe(true);
    expect(isDeepEqual(created.builders, [])).toBe(true);
    expect(created.isReady).toBe(false);
    expect(created.isRunning).toBe(false);
  });

  it('returns instance with given name if exists', () => {
    const name = 'existing-application';
    const created = create(name);
    const cached = create(name);

    expect(cached).toBe(created);
  });
});

describe('plugin', () => {
  it('returns plugin factory', () => {
    const name = 'my-plugin';
    const transform = sinon.spy();
    const initializer = sinon.spy(() => transform);
    const factory = plugin(name, initializer);
    const instance = factory();

    expect(instance instanceof Plugin).toBe(true);
    expect(instance.name).toEqual(name);
    expect(initializer.callCount).toEqual(1);

    instance.transform();

    expect(transform.callCount).toEqual(1);
  });

  it('call plugin initializer with given arguments', () => {
    const initializer = sinon.spy(() => () => { });
    const name = 'my-plugin';
    const factory = plugin(name, initializer);

    const args = [1, {}, []];
    factory(...args);

    expect(initializer.callCount).toEqual(1);
    expect(initializer.calledWith(...args)).toBe(true);
  });
});
