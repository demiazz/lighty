import { isCached, cache } from "./cache";
import { sendError, sendErrors } from "./errors";
import nextId from "./id";
import onDOMContentLoaded from "./ready";
import validate from "./validate";
import walk from "./walk";

export default function create(factory) {
  validate("factory", factory);

  const application = {};
  const components = [];
  const errorListeners = [];
  const startListeners = [];
  const errors = [];

  let isReady = false;
  let isRunning = false;

  function build(component, trees) {
    walk(trees || document.body, component[0], element => {
      try {
        if (isCached(element, component[1])) {
          return;
        }

        factory.apply(null, [element].concat(component[2]));

        cache(element, component[1]);
      } catch (exception) {
        errors.push(exception);
      }
    });
  }

  function start() {
    isReady = true;

    application.vitalize();

    isRunning = true;

    while (startListeners.length) {
      try {
        startListeners.shift().apply(null);
      } catch (exception) {
        errors.push(exception);
      }
    }

    sendErrors(errorListeners, errors);
  }

  application.component = function component(selector) {
    const metadata = [selector, nextId(), [].slice.call(arguments, 1)];

    components.push(metadata);

    if (isReady) {
      build(metadata);

      sendErrors(errorListeners, errors);
    }

    return this;
  };

  application.vitalize = function vitalize(trees) {
    if (!isReady) {
      throw new Error("application is not running yet");
    }

    for (let i = 0; i < components.length; i += 1) {
      build(components[i], trees);
    }

    sendErrors(errorListeners, errors);

    return this;
  };

  application.onStart = function onStart(listener) {
    validate("listener", listener);

    if (isRunning) {
      try {
        listener();
      } catch (exception) {
        sendError(errorListeners, exception);
      }
    } else {
      startListeners.push(listener);
    }

    return application;
  };

  application.onError = function onError(listener) {
    validate("listener", listener);

    errorListeners.push(listener);

    return application;
  };

  onDOMContentLoaded(start);

  return application;
}
