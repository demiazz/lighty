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

    describe("when root is not given", () => {
      it("builds components for all matched elements", () => {
        application.component(".component");

        useFixture(`
          <div class="component"></div>
          <div class="not-component"></div>
          <svg class="component"></div>
          <svg class="not-component"></div>
        `);

        const matchedElements = queryAll("component");

        application.vitalize();

        expect(spy).toHaveBeenCalledTimes(matchedElements.length);

        for (let i = 0; i < matchedElements.length; i += 1) {
          const matchedElement = matchedElements[i];

          expect(spy).toHaveBeenCalledWith(matchedElement);
        }
      });

      it("builds component for `body` if matched by selector", () => {
        application.component(".component");

        document.body.setAttribute("class", "component");

        application.vitalize();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(document.body);

        document.body.removeAttribute("class");
      });
    });
  });
});
