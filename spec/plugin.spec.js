/* eslint no-unused-expressions: 0 */

import Plugin from '../src/plugin';


describe('Plugin', () => {
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
      const transformer = sinon.spy();
      const plugin = new Plugin(name, transformer);

      expect(transformer.callCount).toEqual(0);

      const args = ['.selector', { init() { } }];

      plugin.transform(...args);

      expect(transformer.callCount).toEqual(1);
      expect(transformer.calledWith(...args)).toBe(true);
    });
  });
});
