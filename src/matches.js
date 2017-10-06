function getMatchesFn() {
  const element = document.createElement("div");

  const possibleSynonyms = [
    "matches",
    "matchesSelector",
    "msMatchesSelector",
    "mozMatchesSelector",
    "webkitMatchesSelector"
  ];

  while (possibleSynonyms.length) {
    const synonym = possibleSynonyms.shift();

    if (element[synonym]) {
      return synonym;
    }
  }

  throw new Error("elements does not support `matches` method");
}

const matchesFn = getMatchesFn();

function matches(element, selector) {
  return element[matchesFn](selector);
}

export default matches;
