function validate(name, fn) {
  if (!(fn instanceof Function)) {
    throw new TypeError(`${name} must to be a function`);
  }
}

export default validate;
