const fs = require("fs");
const path = require("path");
const jsdoc2md = require("jsdoc-to-markdown");

const OPEN_TAG = "<!-- API: BEGIN -->";
const CLOSE_TAG = "<!-- API: END -->";

const readme = fs
  .readFileSync(path.resolve(__dirname, "../README.md"))
  .toString();
const docs = jsdoc2md.renderSync({
  files: path.resolve(__dirname, "../src/docs.js")
});
const intro = readme.slice(0, readme.indexOf(OPEN_TAG) + OPEN_TAG.length);
const outro = readme.slice(readme.indexOf(CLOSE_TAG));

fs.writeFileSync(
  path.resolve(__dirname, "../README.md"),
  `${intro}\n${docs}\n${outro}`
);
