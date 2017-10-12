import create from "lighty";

import {
  dispatchDOMContentLoaded,
  readyStateIsMockable
} from "helpers/ready-state";
import { createSpy, createConsoleSpy, resetConsoleSpy } from "helpers/utils";

describe("Application", () => {
  describe("#on", () => {
    describe("when error happened when calls `start` listener", () => {
      beforeEach(createConsoleSpy);

      afterEach(resetConsoleSpy);

      it("calls remembered listeners", done => {
        const fooSpy = createSpy("listener");
        const barSpy = createSpy("listener");

        create(() => {})
          .onStart(() => {
            throw new Error("WHAAGH!");
          })
          .onError(fooSpy)
          .onError(barSpy)
          .onError(() => {
            expect(fooSpy).toHaveBeenCalledTimes(1);
            expect(barSpy).toHaveBeenCalledTimes(1);

            done();
          });
      });

      it("calls listeners with original context", done => {
        const context = { life: 42 };
        const withoutContext = function withoutContext() {
          expect([null, window]).toContain(this);
        };
        const withContext = function withContext() {
          expect(this).toBe(context);
        };

        create(() => {})
          .onStart(() => {
            throw new Error("WHAAGH!");
          })
          .onError(withoutContext)
          .onError(withContext.bind(context))
          .onError(done);
      });

      it("calls listener with error as argument", done => {
        const errors = [
          "WHAAGH!",
          ["WHAAGH!"],
          Error("WHAAGH!"),
          new Error("WHAAGH!")
        ];

        create(() => {})
          .onStart(() => {
            throw errors[0];
          })
          .onStart(() => {
            throw errors[1];
          })
          .onStart(() => {
            throw errors[2];
          })
          .onStart(() => {
            throw errors[3];
          })
          .onError(error => {
            expect(error).toBe(errors.shift());

            if (errors.length === 0) {
              done();
            }
          });
      });

      it("outputs error to console if no listeners registered", done => {
        const errors = [
          "WHAAGH!",
          ["WHAAGH!"],
          Error("WHAAGH!"),
          new Error("WHAAGH!")
        ];

        create(() => {})
          .onStart(() => {
            throw errors[0];
          })
          .onStart(() => {
            throw errors[1];
          })
          .onStart(() => {
            throw errors[2];
          })
          .onStart(() => {
            throw errors[3];
          });

        setTimeout(() => {
          expect(console.error).toHaveBeenCalledTimes(errors.length);

          for (let i = 0; i < errors.length; i += 1) {
            expect(console.error).toHaveBeenCalledWith(errors[i]);
          }

          done();
        }, 10);
      });

      it("ignores error in listener and outputs it to console", done => {
        const listenerError = new Error("WHAAGH!");
        const fooSpy = createSpy("listener").and.callFake(() => {
          throw listenerError;
        });
        const barSpy = createSpy("listener");

        const application = create(() => {});

        application.onError(fooSpy).onError(barSpy);

        expect(fooSpy).not.toHaveBeenCalled();
        expect(barSpy).not.toHaveBeenCalled();

        application.onStart(() => {
          application.onStart(() => {
            throw new Error("WHAAGH!");
          });

          expect(fooSpy).toHaveBeenCalledTimes(1);
          expect(barSpy).toHaveBeenCalledTimes(1);
          expect(console.error).toHaveBeenCalledTimes(1);
          expect(console.error).toHaveBeenCalledWith(listenerError);

          done();
        });
      });

      if (readyStateIsMockable) {
        describe("when `document.readyState` is `loading`", () => {
          let originalReadyState;

          beforeEach(() => {
            originalReadyState = document.readyState;
            document.readyState = "loading";
          });

          afterEach(() => {
            document.readyState = originalReadyState;
          });

          it("does not calls listener", () => {
            const spy = createSpy("listener");

            create(() => {})
              .onError(spy)
              .onStart(() => {
                throw new Error("WHAAGH!");
              })
              .onError(spy);

            expect(spy).not.toHaveBeenCalled();
          });

          describe("when `DOMContentLoaded` is dispatched", () => {
            it("calls listeners after all `start` listeners have been called", done => {
              const error = new Error("WHAAGH!");
              const fooStartSpy = createSpy("start").and.callFake(() => {
                throw error;
              });
              const barStartSpy = createSpy("start");
              const fooErrorSpy = createSpy("error");
              const barErrorSpy = createSpy("error");

              create(() => {})
                .onError(fooErrorSpy)
                .onStart(fooStartSpy)
                .onStart(barStartSpy)
                .onError(barErrorSpy)
                .onError(() => {
                  expect(fooErrorSpy).toHaveBeenCalledTimes(1);
                  expect(fooErrorSpy).toHaveBeenCalledWith(error);

                  expect(barErrorSpy).toHaveBeenCalledTimes(1);
                  expect(barErrorSpy).toHaveBeenCalledWith(error);

                  expect(fooStartSpy).toHaveBeenCalledBefore(fooErrorSpy);
                  expect(fooStartSpy).toHaveBeenCalledBefore(barErrorSpy);

                  expect(barStartSpy).toHaveBeenCalledBefore(barErrorSpy);
                  expect(barStartSpy).toHaveBeenCalledBefore(fooErrorSpy);

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

            it("calls all registered listener after `start` listener added", () => {
              const calls = [];

              const beforeSpy = createSpy("before").and.callFake(() => {
                calls.push("before");

                throw new Error("WHAAGH!");
              });
              const errorSpy = createSpy("error").and.callFake(() => {
                calls.push("error");
              });
              const afterSpy = createSpy("after").and.callFake(() => {
                calls.push("after");

                throw new Error("WHAAGH!");
              });

              application
                .onStart(beforeSpy)
                .onError(errorSpy)
                .onStart(afterSpy);

              expect(beforeSpy).toHaveBeenCalledTimes(1);
              expect(errorSpy).toHaveBeenCalledTimes(1);
              expect(afterSpy).toHaveBeenCalledTimes(1);

              expect(afterSpy).toHaveBeenCalledBefore(errorSpy);
            });
          });
        });
      }
    });
  });
});
