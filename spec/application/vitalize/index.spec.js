import create from "lighty";

import { clearFixtures, useFixture } from "helpers/fixtures";
import { createSpy, queryAll } from "helpers/utils";

describe("Application", () => {
  describe("#vitalize", () => {
    let spy;
    let application;

    beforeEach(done => {
      spy = createSpy();
      application = create(spy);

      application.onStart(done);
    });

    afterEach(clearFixtures);

    it("returns application instance itself", () => {
      expect(application.vitalize()).toBe(application);
    });

    it("builds component instances for all registered components", () => {
      application.component(".foo-component");
      application.component(".bar-component");

      useFixture(`
        <div class="component foo-component"></div>
        <div class="component bar-component"></div>
      `);

      const matchedElements = queryAll("component");

      application.vitalize();

      expect(spy).toHaveBeenCalledTimes(matchedElements.length);

      for (let i = 0; i < matchedElements.length; i += 1) {
        const matchedElement = matchedElements.item(i);

        expect(spy).toHaveBeenCalledWith(matchedElement);
      }
    });

    it("processes recursive roots correctly", () => {
      application.component(".component");

      useFixture(`
        <div class="root">
          <div class="component">
          <div class="root component">
            <div class="component">
            <div class="root">
          </div>
        </div>
      `);

      const matchedElements = queryAll("component");

      application.vitalize(".root");

      expect(spy).toHaveBeenCalledTimes(matchedElements.length);

      for (let i = 0; i < matchedElements.length; i += 1) {
        const matchedElement = matchedElements.item(i);

        expect(spy).toHaveBeenCalledWith(matchedElement);
      }
    });

    it("calls factory with original context", done => {
      const context = { life: 42 };
      const withoutContext = function withoutContext() {
        expect([null, window]).toContain(this);
      };
      const withContext = function withContext() {
        expect(this).toBe(context);
      };

      let isStarted = 0;

      const applicationWithoutContext = create(withoutContext);
      const applicationWithContext = create(withContext.bind(context));

      applicationWithoutContext.component(".component", () => {});
      applicationWithContext.component(".component", () => {});

      useFixture(`<div class="component"></div>`);

      applicationWithoutContext.onStart(() => {
        applicationWithoutContext.vitalize();

        isStarted += 1;

        if (isStarted === 2) {
          done();
        }
      });

      applicationWithContext.onStart(() => {
        applicationWithContext.vitalize();

        isStarted += 1;

        if (isStarted === 2) {
          done();
        }
      });
    });
  });
});
