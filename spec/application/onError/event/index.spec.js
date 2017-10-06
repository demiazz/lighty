import create from "lighty";

import { createSpy } from "helpers/utils";

describe("Application", () => {
  describe("#onError", () => {
    it("remembers event listener, but not calls it", () => {
      const spy = createSpy("listener");
      const application = create(() => {});

      application.onError(spy);

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
