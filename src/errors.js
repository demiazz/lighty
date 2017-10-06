function sendError(listeners, error) {
  if (listeners.length) {
    for (let i = 0; i < listeners.length; i += 1) {
      try {
        listeners[i].call(null, error);
      } catch (exception) {
        console.error(exception);
      }
    }
  } else {
    console.error(error);
  }
}

function sendErrors(listeners, errors) {
  while (errors.length) {
    sendError(listeners, errors.shift());
  }
}

export { sendError, sendErrors };
