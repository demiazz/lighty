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
        ? `Expected ${JSON.stringify(actual)} not to be an instance of ${klass.name}`
        : `Expected ${JSON.stringify(actual)} to be an instance of ${klass.name}`;

      return result;
    },
  };
}

function toContainCSSClass() {
  return {
    compare(actual, klass) {
      const result = {
        pass: actual.className.split(' ').indexOf(klass) !== -1,
      };

      result.message = result.pass
        ? `Expected \`${actual.className}\` not to contain \`${klass}\``
        : `Expected \`${actual.classNane}\` to contain \`${klass}\``;

      return result;
    },
  };
}


export default {
  toBeTrue,
  toBeFalse,
  toBeEmptyArray,
  toBeInstanceOf,
  toContainCSSClass,
};
