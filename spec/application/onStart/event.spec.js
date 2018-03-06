/* eslint class-methods-use-this: "off" */

import create from "lighty";

import { clearFixtures, useFixture } from "helpers/fixtures";
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

          clearFixtures();
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
              expect([null, window]).toContain(this);
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

          it("calls all listeners after vitalize", done => {
            const application = create((element, Component) => {
              const instance = new Component(element);

              application.onStart(instance.applicationDidStart.bind(instance));
            });

            const fooConstructorSpy = createSpy("foo's constructor");
            const fooStartSpy = createSpy("foo's start listener");

            application.component(
              ".foo",
              class Foo {
                constructor() {
                  fooConstructorSpy();
                }

                applicationDidStart() {
                  fooStartSpy();
                }
              }
            );

            const barConstructorSpy = createSpy("bar's constructor");
            const barStartSpy = createSpy("bar's start listener");

            application.component(
              ".bar",
              class Foo {
                constructor() {
                  barConstructorSpy();
                }

                applicationDidStart() {
                  barStartSpy();
                }
              }
            );

            useFixture(`
              <div class="foo"></div>
              <div class="bar"></div>
            `);

            expect(fooConstructorSpy).not.toHaveBeenCalled();
            expect(fooStartSpy).not.toHaveBeenCalled();
            expect(barConstructorSpy).not.toHaveBeenCalled();
            expect(barStartSpy).not.toHaveBeenCalled();

            dispatchDOMContentLoaded();

            application.onStart(() => {
              expect(fooConstructorSpy).toHaveBeenCalledTimes(1);
              expect(fooStartSpy).toHaveBeenCalledTimes(1);
              expect(barConstructorSpy).toHaveBeenCalledTimes(1);
              expect(barStartSpy).toHaveBeenCalledTimes(1);

              expect(fooConstructorSpy).toHaveBeenCalledBefore(fooStartSpy);
              expect(fooConstructorSpy).toHaveBeenCalledBefore(barStartSpy);

              expect(barConstructorSpy).toHaveBeenCalledBefore(fooStartSpy);
              expect(barConstructorSpy).toHaveBeenCalledBefore(barStartSpy);

              done();
            });
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
