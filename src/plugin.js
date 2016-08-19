export default class Plugin {
  constructor(name, transformer) {
    this.name = name;
    this.transformer = transformer;
  }

  transform(component, node) {
    this.transformer(component, node);
  }
}
