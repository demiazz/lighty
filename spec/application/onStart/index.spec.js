import create from "lighty";

describe("Application", () => {
  describe("#onStart", () => {
    it("returns application instance itself", () => {
      const application = create(() => {});

      expect(application.onStart(() => {})).toBe(application);
    });
  });
});
