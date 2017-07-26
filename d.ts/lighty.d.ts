type BuilderFn = (element: Element, ...args: any[]) => any;
type OnStartFn = () => any;
type Trees = Element | NodeListOf<any> | Array<any> | string;

interface Engine {
  component(selector: string, ...args: any[]): void;
  vitalize(trees?: Trees): void;
}

export default function createEngine(
  builder: BuilderFn,
  onStart?: OnStartFn
): Engine;
