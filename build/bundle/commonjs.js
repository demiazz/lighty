const { writeFileSync } = require("fs");
const { sync: makeDirectory } = require("mkdirp");
const { transform } = require("./babel");
const banner = require("./banner");
const { prettify } = require("./prettify");
const sources = require("./sources");

function build() {
  makeDirectory("lib");

  Object.keys(sources).forEach(file => {
    const dest = `lib/${file}`;
    const code = transform(sources[file], { flow: false, modules: "commonjs" });
    const prettified = prettify(code).replace(/\/\* @flow \*\/\n/, "");
    const bannered = `${banner.base}${prettified}`;

    writeFileSync(dest, bannered);
  });
}

module.exports = build;
