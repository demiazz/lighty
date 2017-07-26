const { readdirSync, readFileSync } = require("fs");

const sources = readdirSync("src").reduce((result, file) => {
  if (file !== "docs.js") {
    result[file] = readFileSync(`src/${file}`).toString();
  }

  return result;
}, {});

module.exports = Object.freeze(sources);
