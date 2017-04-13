import { Component, createSpyAndApplication, elementClass } from "../stub";
import { fixture, clear } from "../fixture";

describe("create", () => {
  describe(".vitalize", () => {
    describe("when given nothing", () => {
      let builderSpy;
      let application;

      beforeEach(done => {
        [builderSpy, application] = createSpyAndApplication(() => {
          application.component(`.${elementClass}`, Component);

          done();
        });
      });

      afterEach(clear);

      it("doesn't creates components if no matched elements", () => {
        fixture(
          `
          <div class="not-${elementClass}"></div>
          <svg class="not-${elementClass}"></svg>
        `
        );

        application.vitalize();

        expect(builderSpy).not.toHaveBeenCalled();
      });

      it("creates component instances for all matched elements inside document", () => {
        fixture(
          `
          <div class="${elementClass}"></div>
          <svg class="${elementClass}"></svg>
        `
        );

        application.vitalize();

        const elements = [].slice.call(
          document.querySelectorAll(`.${elementClass}`)
        );

        expect(builderSpy).toHaveBeenCalledTimes(elements.length);

        elements.forEach(element => {
          expect(builderSpy).toHaveBeenCalledWith(element, Component);
        });
      });

      it("creates component instances for root elements if matched by selector", () => {
        const element = document.body;

        element.setAttribute("class", elementClass);

        application.vitalize();

        expect(builderSpy).toHaveBeenCalledTimes(1);
        expect(builderSpy).toHaveBeenCalledWith(element, Component);

        element.setAttribute("class", "");
      });
    });
  });
});
