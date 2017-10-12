import create from "lighty";

import { useFixture, clearFixtures } from "helpers/fixtures";
import {
  readyStateIsMockable,
  dispatchDOMContentLoaded
} from "helpers/ready-state";
import { query, queryAll, createSpy } from "helpers/utils";

describe("Application", () => {
  describe("#component", () => {
    let spy;
    let application;

    beforeEach(done => {
      spy = createSpy();
      application = create(spy);

      application.onStart(done);
    });

    afterEach(clearFixtures);

    it("returns application instance itself", () => {
      expect(application.component()).toBe(application);
    });

    it("builds component for each matched element", () => {
      useFixture(`
        <div class="component"></div>
        <div>
          <div class="component"></div>
        </div>
        <div class="not-component"></div>
        <div>
          <div class="not-component"></div>
        </div>
        <div class="not-component">
          <div class="component"></div>
        </div>
        <div class="component">
          <div class="not-component"></div>
        </div>
      `);

      const matchedElements = queryAll("component");

      application.component(".component");

      expect(spy).toHaveBeenCalledTimes(matchedElements.length);

      for (let i = 0; i < matchedElements.length; i += 1) {
        const matchedElement = matchedElements.item(i);

        expect(spy).toHaveBeenCalledWith(matchedElement);
      }
    });

    it("builds component with given options", () => {
      useFixture(`
        <div class="component without-options"></div>
        <div class="component with-single-option"></div>
        <div class="component with-two-options"></div>
      `);

      const matchedElements = queryAll("component");
      const withoutOptions = query("without-options");
      const withSingleOption = query("with-single-option");
      const withTwoOptions = query("with-two-options");

      application
        .component(".without-options")
        .component(".with-single-option", 1)
        .component(".with-two-options", 2, 3);

      expect(spy).toHaveBeenCalledTimes(matchedElements.length);
      expect(spy).toHaveBeenCalledWith(withoutOptions);
      expect(spy).toHaveBeenCalledWith(withSingleOption, 1);
      expect(spy).toHaveBeenCalledWith(withTwoOptions, 2, 3);
    });

    it("allows build many components for same element", () => {
      useFixture(`<div class="component foo bar"></div>`);

      const matchedElement = query("component");

      application.component(".foo", "foo").component(".bar", "bar");

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(matchedElement, "foo");
      expect(spy).toHaveBeenCalledWith(matchedElement, "bar");
    });

    it("remember selector and options for future using", () => {
      application
        .component(".without-options")
        .component(".with-options", 1, 2);

      expect(spy).not.toHaveBeenCalled();

      useFixture(`
        <div class="component without-options"></div>
        <div class="component with-options"></div>
      `);

      const matchedElements = queryAll("component");
      const withoutOptions = query("without-options");
      const withOptions = query("with-options");

      application.vitalize();

      expect(spy).toHaveBeenCalledTimes(matchedElements.length);
      expect(spy).toHaveBeenCalledWith(withoutOptions);
      expect(spy).toHaveBeenCalledWith(withOptions, 1, 2);
    });

    it("builds component for each element only once", () => {
      useFixture('<div class="component"></div>');

      const matchedElement = query("component");

      application.component(".component");

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(matchedElement);

      application.vitalize();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("considers components with same selector and options as different components", () => {
      useFixture('<div class="component"></div>');

      const matchedElement = query("component");

      application.component(".component", 1, 2).component(".component", 1, 2);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(matchedElement, 1, 2);
    });

    describe("when more then one application created", () => {
      let fooSpy = createSpy("fooFactory");
      let barSpy = createSpy("barFactory");
      let fooApplication = create(fooSpy);
      let barApplication = create(barSpy);

      beforeEach(done => {
        fooSpy = createSpy("fooFactory");
        barSpy = createSpy("barFactory");

        let readyCount = 0;

        const ready = () => {
          readyCount += 1;

          if (readyCount === 2) {
            done();
          }
        };

        fooApplication = create(fooSpy);
        barApplication = create(barSpy);

        fooApplication.onStart(ready);
        barApplication.onStart(ready);
      });

      it("does not use cache of other applications", () => {
        useFixture('<div class="initial-component"></div>');

        const matchedElement = query("initial-component");

        fooApplication.component(".initial-component");
        barApplication.component(".initial-component");

        expect(fooSpy).toHaveBeenCalledTimes(1);
        expect(fooSpy).toHaveBeenCalledWith(matchedElement);

        expect(barSpy).toHaveBeenCalledTimes(1);
        expect(barSpy).toHaveBeenCalledWith(matchedElement);
      });
    });

    describe("when component building is errored", () => {
      beforeEach(done => {
        spy = createSpy().and.callFake((element, fn) => fn(element));
        application = create(spy);

        application.onStart(done);
      });

      it("intercept all errors during components building", () => {
        useFixture(`
          <div class="component before"><div>
          <div class="component before"></div>
          <div class="component before"></div>
          <div class="component inside"></div>
          <div class="component inside" data-error></div>
          <div class="component inside"></div>
          <div class="component after"></div>
          <div class="component after"></div>
          <div class="component after"></div>
        `);

        const matchedElements = queryAll("component");

        const factory = element => {
          if (element.hasAttribute("data-error")) {
            throw new Error("WHAAGH!");
          } else {
            element.setAttribute("data-ok", true);
          }
        };

        application
          .component(".before", factory)
          .component(".inside", factory)
          .component(".after", factory);

        expect(spy).toHaveBeenCalledTimes(matchedElements.length);

        for (let i = 0; i < matchedElements.length; i += 1) {
          const matchedElement = matchedElements.item(i);

          expect(spy).toHaveBeenCalledWith(matchedElement, factory);

          if (!matchedElement.hasAttribute("data-error")) {
            expect(matchedElement.hasAttribute("data-ok")).toBe(true);
          }
        }
      });

      it("does not cache component if errored", () => {
        useFixture('<div class="component"></div>');

        const matchedElement = query("component");

        const factory = element => {
          if (!element.hasAttribute("data-error")) {
            element.setAttribute("data-error", true);

            throw new Error("WHAAGH!");
          }
        };

        application.component(".component", factory);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(matchedElement, factory);

        application.vitalize();

        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith(matchedElement, factory);

        application.vitalize();

        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith(matchedElement, factory);
      });
    });

    it("calls factory with original context", done => {
      const context = { life: 42 };
      const withoutContext = function withoutContext() {
        expect([null, window]).toContain(this);
      };
      const withContext = function withContext() {
        expect(this).toBe(context);
      };

      useFixture(`<div class="component"></div>`);

      let isStarted = 0;

      const applicationWithoutContext = create(withoutContext);
      const applicationWithContext = create(withContext.bind(context));

      applicationWithoutContext
        .component(".component", () => {})
        .onStart(() => {
          isStarted += 1;

          if (isStarted === 2) {
            done();
          }
        });

      applicationWithContext.component(".component", () => {}).onStart(() => {
        isStarted += 1;

        if (isStarted === 2) {
          done();
        }
      });
    });

    if (readyStateIsMockable) {
      describe("when `document.readyState` is `loading`", () => {
        let originalReadyState;

        beforeEach(() => {
          originalReadyState = document.readyState;
          document.readyState = "loading";

          spy = createSpy();
          application = create(spy);
        });

        afterEach(() => {
          document.readyState = originalReadyState;
        });

        it("only remembers component, not builds its", () => {
          useFixture('<div class="component"></div>');

          application.component(".component");

          expect(spy).not.toHaveBeenCalled();
        });

        describe("when `DOMContentLoaded` is dispatched", () => {
          it("builds all early remembered components", () => {
            useFixture('<div class="component"></div>');

            const matchedElement = query("component");

            application.component(".component");

            expect(spy).not.toHaveBeenCalled();

            dispatchDOMContentLoaded();

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(matchedElement);
          });
        });
      });
    }
  });
});
