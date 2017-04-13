/* @flow */

/* ----- Shortcuts ----- */

const doc: Document = window.document;
const body: Element = ((doc.body: any): Element);

/* ----- Matches Helper ----- */

type MatchesFn = (selector: string) => boolean;
type MatchesAPI =
  & { matches: MatchesFn }
  & { matchesSelector: MatchesFn }
  & { msMatchesSelector: MatchesFn }
  & { mozMatchesSelector: MatchesFn }
  & { webkitMatchesSelector: MatchesFn }
  & { oMatchesSelector: MatchesFn };

function getMatchesFn(): MatchesFn {
  const e = ((doc.createElement('div'): any): MatchesAPI);

  return (
    e.matches ||
    e.matchesSelector ||
    e.msMatchesSelector ||
    e.mozMatchesSelector ||
    e.webkitMatchesSelector ||
    e.oMatchesSelector
  );
}

const matchesFn: MatchesFn = getMatchesFn();

function matches(element: Element, selector: string): boolean {
  return matchesFn.call(element, selector);
}

/* ----- Walk Helper ----- */

type Trees = Element | NodeList<*> | Array<*> | string;
type WalkFn = (element: Element) => mixed;

function filterElements(elements: Array<*>): Array<Element> {
  return elements.filter(e => e instanceof Element);
}

function toArray(nodeList: NodeList<*>): Array<*> {
  return [].slice.call(nodeList);
}

function walk(trees: Trees, selector: string, callback: WalkFn): void {
  let roots;

  if (trees instanceof Element) {
    roots = [trees];
  } else if (trees instanceof NodeList) {
    roots = filterElements(toArray(trees));
  } else if (Array.isArray(trees)) {
    roots = filterElements(trees);
  } else if (typeof trees === 'string') {
    roots = toArray(doc.querySelectorAll(trees));
  } else {
    throw new TypeError('Unsupported type of tree root');
  }

  roots.forEach((root) => {
    if (matches(root, selector)) {
      callback(root);
    }

    toArray(root.querySelectorAll(selector)).forEach(callback);
  });
}

/* ----- Engine ID Helper ----- */

const getEngineId: () => string = (() => {
  let engineId: number = -1;

  return (): string => {
    engineId += 1;

    return `__lighty__${engineId}`;
  };
})();

/* ----- Binding Helpers ----- */

type Bindable = { [key: string]: Array<number> };

function hasBinding(element: Bindable, key: string, id: number): boolean {
  const bindings: ?Array<number> = element[key];

  return bindings ? bindings.indexOf(id) !== -1 : false;
}

function bind(element: Bindable, key: string, id: number): void {
  const bindings: ?Array<number> = element[key];

  element[key] = bindings ? bindings.concat(id) : [id];
}

/* ----- DOM Ready Helper ----- */

function onDOMContentLoaded(action: () => void) {
  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', action);
  } else {
    // See https://connect.microsoft.com/IE/feedback/details/792880/document-readystat
    setTimeout(action, 1);
  }
}

/* ----- Engine Factory ----- */

type BuilderFn = (element: Element, ...args: Array<mixed>) => mixed;
type OnStartFn = () => mixed;
type Component = [number, string, Array<mixed>];

interface Engine {
  component(selector: string, ...args: Array<mixed>): void;
  vitalize(trees?: Trees): void;
}

function createEngine(builder: BuilderFn, onStart?: OnStartFn): Engine {
  const engineId: string = getEngineId();
  const components: Array<Component> = [];

  let isRunning: boolean = false;

  /* ----- Components Instatiation ----- */

  function build(trees: Trees, component: Component): void {
    const id: number = component[0];
    const selector: string = component[1];
    const args: Array<mixed> = component[2];

    walk(trees, selector, (element) => {
      if (hasBinding(element, engineId, id)) {
        return;
      }

      (builder: any).apply(null, [element].concat(args));

      bind(element, engineId, id);
    });
  }

  function vitalize(trees?: Trees): void {
    if (!isRunning) {
      throw Error('Document is not ready yet.');
    }

    const roots = trees || body;

    components.forEach(component => build(roots, component));
  }

  /* ----- Components Registration ----- */

  function register(selector: string): void {
    const id: number = components.length;
    const args: Array<mixed> = [].slice.call(arguments, 1);
    const component: Component = [id, selector, args];

    components.push(component);

    if (isRunning) {
      build(body, component);
    }
  }

  /* ----- Initialization ----- */

  function start(): void {
    isRunning = true;

    vitalize();

    if (onStart) {
      onStart();
    }
  }

  if (!(builder instanceof Function)) {
    throw new TypeError('Builder must be a function');
  }

  onDOMContentLoaded(start);

  return { component: register, vitalize };
}


export default createEngine;
