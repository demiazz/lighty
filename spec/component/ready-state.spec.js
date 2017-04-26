import {
  elementClass,
  rootClass,
  createSpyAndApplication,
  Component
} from "../stub";

if (readyStateIsMockable) {
  describe("create", () => {
    afterEach(clearFixtures);

    describe(".component", () => {
      describe("when `document.readyState` equals to `loading`", () => {
        let backup;
        let builderSpy;
        let application;

        beforeEach(() => {
          backup = document.readyState;
          document.readyState = "loading";

          [builderSpy, application] = createSpyAndApplication();
        });

        afterEach(() => {
          document.readyState = backup;
        });

        it("doesn't created component instances", () => {
          useFixture(
            `
            <div class="${elementClass}"></div>
          `
          );

          application.component(`.${elementClass}`, Component);

          expect(builderSpy).not.toHaveBeenCalled();
        });

        describe("when `DOMContentLoaded` raised", () => {
          it("creates component instances for early registered components", () => {
            const fooClass = "foo";
            const barClass = "bar";

            class Foo {}
            class Bar {}

            useFixture(
              `
              <div class="${rootClass}">
                <div class="${fooClass}"></div>
                <div class="${barClass}"></div>
                <div class="${fooClass} ${barClass}"></div>
              </div>
            `
            );

            application.component(`.${fooClass}`, Foo);
            application.component(`.${barClass}`, Bar);

            expect(builderSpy).not.toHaveBeenCalled();

            const event = document.createEvent("Event");
            event.initEvent("DOMContentLoaded", true, true);
            window.document.dispatchEvent(event);

            const fooElements = [].slice.call(
              document.querySelectorAll(`.${fooClass}`)
            );
            const barElements = [].slice.call(
              document.querySelectorAll(`.${barClass}`)
            );

            expect(builderSpy).toHaveBeenCalledTimes(
              fooElements.length + barElements.length
            );
            fooElements.forEach(element => {
              expect(builderSpy).toHaveBeenCalledWith(element, Foo);
            });
            barElements.forEach(element => {
              expect(builderSpy).toHaveBeenCalledWith(element, Bar);
            });
          });
        });
      });

      ["interactive", "complete"].forEach(state => {
        describe(`when \`document.readyState\` equals to \`${state}\``, () => {
          let backup;
          let builderSpy;
          let application;

          beforeEach(done => {
            backup = document.readyState;
            document.readyState = state;

            [builderSpy, application] = createSpyAndApplication(done);
          });

          afterEach(() => {
            document.readyState = backup;
          });

          it("creates component instances immediately", () => {
            useFixture(
              `
              <div class="${elementClass}"></div>
            `
            );

            const matched = [].slice.call(
              document.querySelectorAll(`.${elementClass}`)
            );

            application.component(`.${elementClass}`, Component);

            expect(builderSpy).toHaveBeenCalledTimes(matched.length);

            matched.forEach(element => {
              expect(builderSpy).toHaveBeenCalledWith(element, Component);
            });
          });
        });
      });
    });
  });
}
