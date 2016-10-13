/* eslint no-unused-expressions: 0 */

import $ from 'jquery';

import findInTree from '../src/selector';

import { fixture, clear } from './fixtures';
import matchers from './matchers';



describe('findInTree', () => {
  beforeEach(() => {
    window.jasmine.addMatchers(matchers);
  });

  afterEach(clear);

  describe('HTMLElement instance given as a tree', () => {
    it('select all children elements which matched by selector', () => {
      const treeClass = 'tree';
      const nodeClass = 'node';

      fixture(`
        <div class="${treeClass}">
          <div class="${nodeClass}"></div>
        </div>
      `);

      const tree = document.querySelector(`.${treeClass}`);

      const expectedClass = 'is-matched';

      findInTree(tree, `.${nodeClass}`).forEach((node) => {
        node.className = `${node.className} ${expectedClass}`;
      });

      expect(`.${nodeClass}`).toHaveCSSClass(expectedClass);
    });

    it('select tree element if matched by selector', () => {
      const treeClass = 'tree';

      fixture(`<div class="${treeClass}"></div>`);

      const expectedClass = 'is-matched';

      const tree = document.querySelector(`.${treeClass}`);

      findInTree(tree, `.${treeClass}`).forEach((node) => {
        node.className = `${node.className} ${expectedClass}`;
      });

      expect(`.${treeClass}`).toHaveCSSClass(expectedClass);
    });
  });

  describe('NodeList instance given as a tree', () => {
    it('select all children elements which matched by selector', () => {
      const treeClass = 'tree';
      const nodeClass = 'node';

      fixture(`
        <div class="${treeClass}">
          <div class="${nodeClass}"></div>
        </div>
        <div class="${treeClass}">
          <div class="${nodeClass}"></div>
        </div>
        <div class="${treeClass}">
          <div class="${nodeClass}"></div>
        </div>
      `);

      const trees = document.querySelectorAll(`.${treeClass}`);

      const expectedClass = 'is-matched';

      findInTree(trees, `.${nodeClass}`).forEach((node) => {
        node.className = `${node.className} ${expectedClass}`;
      });

      expect(`.${nodeClass}`).toHaveCSSClass(expectedClass);
    });

    it('select each tree element if matched by selector', () => {
      const treeClass = 'tree';

      fixture(`
        <div class="${treeClass}"></div>
        <div class="${treeClass}"></div>
        <div class="${treeClass}"></div>
      `);

      const expectedClass = 'is-matched';

      const trees = document.querySelectorAll(`.${treeClass}`);

      findInTree(trees, `.${treeClass}`).forEach((node) => {
        node.className = `${node.className} ${expectedClass}`;
      });

      expect(`.${treeClass}`).toHaveCSSClass(expectedClass);
    });
  });

  describe('array of HTMLElement instances given as a tree', () => {
    it('select all children elements which matched by selector', () => {
      const treeClass = 'tree';
      const nodeClass = 'node';

      fixture(`
        <div class="${treeClass}">
          <div class="${nodeClass}"></div>
        </div>
        <div class="${treeClass}">
          <div class="${nodeClass}"></div>
        </div>
        <div class="${treeClass}">
          <div class="${nodeClass}"></div>
        </div>
      `);

      const trees = [].slice.call(document.querySelectorAll(`.${treeClass}`));

      const expectedClass = 'is-matched';

      findInTree(trees, `.${nodeClass}`).forEach((node) => {
        node.className = `${node.className} ${expectedClass}`;
      });

      expect(`.${nodeClass}`).toHaveCSSClass(expectedClass);
    });

    it('select each tree element if matched by selector', () => {
      const treeClass = 'tree';

      fixture(`
        <div class="${treeClass}"></div>
        <div class="${treeClass}"></div>
        <div class="${treeClass}"></div>
      `);

      const expectedClass = 'is-matched';

      const trees = [].slice.call(document.querySelectorAll(`.${treeClass}`));

      findInTree(trees, `.${treeClass}`).forEach((node) => {
        node.className = `${node.className} ${expectedClass}`;
      });

      expect(`.${treeClass}`).toHaveCSSClass(expectedClass);
    });
  });

  describe('jQuery object given as a tree', () => {
    it('select all children elements which matched by selector', () => {
      const treeClass = 'tree';
      const nodeClass = 'node';

      fixture(`
        <div class="${treeClass}">
          <div class="${nodeClass}"></div>
        </div>
        <div class="${treeClass}">
          <div class="${nodeClass}"></div>
        </div>
        <div class="${treeClass}">
          <div class="${nodeClass}"></div>
        </div>
      `);

      const trees = $(`.${treeClass}`);

      const expectedClass = 'is-matched';

      findInTree(trees, `.${nodeClass}`).forEach((node) => {
        node.className = `${node.className} ${expectedClass}`;
      });

      expect(`.${nodeClass}`).toHaveCSSClass(expectedClass);
    });

    it('select each tree element if matched by selector', () => {
      const treeClass = 'tree';

      fixture(`
        <div class="${treeClass}"></div>
        <div class="${treeClass}"></div>
        <div class="${treeClass}"></div>
      `);

      const expectedClass = 'is-matched';

      const trees = $(`.${treeClass}`);

      findInTree(trees, `.${treeClass}`).forEach((node) => {
        node.className = `${node.className} ${expectedClass}`;
      });

      expect(`.${treeClass}`).toHaveCSSClass(expectedClass);
    });
  });

  describe('selector given as a tree', () => {
    it('select all children elements which matched by selector', () => {
      const treeClass = 'tree';
      const nodeClass = 'node';

      fixture(`
        <div class="${treeClass}">
          <div class="${nodeClass}"></div>
        </div>
        <div class="${treeClass}">
          <div class="${nodeClass}"></div>
        </div>
        <div class="${treeClass}">
          <div class="${nodeClass}"></div>
        </div>
      `);

      const expectedClass = 'is-matched';

      findInTree(`.${treeClass}`, `.${nodeClass}`).forEach((node) => {
        node.className = `${node.className} ${expectedClass}`;
      });

      expect(`.${nodeClass}`).toHaveCSSClass(expectedClass);
    });

    it('select each tree element if matched by selector', () => {
      const treeClass = 'tree';

      fixture(`
        <div class="${treeClass}"></div>
        <div class="${treeClass}"></div>
        <div class="${treeClass}"></div>
      `);

      const expectedClass = 'is-matched';

      findInTree(`.${treeClass}`, `.${treeClass}`).forEach((node) => {
        node.className = `${node.className} ${expectedClass}`;
      });

      expect(`.${treeClass}`).toHaveCSSClass(expectedClass);
    });
  });
});
