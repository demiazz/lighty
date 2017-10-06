import create from "lighty";

describe("Application", () => {
  describe("#onStart", () => {
    it("throws error when given listener which not a function", () => {
      const application = create(() => {});

      expect(() => application.onStart(42)).toThrowError(
        TypeError,
        "listener must to be a function"
      );
    });
  });
});
