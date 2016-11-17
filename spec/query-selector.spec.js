/* eslint no-unused-expressions: 0 */

import $ from 'jquery';

import querySelector from '../src/query-selector';

import { fixture, clear, matchers } from './helpers';


describe('querySelector', () => {
  beforeEach(() => {
    window.jasmine.addMatchers(matchers);
  });

  afterEach(clear);

  describe('HTMLElement instance given as a tree', () => {
    it('select all children elements which matched by selector', () => {
      const treeClass = 'tree';
      const elementClass = 'element';

      fixture(`
        <div class="${treeClass}">
          <div class="${elementClass}"></div>
        </div>
      `);

      const tree = document.querySelector(`.${treeClass}`);

      const expectedClass = 'is-matched';

      querySelector(tree, `.${elementClass}`).forEach((element) => {
        element.className = `${element.className} ${expectedClass}`;
      });

      expect(`.${elementClass}`).toHaveCSSClass(expectedClass);
    });

    it('select tree element if matched by selector', () => {
      const treeClass = 'tree';

      fixture(`<div class="${treeClass}"></div>`);

      const expectedClass = 'is-matched';

      const tree = document.querySelector(`.${treeClass}`);

      querySelector(tree, `.${treeClass}`).forEach((element) => {
        element.className = `${element.className} ${expectedClass}`;
      });

      expect(`.${treeClass}`).toHaveCSSClass(expectedClass);
    });
  });

  describe('NodeList instance given as a tree', () => {
    it('select all children elements which matched by selector', () => {
      const treeClass = 'tree';
      const elementClass = 'element';

      fixture(`
        <div class="${treeClass}">
          <div class="${elementClass}"></div>
        </div>
        <div class="${treeClass}">
          <div class="${elementClass}"></div>
        </div>
        <div class="${treeClass}">
          <div class="${elementClass}"></div>
        </div>
      `);

      const trees = document.querySelectorAll(`.${treeClass}`);

      const expectedClass = 'is-matched';

      querySelector(trees, `.${elementClass}`).forEach((element) => {
        element.className = `${element.className} ${expectedClass}`;
      });

      expect(`.${elementClass}`).toHaveCSSClass(expectedClass);
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

      querySelector(trees, `.${treeClass}`).forEach((element) => {
        element.className = `${element.className} ${expectedClass}`;
      });

      expect(`.${treeClass}`).toHaveCSSClass(expectedClass);
    });
  });

  describe('array of HTMLElement instances given as a tree', () => {
    it('select all children elements which matched by selector', () => {
      const treeClass = 'tree';
      const elementClass = 'element';

      fixture(`
        <div class="${treeClass}">
          <div class="${elementClass}"></div>
        </div>
        <div class="${treeClass}">
          <div class="${elementClass}"></div>
        </div>
        <div class="${treeClass}">
          <div class="${elementClass}"></div>
        </div>
      `);

      const trees = [].slice.call(document.querySelectorAll(`.${treeClass}`));

      const expectedClass = 'is-matched';

      querySelector(trees, `.${elementClass}`).forEach((element) => {
        element.className = `${element.className} ${expectedClass}`;
      });

      expect(`.${elementClass}`).toHaveCSSClass(expectedClass);
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

      querySelector(trees, `.${treeClass}`).forEach((element) => {
        element.className = `${element.className} ${expectedClass}`;
      });

      expect(`.${treeClass}`).toHaveCSSClass(expectedClass);
    });
  });

  describe('jQuery object given as a tree', () => {
    it('select all children elements which matched by selector', () => {
      const treeClass = 'tree';
      const elementClass = 'element';

      fixture(`
        <div class="${treeClass}">
          <div class="${elementClass}"></div>
        </div>
        <div class="${treeClass}">
          <div class="${elementClass}"></div>
        </div>
        <div class="${treeClass}">
          <div class="${elementClass}"></div>
        </div>
      `);

      const trees = $(`.${treeClass}`);

      const expectedClass = 'is-matched';

      querySelector(trees, `.${elementClass}`).forEach((element) => {
        element.className = `${element.className} ${expectedClass}`;
      });

      expect(`.${elementClass}`).toHaveCSSClass(expectedClass);
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

      querySelector(trees, `.${treeClass}`).forEach((element) => {
        element.className = `${element.className} ${expectedClass}`;
      });

      expect(`.${treeClass}`).toHaveCSSClass(expectedClass);
    });
  });

  describe('selector given as a tree', () => {
    it('select all children elements which matched by selector', () => {
      const treeClass = 'tree';
      const elementClass = 'element';

      fixture(`
        <div class="${treeClass}">
          <div class="${elementClass}"></div>
        </div>
        <div class="${treeClass}">
          <div class="${elementClass}"></div>
        </div>
        <div class="${treeClass}">
          <div class="${elementClass}"></div>
        </div>
      `);

      const expectedClass = 'is-matched';

      querySelector(`.${treeClass}`, `.${elementClass}`).forEach((element) => {
        element.className = `${element.className} ${expectedClass}`;
      });

      expect(`.${elementClass}`).toHaveCSSClass(expectedClass);
    });

    it('select each tree element if matched by selector', () => {
      const treeClass = 'tree';

      fixture(`
        <div class="${treeClass}"></div>
        <div class="${treeClass}"></div>
        <div class="${treeClass}"></div>
      `);

      const expectedClass = 'is-matched';

      querySelector(`.${treeClass}`, `.${treeClass}`).forEach((element) => {
        element.className = `${element.className} ${expectedClass}`;
      });

      expect(`.${treeClass}`).toHaveCSSClass(expectedClass);
    });
  });
});
