import create from "lighty";

import { clearFixtures, useFixture } from "helpers/fixtures";
import { createSpy, query, queryAll } from "helpers/utils";

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

    describe("when root is a node list", () => {
      it("builds components only inside elements", () => {
        application.component(".component");

        useFixture(`
          <div class="root">
            <div class="component inside"></div>
            <svg class="component inside"></svg>
            <div class="not-component"></div>
            <svg class="not-component"></svg>
            <div class="root">
              <div class="component inside"></div>
              <svg class="component inside"></svg>
              <div class="not-component"></div>
              <svg class="not-component"></svg>
            </div>
            <svg class="root">
              <div class="component inside"></div>
              <svg class="component inside"></svg>
              <div class="not-component"></div>
              <svg class="not-component"></svg>
            </svg>
          </div>
          <div class="component outside"></div>
          <svg class="component outside"></svg>
          <div class="not-component"></div>
          <svg class="not-component"></svg>
        `);

        const roots = queryAll("root");
        const matchedElements = queryAll("inside");

        application.vitalize(roots);

        expect(spy).toHaveBeenCalledTimes(matchedElements.length);

        for (let i = 0; i < matchedElements.length; i += 1) {
          const matchedElement = matchedElements.item(i);

          expect(spy).toHaveBeenCalledWith(matchedElement);
        }
      });

      it("builds components for roots if its matched by selector", () => {
        application.component(".component");

        useFixture(`
          <div class="root component">
            <div class="component"></div>
            <div class="root component">
              <div class="component"></div>
            </div>
          </div>
        `);

        const roots = queryAll("root");
        const matchedElements = queryAll("component");

        application.vitalize(roots);

        expect(spy).toHaveBeenCalledTimes(matchedElements.length);

        for (let i = 0; i < matchedElements.length; i += 1) {
          const matchedElement = matchedElements.item(i);

          expect(spy).toHaveBeenCalledWith(matchedElement);
        }
      });

      it("ignore not elements instances from node list", () => {
        application.component(".component");

        useFixture(`
          <div class="root">
            text node
            <div>
              <div class="component"></div>
            </div>
            <!-- comment node -->
          </div>
        `);

        const roots = query("root").childNodes;
        const matchedElements = queryAll("component");

        application.vitalize(roots);

        expect(spy).toHaveBeenCalledTimes(matchedElements.length);

        for (let i = 0; i < matchedElements.length; i += 1) {
          const matchedElement = matchedElements.item(i);

          expect(spy).toHaveBeenCalledWith(matchedElement);
        }
      });
    });
  });
});
