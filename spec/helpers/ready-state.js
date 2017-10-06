const readyStateIsMockable = (() => {
  try {
    const initialValue = document.readyState;

    Object.defineProperty(document, "readyState", {
      value: initialValue,
      writable: true
    });

    document.readyState = "non-standard-value";

    if (document.readyState === "non-standard-value") {
      document.readyState = initialValue;

      document.addEventListener("readystatechange", () => {
        if (document.readyState === "loading") {
          document.readyState = "interactive";
        } else if (document.readyState === "interactive") {
          document.readyState = "complete";
        }
      });

      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
})();

function dispatchDOMContentLoaded() {
  const event = document.createEvent("Event");
  event.initEvent("DOMContentLoaded", true, true);
  window.document.dispatchEvent(event);
}

export { readyStateIsMockable, dispatchDOMContentLoaded };
