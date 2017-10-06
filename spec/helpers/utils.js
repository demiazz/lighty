export function query(cssClass) {
  return document.querySelector(`.${cssClass}`);
}

export function queryAll(cssClass) {
  return document.querySelectorAll(`.${cssClass}`);
}

export function createSpy(name = "factory") {
  return jasmine.createSpy(name);
}

export function createConsoleSpy() {
  spyOn(console, "error").and.callThrough();
}

export function resetConsoleSpy() {
  if (console.error.calls) {
    console.error.calls.reset();
  }
}
