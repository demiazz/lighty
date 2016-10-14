/* eslint no-unused-expressions: 0 */

import Plugin from '../src/plugin';

import { matchers } from './helpers';


describe('Plugin', () => {
  beforeEach(() => {
    window.jasmine.addMatchers(matchers);
  });

  describe('.constructor', () => {
    it('gives name and transformer function', () => {
      const name = 'my-plugin';
      const transformer = () => { };
      const plugin = new Plugin(name, transformer);

      expect(plugin.name).toEqual(name);
      expect(plugin.transformer).toEqual(transformer);
    });
  });

  describe('.transform', () => {
    it('calles transformer function with given arguments', () => {
      const name = 'my-plugin';
      const transformer = jasmine.createSpy('transformer');
      const plugin = new Plugin(name, transformer);

      expect(transformer).not.toHaveBeenCalled();

      const args = ['.selector', { init() { } }];

      plugin.transform(...args);

      expect(transformer).toHaveBeenCalledTimes(1);
      expect(transformer).toHaveBeenCalledWith(...args);
    });
  });
});
