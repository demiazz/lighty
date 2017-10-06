export type FactoryFn = (element: Element, ...options: any[]) => any;
export type StartListenerFn = () => any;
export type ErrorListenerFn = (error: any) => any;
export type Trees = Element | NodeListOf<any> | Array<any> | string;

export interface Application {
  component(selector: string, ...options: any[]): this;
  vitalize(trees?: Trees): this;
  onStart(listener: StartListenerFn): this;
  onError(listener: ErrorListenerFn): this;
}

export default function create(factory: FactoryFn): Application;
