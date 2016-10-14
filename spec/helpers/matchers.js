import isDeepEqual from 'deep-equal';


function toBeTrue() {
  return {
    compare(actual) {
      const result = {
        pass: actual === true,
      };

      result.message = result.pass
        ? `Expected ${JSON.stringify(actual)} not to be true`
        : `Expected ${JSON.stringify(actual)} to be true`;

      return result;
    },
  };
}

function toBeFalse() {
  return {
    compare(actual) {
      const result = {
        pass: actual === false,
      };

      result.message = result.pass
        ? `Expected ${JSON.stringify(actual)} not to be false`
        : `Expected ${JSON.stringify(actual)} to be false`;

      return result;
    },
  };
}

function toBeEmptyArray() {
  return {
    compare(actual) {
      const result = {
        pass: Array.isArray(actual) && actual.length === 0,
      };

      result.message = result.pass
        ? `Expected ${JSON.stringify(actual)} not to be an empty array`
        : `Expected ${JSON.stringify(actual)} to be an empty array`;

      return result;
    },
  };
}

function toBeInstanceOf() {
  return {
    compare(actual, klass) {
      const result = {
        pass: actual instanceof klass,
      };

      result.message = result.pass
        ? `Expected object not to be an instance of ${klass.name}`
        : `Expected object to be an instance of ${klass.name}`;

      return result;
    },
  };
}

function toDeepEqual() {
  return {
    compare(actual, expected) {
      const result = {
        pass: isDeepEqual(actual, expected),
      };

      const actualJSON = JSON.stringify(actual);
      const expectedJSON = JSON.stringify(expected);

      result.message = result.pass
        ? `Expected ${actualJSON} not to be deep equal to ${expectedJSON}`
        : `Expected ${actualJSON} to be deep equal to ${expectedJSON}`;

      return result;
    },
  };
}

function toHaveCSSClass() {
  return {
    compare(actual, klass) {
      let nodes;

      if (actual instanceof HTMLElement) {
        nodes = [actual];
      } else if (actual instanceof NodeList) {
        nodes = [].slice.call(actual);
      } else if (typeof actual === 'string') {
        nodes = [].slice.call(document.querySelectorAll(actual));
      } else {
        return {
          pass: false,
          message: 'Expected HTMLElement, NodeList or selector',
        };
      }

      const pass = nodes.every(node => (
        node.className.split(' ').indexOf(klass) !== -1
      ));
      const message = pass
        ? `Expected node(s) to haven't \`.${klass}\` CSS class`
        : `Expected node(s) to have \`.${klass}\` CSS class`;

      return { pass, message };
    },
  };
}


export default {
  toBeTrue,
  toBeFalse,
  toBeEmptyArray,
  toBeInstanceOf,
  toDeepEqual,
  toHaveCSSClass,
};
