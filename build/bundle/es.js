const { writeFileSync } = require("fs");
const { sync: makeDirectory } = require("mkdirp");
const banner = require("./banner");
const { prettify } = require("./prettify");
const sources = require("./sources");

function build() {
  makeDirectory("lib");

  Object.keys(sources).forEach(file => {
    const dest = `lib/${file}.flow`;
    const code = prettify(sources[file]).replace(/\/\* @flow \*\/\n/, "");
    const bannered = `${banner.flow}${code}`;

    writeFileSync(dest, bannered);
  });
}

module.exports = build;
