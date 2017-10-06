import create from "lighty";

describe("Application", () => {
  describe("#vitalize", () => {
    let application;

    beforeEach(done => {
      application = create(() => {});

      application.onStart(done);
    });

    it("throws error when unsupported root type given", () => {
      application.component(".component");

      expect(() => {
        application.vitalize(1);
      }).toThrowError(TypeError, "unsupported type of tree root");
    });
  });
});
