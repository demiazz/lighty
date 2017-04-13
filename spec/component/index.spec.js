import { Component, createSpyAndApplication, elementClass } from "../stub";
import { fixture, clear } from "../fixture";

describe("create", () => {
  describe(".component", () => {
    describe("base behaviour", () => {
      let builderSpy;
      let application;

      beforeEach(done => {
        [builderSpy, application] = createSpyAndApplication(done);
      });

      afterEach(clear);

      it("creates component instances for matched elements", () => {
        fixture(
          `
          <div class="${elementClass}"></div>
          <div>
            <div class="${elementClass}"></div>
          </div>
          <div class="not-${elementClass}"></div>
          <div>
            <div class="not-${elementClass}"></div>
          </div>
          <div class="not-${elementClass}">
            <div class="${elementClass}"></div>
          </div>
          <div class="${elementClass}">
            <div class="not-${elementClass}"></div>
          </div>
        `
        );

        const matched = [].slice.call(
          document.querySelectorAll(`.${elementClass}`)
        );
        const notMatched = [].slice.call(
          document.querySelectorAll(`.not-${elementClass}`)
        );

        application.component(`.${elementClass}`, Component);

        expect(builderSpy).toHaveBeenCalledTimes(matched.length);

        matched.forEach(element => {
          expect(builderSpy).toHaveBeenCalledWith(element, Component);
        });

        notMatched.forEach(element => {
          expect(builderSpy).not.toHaveBeenCalledWith(element, Component);
        });
      });

      it("takes variables arguments list", () => {
        fixture(
          `
          <div class="${elementClass} ${elementClass}-0"></div>
          <div class="${elementClass} ${elementClass}-1"></div>
          <div class="${elementClass} ${elementClass}-2"></div>
          <div class="${elementClass} ${elementClass}-3"></div>
          <div class="${elementClass} ${elementClass}-4"></div>
        `
        );

        application.component(`.${elementClass}-0`);
        application.component(`.${elementClass}-1`, Component);
        application.component(`.${elementClass}-2`, Component, 1);
        application.component(`.${elementClass}-3`, Component, 2, 3);
        application.component(`.${elementClass}-4`, Component, 4, 5, 6);

        expect(builderSpy).toHaveBeenCalledTimes(
          document.querySelectorAll(`.${elementClass}`).length
        );
        expect(builderSpy).toHaveBeenCalledWith(
          document.querySelector(`.${elementClass}-0`)
        );
        expect(builderSpy).toHaveBeenCalledWith(
          document.querySelector(`.${elementClass}-1`),
          Component
        );
        expect(builderSpy).toHaveBeenCalledWith(
          document.querySelector(`.${elementClass}-2`),
          Component,
          1
        );
        expect(builderSpy).toHaveBeenCalledWith(
          document.querySelector(`.${elementClass}-3`),
          Component,
          2,
          3
        );
        expect(builderSpy).toHaveBeenCalledWith(
          document.querySelector(`.${elementClass}-4`),
          Component,
          4,
          5,
          6
        );
      });

      it("register component for future using with `vitalize`", () => {
        fixture(
          `
          <div class="${elementClass}"></div>
        `
        );

        application.component(`.${elementClass}`, Component);

        fixture(
          `
          <div class="${elementClass}"></div>
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
    });
  });
});
