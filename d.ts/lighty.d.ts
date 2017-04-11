type BuilderFn = (element: Element, ...args: any[]) => void;
type OnStartFn = () => void;
type Trees = Element | NodeListOf<any> | Array<any> | string;

interface Engine {
  component(selector: string, ...args: any[]): void;
  vitalize(trees?: Trees): void;
}

export default function createEngine(builder: BuilderFn, onStart?: OnStartFn): Engine;
