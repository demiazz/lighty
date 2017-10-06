export function useFixture(html) {
  document.body.insertAdjacentHTML("beforeend", html);
}

export function clearFixtures() {
  document.body.innerHTML = "";
}
