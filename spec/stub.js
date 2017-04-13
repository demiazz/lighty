import createEngine from "../src";

class Component {
  constructor(element) {
    const cssClass = element.getAttribute("class");

    element.setAttribute("class", `${cssClass} is-created`);
  }
}

function builder(element, Template) {
  return Template ? new Template(element) : null;
}

function createSpyAndApplication(done) {
  const builderSpy = jasmine.createSpy("builder").and.callFake(builder);
  const application = createEngine(builderSpy, done);

  return [builderSpy, application];
}

const rootClass = "tree";
const elementClass = "component";

export { Component, builder, createSpyAndApplication, rootClass, elementClass };
