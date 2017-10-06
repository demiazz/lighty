import create from "lighty";

import { clearFixtures, useFixture } from "helpers/fixtures";
import { createSpy } from "helpers/utils";

describe("create", () => {
  afterEach(clearFixtures);

  it("create application with given factory", done => {
    const spy = createSpy();

    useFixture('<div class="component"></div>');

    const application = create(spy);

    application.component(".component");

    application.onStart(() => {
      expect(spy).toHaveBeenCalled();

      done();
    });
  });

  it("throws error when factory is not a function", () => {
    expect(() => create(42)).toThrowError(
      TypeError,
      "factory must to be a function"
    );
  });
});
