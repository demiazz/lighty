/* eslint no-underscore-dangle: "off" */

try {
  Object.defineProperty(document, 'readyState', {
    value: document.readyState,
    writable: true,
  });

  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'loading') {
      document.readyState = 'interactive';
    } else if (document.readyState === 'interactive') {
      document.readyState = 'complete';
    }
  });

  window.readyStateIsMockable = true;
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
}(window.__karma__.start));
