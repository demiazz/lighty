window.useFixture = function addFixture(html) {
  document.querySelector("body").insertAdjacentHTML("beforeend", html);
};

window.clearFixtures = function clearAllFixtures() {
  document.querySelector("body").innerText = "";
};
