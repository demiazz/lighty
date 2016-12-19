import { Component, createSpyAndApplication, rootClass, elementClass } from '../stub';
import { fixture, clear } from '../fixture';


describe('create', () => {
  describe('.vitalize', () => {
    describe('when given nothing', () => {
      let builderSpy;
      let application;

      beforeEach((done) => {
        [builderSpy, application] = createSpyAndApplication(() => {
          application.component(`.${elementClass}`, Component);

          done();
        });
      });

      afterEach(clear);

      it("doesn't creates components if no matched elements", () => {
        fixture(`
          <div class="${rootClass}">
            <div class="not-${elementClass}"></div>
          </div>
          <svg class="${rootClass}">
            <g class="not-${elementClass}"></div>
          </svg>
        `);

        const roots = [].slice.call(document.querySelectorAll(`.${rootClass}`));

        application.vitalize(roots);

        expect(builderSpy).not.toHaveBeenCalled();
      });

      it("doesn't creates components if given array is empty", () => {
        const roots = [].slice.call(document.createElement('div').childNodes);

        application.vitalize(roots);

        expect(builderSpy).not.toHaveBeenCalled();
      });

      it('creates component instances for all matched elements inside tree', () => {
        fixture(`
          <div class="${rootClass}">
            <div class="${elementClass}"></div>
          </div>
          <svg class="${rootClass}">
            <g class="${elementClass}"></div>
          </svg>
          <div class="${elementClass}"></div>
          <svg class="${elementClass}"></svg>
        `);

        const roots = [].slice.call(document.querySelectorAll(`.${rootClass}`));

        application.vitalize(roots);

        const elements = [].slice.call(
          document.querySelectorAll(`.${rootClass} .${elementClass}`)
        );

        expect(builderSpy).toHaveBeenCalledTimes(elements.length);

        elements.forEach((element) => {
          expect(builderSpy).toHaveBeenCalledWith(element, Component);
        });
      });

      it('creates component instances for root elements if matched by selector', () => {
        fixture(`
          <div class="${rootClass} ${elementClass}"></div>
          <svg class="${rootClass} ${elementClass}"></svg>
        `);

        const roots = [].slice.call(document.querySelectorAll(`.${rootClass}`));

        application.vitalize(roots);

        const elements = [].slice.call(
          document.querySelectorAll(`.${rootClass}`)
        );

        expect(builderSpy).toHaveBeenCalledTimes(elements.length);

        elements.forEach((element) => {
          expect(builderSpy).toHaveBeenCalledWith(element, Component);
        });
      });

      it('creates component instances only for Element items', () => {
        fixture(`
          <div class="${rootClass}">
            text node
            <div>
              <div class="${elementClass}"></div>
            </div>
            <!-- comment node -->
          </div>
        `);

        const roots = [].slice.call(
          document.querySelector(`.${rootClass}`).childNodes
        ).concat([1, 'string', [], {}]);

        application.vitalize(roots);

        const elements = [].slice.call(
          document.querySelectorAll(`.${elementClass}`)
        );

        expect(builderSpy).toHaveBeenCalledTimes(elements.length);

        elements.forEach((element) => {
          expect(builderSpy).toHaveBeenCalledWith(element, Component);
        });
      });
    });
  });
});
