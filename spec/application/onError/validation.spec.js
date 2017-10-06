import create from "lighty";

describe("Application", () => {
  describe("#onError", () => {
    it("throws error when given listener which not a function", () => {
      const application = create(() => {});

      expect(() => application.onError(42)).toThrowError(
        TypeError,
        "listener must to be a function"
      );
    });
  });
});
