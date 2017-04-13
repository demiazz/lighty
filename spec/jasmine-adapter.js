/* eslint no-underscore-dangle: "off" */

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

    window.readyStateIsMockable = true;
  } else {
    window.readyStateIsMockable = false;
  }
} catch (e) {
  window.readyStateIsMockable = false;
}

window.__karma__.start = (function jasmineAdapter(originalStartJasmine) {
  return function startJasmine(...args) {
    const originalOnLoadHandler = window.onload;

    window.onload = function handleOnLoad() {
      if (originalOnLoadHandler) {
        originalOnLoadHandler();
      }

      originalStartJasmine(...args);
    };
  };
})(window.__karma__.start);
