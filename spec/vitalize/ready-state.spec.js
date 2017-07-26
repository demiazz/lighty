import { createSpyAndApplication } from "../stub";

if (readyStateIsMockable) {
  describe("create", () => {
    describe(".vitalize", () => {
      describe("when `document.readyState` equals to `loading`", () => {
        let backup;
        let application;

        beforeEach(() => {
          backup = document.readyState;
          document.readyState = "loading";

          [, application] = createSpyAndApplication();
        });

        afterEach(() => {
          document.readyState = backup;
        });

        it("raises error", () => {
          expect(() => {
            application.vitalize();
          }).toThrowError(Error);
        });

        describe("when `DOMContentLoaded` raised", () => {
          it("creates component instances for early registered components", () => {
            expect(() => {
              application.vitalize();
            }).toThrowError(Error);

            const event = document.createEvent("Event");
            event.initEvent("DOMContentLoaded", true, true);
            window.document.dispatchEvent(event);

            expect(() => {
              application.vitalize();
            }).not.toThrowError(Error);
          });
        });
      });

      ["interactive", "complete"].forEach(state => {
        describe(`when \`document.readyState\` equals to \`${state}\``, () => {
          let backup;
          let application;

          beforeEach(done => {
            backup = document.readyState;
            document.readyState = state;

            [, application] = createSpyAndApplication(done);
          });

          afterEach(() => {
            document.readyState = backup;
          });

          it("doesn't throw error", () => {
            expect(() => {
              application.vitalize();
            }).not.toThrowError(Error);
          });
        });
      });
    });
  });
}
