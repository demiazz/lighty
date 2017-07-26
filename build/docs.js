const fs = require("fs");
const path = require("path");
const documentation = require("documentation");

const OPEN_TAG = "<!-- API: BEGIN -->";
const CLOSE_TAG = "<!-- API: END -->";

function build(...files) {
  return documentation.build(files, {});
}

function format(docs) {
  return documentation.formats.md(docs, {});
}

function write(docs) {
  const readmePath = path.resolve(__dirname, "../README.md");
  const readme = fs.readFileSync(readmePath);
  const intro = readme.slice(0, readme.indexOf(OPEN_TAG) + OPEN_TAG.length);
  const outro = readme.slice(readme.indexOf(CLOSE_TAG));

  fs.writeFileSync(readmePath, `${intro}${docs}${outro}`);
}

build(path.resolve(__dirname, "../src/docs.js")).then(format).then(write);
