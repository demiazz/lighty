declare module 'lighty' {
  declare type Builder = (...args: any[]) => void;
  declare type OnStart = () => void;
  declare type CSSSelector = string;
  declare type Trees = Element | NodeList<*> | Element[] | CSSSelector;

  declare interface Engine {
    component(selector: CSSSelector, ...args: any[]): void;
    vitalize(trees?: Trees): void;
  }

  declare function exports(builder: Builder, onStart?: OnStart): Engine;
}
