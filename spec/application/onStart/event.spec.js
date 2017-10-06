import create from "lighty";

import {
  readyStateIsMockable,
  dispatchDOMContentLoaded
} from "helpers/ready-state";
import { createSpy } from "helpers/utils";

if (readyStateIsMockable) {
  describe("Application", () => {
    describe("#onStart", () => {
      describe("when `document.readyState` is `loading`", () => {
        let originalReadyState;

        beforeEach(() => {
          originalReadyState = document.readyState;
          document.readyState = "loading";
        });

        afterEach(() => {
          document.readyState = originalReadyState;
        });

        it("remembers event listener, but not calls it", () => {
          const spy = createSpy("listener");
          const application = create(() => {});

          application.onStart(spy);

          expect(spy).not.toHaveBeenCalled();
        });

        describe("when `DOMContentLoaded` is dispatched", () => {
          it("calls remembered listeners", () => {
            const fooSpy = createSpy("listener");
            const barSpy = createSpy("listener");
            const application = create(() => {});

            application.onStart(fooSpy).onStart(barSpy);

            expect(fooSpy).not.toHaveBeenCalled();
            expect(barSpy).not.toHaveBeenCalled();

            dispatchDOMContentLoaded();

            expect(fooSpy).toHaveBeenCalledTimes(1);
            expect(barSpy).toHaveBeenCalledTimes(1);
          });

          it("calls listener with original context", done => {
            const context = { life: 42 };
            const withoutContext = function withoutContext() {
              expect(this).toBeNull();
            };
            const withContext = function withContext() {
              expect(this).toBe(context);
            };
            const application = create(() => {});

            application
              .onStart(withoutContext)
              .onStart(withContext.bind(context))
              .onStart(done);

            dispatchDOMContentLoaded();
          });

          it("calls listener without arguments", done => {
            const spy = createSpy("listener");
            const application = create(() => {});

            application.onStart(spy).onStart(() => {
              expect(spy).toHaveBeenCalledWith();

              done();
            });

            dispatchDOMContentLoaded();
          });

          it("calls listener only once", done => {
            const spy = createSpy("listener");
            const application = create(() => {});

            application.onStart(spy).onStart(() => {
              expect(spy).toHaveBeenCalledTimes(1);

              dispatchDOMContentLoaded();

              expect(spy).toHaveBeenCalledTimes(1);

              done();
            });

            dispatchDOMContentLoaded();
          });

          it("calls listener immediately after event dispatch", done => {
            const spy = createSpy("listener");
            const application = create(() => {});

            application.onStart(() => {
              application.onStart(spy);

              expect(spy).toHaveBeenCalledTimes(1);

              done();
            });

            dispatchDOMContentLoaded();
          });
        });
      });

      ["interactive", "complete"].forEach(state => {
        describe(`when 'document.readyState' equals to '${state}'`, () => {
          let originalReadyState;

          beforeEach(() => {
            originalReadyState = document.readyState;
            document.readyState = state;
          });

          afterEach(() => {
            document.readyState = originalReadyState;
          });

          it("calls listeners immediately", done => {
            const spy = createSpy("listener");
            const application = create(() => {});

            application.onStart(spy).onStart(() => {
              expect(spy).toHaveBeenCalledTimes(1);

              done();
            });
          });
        });
      });
    });
  });
}
