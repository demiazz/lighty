import { Component, createSpyAndApplication, elementClass } from '../stub';
import { fixture, clear } from '../fixture';


describe('create', () => {
  describe('.vitalize', () => {
    afterEach(clear);

    describe('cache', () => {
      it('creates component instances only once for each element', (done) => {
        const [builderSpy, application] = createSpyAndApplication(() => {
          application.component(`.${elementClass}`, Component);

          fixture(`
            <div class="${elementClass}"></div>
          `);

          expect(builderSpy).not.toHaveBeenCalled();

          application.vitalize();

          expect(builderSpy).toHaveBeenCalledTimes(1);

          application.vitalize();

          expect(builderSpy).toHaveBeenCalledTimes(1);

          done();
        });
      });

      it("don't use single cache for all applications", (done) => {
        let firstBuilderSpy;
        let firstApplication;
        let secondBuilderSpy;
        let secondApplication;

        let count = 0;

        function spec() {
          count += 1;

          if (count === 2) {
            fixture(`
              <div class="${elementClass}"></div>
            `);

            firstApplication.component(`.${elementClass}`, Component);
            secondApplication.component(`.${elementClass}`, Component);

            expect(firstBuilderSpy).toHaveBeenCalledTimes(1);
            expect(secondBuilderSpy).toHaveBeenCalledTimes(1);

            done();
          }
        }

        [firstBuilderSpy, firstApplication] = createSpyAndApplication(spec);
        [secondBuilderSpy, secondApplication] = createSpyAndApplication(spec);
      });
    });
  });
});
