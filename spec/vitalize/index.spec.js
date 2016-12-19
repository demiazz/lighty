import { Component, createSpyAndApplication, rootClass, elementClass } from '../stub';
import { fixture, clear } from '../fixture';


describe('create', () => {
  describe('.vitalize', () => {
    let builderSpy;
    let application;

    beforeEach((done) => {
      [builderSpy, application] = createSpyAndApplication(() => {
        application.component(`.${elementClass}`, Component);

        done();
      });
    });

    afterEach(clear);

    describe('base behaviour', () => {
      it('creates instances of all registered components', () => {
        const fooClass = 'foo';
        const barClass = 'bar';

        class Foo { }
        class Bar { }

        fixture(`
          <div class="${rootClass}">
            <div class="${fooClass}"></div>
            <div class="${barClass}"></div>
            <div class="${fooClass} ${barClass}"></div>
          </div>
        `);

        application.component(`.${fooClass}`, Foo);
        application.component(`.${barClass}`, Bar);

        const fooElements = [].slice.call(
          document.querySelectorAll(`.${fooClass}`)
        );
        const barElements = [].slice.call(
          document.querySelectorAll(`.${barClass}`)
        );

        expect(builderSpy).toHaveBeenCalledTimes(
          fooElements.length + barElements.length
        );
        fooElements.forEach((element) => {
          expect(builderSpy).toHaveBeenCalledWith(element, Foo);
        });
        barElements.forEach((element) => {
          expect(builderSpy).toHaveBeenCalledWith(element, Bar);
        });
      });

      it('correct processes recursive roots', () => {
        fixture(`
          <div class="${rootClass}">
            <div class="${rootClass} ${elementClass}">
              <div class="${elementClass}"></div>
            </div>
          </div>
        `);

        application.vitalize(`.${rootClass}`);

        const elements = [].slice.call(
          document.querySelectorAll(`.${elementClass}`)
        );

        expect(builderSpy).toHaveBeenCalledTimes(elements.length);

        elements.forEach((element) => {
          expect(builderSpy).toHaveBeenCalledWith(element, Component);
        });
      });

      it('raise exception if given argument of unsupported type', () => {
        [1, () => {}, {}].forEach((root) => {
          expect(() => {
            application.vitalize(root);
          }).toThrowError(TypeError);
        });
      });
    });
  });
});
