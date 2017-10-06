import create from "lighty";

describe("Application", () => {
  describe("#onError", () => {
    it("returns application instance itself", () => {
      const application = create(() => {});

      expect(application.onError(() => {})).toBe(application);
    });
  });
});
