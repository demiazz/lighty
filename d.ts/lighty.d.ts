type Builder = (element: Element, ...args: any[]) => void;
type OnStart = () => void;
type CSSSelector = string;
type Trees = Element | NodeList | Element[] | CSSSelector;

interface Engine {
  component(selector: CSSSelector, ...args: any[]): void;
  vitalize(trees?: Trees): void;
}

export default function create(builder: Builder, onStart?: OnStart): Engine;
