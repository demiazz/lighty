/* eslint no-unused-expressions: 0 */

import isDeepEqual from 'deep-equal';

import { application, plugin } from '../src';
import Application from '../src/application';
import Plugin from '../src/plugin';


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

describe('application', () => {
  it('is instance of Application', () => {
    expect(application instanceof Application).toBe(true);
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
