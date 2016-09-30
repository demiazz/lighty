/* eslint no-unused-expressions: 0 */

import $ from 'jquery';

import { fixture, clear } from './fixtures';

import findInTree from '../src/selector';


describe('findInTree', () => {
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
      const nodes = findInTree(tree, `.${nodeClass}`);

      const expectedClass = 'is-matched';

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];

        node.className = `${node.className} ${expectedClass}`;
      }

      const actualNodes = document.querySelectorAll(`.${nodeClass}`);

      for (let i = 0; i < actualNodes.length; i += 1) {
        const node = actualNodes.item(i);

        expect(node.className.split(' ')).toContain(expectedClass);
      }
    });

    it('select tree element if matched by selector', () => {
      const treeClass = 'tree';

      fixture(`<div class="${treeClass}"></div>`);

      const expectedClass = 'is-matched';

      const tree = document.querySelector(`.${treeClass}`);
      const nodes = findInTree(tree, `.${treeClass}`);

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];

        node.className = `${node.className} ${expectedClass}`;
      }

      const actualNodes = document.querySelectorAll(`.${treeClass}`);

      for (let i = 0; i < actualNodes.length; i += 1) {
        const node = actualNodes.item(i);

        expect(node.className.split(' ')).toContain(expectedClass);
      }
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
      const nodes = findInTree(trees, `.${nodeClass}`);

      const expectedClass = 'is-matched';

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];

        node.className = `${node.className} ${expectedClass}`;
      }

      const actualNodes = document.querySelectorAll(`.${nodeClass}`);

      for (let i = 0; i < actualNodes.length; i += 1) {
        const node = actualNodes.item(i);

        expect(node.className.split(' ')).toContain(expectedClass);
      }
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
      const nodes = findInTree(trees, `.${treeClass}`);

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];

        node.className = `${node.className} ${expectedClass}`;
      }

      const actualNodes = document.querySelectorAll(`.${treeClass}`);

      for (let i = 0; i < actualNodes.length; i += 1) {
        const node = actualNodes.item(i);

        expect(node.className.split(' ')).toContain(expectedClass);
      }
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
      const nodes = findInTree(trees, `.${nodeClass}`);

      const expectedClass = 'is-matched';

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];

        node.className = `${node.className} ${expectedClass}`;
      }

      const actualNodes = document.querySelectorAll(`.${nodeClass}`);

      for (let i = 0; i < actualNodes.length; i += 1) {
        const node = actualNodes.item(i);

        expect(node.className.split(' ')).toContain(expectedClass);
      }
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
      const nodes = findInTree(trees, `.${treeClass}`);

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];

        node.className = `${node.className} ${expectedClass}`;
      }

      const actualNodes = document.querySelectorAll(`.${treeClass}`);

      for (let i = 0; i < actualNodes.length; i += 1) {
        const node = actualNodes.item(i);

        expect(node.className.split(' ')).toContain(expectedClass);
      }
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
      const nodes = findInTree(trees, `.${nodeClass}`);

      const expectedClass = 'is-matched';

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];

        node.className = `${node.className} ${expectedClass}`;
      }

      const actualNodes = document.querySelectorAll(`.${nodeClass}`);

      for (let i = 0; i < actualNodes.length; i += 1) {
        const node = actualNodes.item(i);

        expect(node.className.split(' ')).toContain(expectedClass);
      }
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
      const nodes = findInTree(trees, `.${treeClass}`);

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];

        node.className = `${node.className} ${expectedClass}`;
      }

      const actualNodes = document.querySelectorAll(`.${treeClass}`);

      for (let i = 0; i < actualNodes.length; i += 1) {
        const node = actualNodes.item(i);

        expect(node.className.split(' ')).toContain(expectedClass);
      }
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

      const nodes = findInTree(`.${treeClass}`, `.${nodeClass}`);

      const expectedClass = 'is-matched';

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];

        node.className = `${node.className} ${expectedClass}`;
      }

      const actualNodes = document.querySelectorAll(`.${nodeClass}`);

      for (let i = 0; i < actualNodes.length; i += 1) {
        const node = actualNodes.item(i);

        expect(node.className.split(' ')).toContain(expectedClass);
      }
    });

    it('select each tree element if matched by selector', () => {
      const treeClass = 'tree';

      fixture(`
        <div class="${treeClass}"></div>
        <div class="${treeClass}"></div>
        <div class="${treeClass}"></div>
      `);

      const expectedClass = 'is-matched';

      const nodes = findInTree(`.${treeClass}`, `.${treeClass}`);

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];

        node.className = `${node.className} ${expectedClass}`;
      }

      const actualNodes = document.querySelectorAll(`.${treeClass}`);

      for (let i = 0; i < actualNodes.length; i += 1) {
        const node = actualNodes.item(i);

        expect(node.className.split(' ')).toContain(expectedClass);
      }
    });
  });
});
