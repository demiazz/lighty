export function fixture(html) {
  const body = document.querySelector('body');
  const fragment = `<div>${html}</div>`;

  body.insertAdjacentHTML('beforeend', fragment);
}

export function clear() {
  const body = document.querySelector('body');

  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }
}
