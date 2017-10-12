import create from "lighty";

import { clearFixtures, useFixture } from "helpers/fixtures";
import {
  createSpy,
  createConsoleSpy,
  resetConsoleSpy,
  queryAll
} from "helpers/utils";

describe("Application", () => {
  describe("#onError", () => {
    describe("when error happened in `#component`", () => {
      let factory;
      let application;

      beforeEach(done => {
        createConsoleSpy();

        application = create(element => factory(element));

        application.onStart(done);
      });

      afterEach(() => {
        resetConsoleSpy();

        clearFixtures();
      });

      it("calls remembered listeners", () => {
        const fooSpy = createSpy("listener");
        const barSpy = createSpy("listener");

        factory = () => {
          throw new Error("WHAAGH!");
        };

        application.onError(fooSpy).onError(barSpy);

        expect(fooSpy).not.toHaveBeenCalled();
        expect(barSpy).not.toHaveBeenCalled();

        useFixture(`<div class="component"></div>`);

        application.component(".component");

        expect(fooSpy).toHaveBeenCalledTimes(1);
        expect(barSpy).toHaveBeenCalledTimes(1);
      });

      it("calls listener with original context", () => {
        const context = { life: 42 };
        const withoutContext = function withoutContext() {
          expect([null, window]).toContain(this);
        };
        const withContext = function withContext() {
          expect(this).toBe(context);
        };

        factory = () => {
          throw new Error("WHAAGH!");
        };

        useFixture(`<div class="component"></div>`);

        application.onError(withoutContext).onError(withContext.bind(context));

        application.component(".component");
      });

      it("calls listener with error as argument", () => {
        const spy = createSpy("listener");
        const errors = [
          "WHAAGH!",
          ["WHAAGH!"],
          Error("WHAAGH!"),
          new Error("WHAAGH!")
        ];

        factory = (() => {
          let calls = -1;

          return () => {
            calls += 1;

            throw errors[calls];
          };
        })();

        useFixture(`<div class="component"></div>`);

        application.onError(spy);

        for (let i = 0; i < errors.length; i += 1) {
          application.component(".component");

          expect(spy).toHaveBeenCalledWith(errors[i]);
        }

        expect(spy).toHaveBeenCalledTimes(errors.length);
      });

      it("outputs error to console if no listeners registered", () => {
        const errors = [
          "WHAAGH!",
          ["WHAAGH!"],
          Error("WHAAGH!"),
          new Error("WHAAGH!")
        ];

        factory = (() => {
          let calls = -1;

          return () => {
            calls += 1;

            throw errors[calls];
          };
        })();

        useFixture(`<div class="component"></div>`);

        for (let i = 0; i < errors.length; i += 1) {
          application.component(".component");

          expect(console.error).toHaveBeenCalledWith(errors[i]);
        }

        expect(console.error).toHaveBeenCalledTimes(errors.length);
      });

      it("builds elements first and emit errors after", done => {
        let isErrorRaised = false;

        factory = createSpy().and.callFake(() => {
          if (isErrorRaised) {
            return;
          }

          isErrorRaised = true;

          throw new Error("WHAAGH!");
        });

        useFixture(`
          <div class="component"></div>
          <div class="component"></div>
        `);

        const matchedElementsCount = queryAll("component").length;

        application.onError(() => {
          expect(factory).toHaveBeenCalledTimes(matchedElementsCount);

          done();
        });

        application.component(".component");
      });

      it("ignores error in listener and outputs it to console", () => {
        const listenerError = new Error("WHAAGH!");
        const fooSpy = createSpy("listener").and.callFake(() => {
          throw listenerError;
        });
        const barSpy = createSpy("listener");

        factory = () => {
          throw new Error("WHAAGH!");
        };

        application.onError(fooSpy).onError(barSpy);

        expect(fooSpy).not.toHaveBeenCalled();
        expect(barSpy).not.toHaveBeenCalled();

        useFixture(`<div class="component"></div>`);

        application.component(".component");

        expect(fooSpy).toHaveBeenCalledTimes(1);
        expect(barSpy).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(listenerError);
      });
    });
  });
});
