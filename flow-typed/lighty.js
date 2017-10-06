/* @flow */

declare module "lighty" {
  declare export type FactoryFn = (
    element: Element,
    ...options: Array<mixed>
  ) => any;
  declare export type StartListenerFn = () => any;
  declare export type ErrorListenerFn = (error: mixed) => any;
  declare export type Trees = Element | NodeList<*> | Array<*> | string;

  declare export interface Application {
    component(selector: string, ...options: Array<mixed>): Application;
    vitalize(trees?: Trees): Application;
    onStart(listener: StartListenerFn): Application;
    onError(listener: ErrorListenerFn): Application;
  }

  declare export default function create(factory: FactoryFn): Application;
}
