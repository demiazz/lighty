import create from "lighty";

import {
  readyStateIsMockable,
  dispatchDOMContentLoaded
} from "helpers/ready-state";

if (readyStateIsMockable) {
  describe("Application", () => {
    describe("#vitalize", () => {
      describe("when `document.readyState` is `loading`", () => {
        let originalReadyState;

        beforeEach(() => {
          originalReadyState = document.readyState;
          document.readyState = "loading";
        });

        afterEach(() => {
          document.readyState = originalReadyState;
        });

        it("throws an error", () => {
          const application = create(() => {});

          expect(() => {
            application.vitalize();
          }).toThrowError(Error, "application is not running yet");
        });

        describe("when `DOMContentLoaded` is dispatched", () => {
          it("does not throw an error", done => {
            const application = create(() => {});

            application.onStart(() => {
              expect(() => {
                application.vitalize();
              }).not.toThrow();

              done();
            });

            dispatchDOMContentLoaded();
          });
        });
      });

      ["interactive", "complete"].forEach(state => {
        describe(`when 'document.readyState' equals to '${state}'`, () => {
          let originalReadyState;
          let application;

          beforeEach(done => {
            originalReadyState = document.readyState;
            document.readyState = state;

            application = create(() => {});

            application.onStart(done);
          });

          afterEach(() => {
            document.readyState = originalReadyState;
          });

          it("does not throw an error", () => {
            application.component(".component");

            expect(() => {
              application.vitalize();
            }).not.toThrow();
          });
        });
      });
    });
  });
}
