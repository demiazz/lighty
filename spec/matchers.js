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


export default {
  toBeTrue,
  toBeFalse,
  toBeEmptyArray,
};
