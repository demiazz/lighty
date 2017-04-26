const { readFileSync, writeFileSync } = require("fs");
const prettier = require("prettier");

function prettify(source) {
  return prettier.format(source);
}

function prettifyFile(file) {
  const source = prettify(readFileSync(file).toString());

  writeFileSync(file, source);
}

module.exports = { prettify, prettifyFile };
