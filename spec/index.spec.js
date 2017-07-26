/* eslint no-unused-vars: "off" */

import createEngine from "../src";

describe("create", () => {
  describe("base behaviour", () => {
    it("raise error when builder doesn't given", () => {
      expect(() => {
        createEngine();
      }).toThrowError(TypeError);
    });

    it("raise error when builder is not a function", () => {
      [1, [], {}, "string"].forEach(builder => {
        expect(() => {
          createEngine(builder);
        }).toThrowError(TypeError);
      });
    });

    describe("done callback", () => {
      if (readyStateIsMockable) {
        let doneSpy;

        beforeEach(() => {
          doneSpy = jasmine.createSpy("onStart");
        });

        describe("when `document.readyState` equals to `loading`", () => {
          let backup;

          beforeEach(() => {
            backup = document.readyState;
            document.readyState = "loading";
          });

          afterEach(() => {
            document.readyState = backup;
          });

          it("doesn't call `onStart` callback", done => {
            const application = createEngine(() => {}, doneSpy);

            setTimeout(() => {
              expect(doneSpy).not.toHaveBeenCalled();

              done();
            }, 10);
          });

          describe("when `DOMContentLoaded` raised", () => {
            it("calls `onStart` callback", done => {
              const application = createEngine(() => {}, doneSpy);

              setTimeout(() => {
                expect(doneSpy).not.toHaveBeenCalled();

                const event = document.createEvent("Event");
                event.initEvent("DOMContentLoaded", true, true);
                window.document.dispatchEvent(event);

                expect(doneSpy).toHaveBeenCalledTimes(1);

                done();
              }, 10);
            });
          });
        });

        ["interactive", "complete"].forEach(state => {
          describe(`when \`document.readyState\` equals to \`${state}\``, () => {
            let backup;

            beforeEach(() => {
              backup = document.readyState;
              document.readyState = state;
            });

            afterEach(() => {
              document.readyState = backup;
            });

            it("calls `onStart` callback", done => {
              const application = createEngine(() => {}, doneSpy);

              setTimeout(() => {
                expect(doneSpy).toHaveBeenCalledTimes(1);

                done();
              }, 10);
            });
          });
        });
      }
    });
  });
});
