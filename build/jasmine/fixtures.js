window.useFixture = function useFixture(html) {
  document.body.insertAdjacentHTML("beforeend", html);
};

window.clearFixtures = function clearFixtures() {
  document.body.innerHTML = "";
};
