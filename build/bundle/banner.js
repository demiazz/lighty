const pkg = require("./package");

const short = `/*! ${[`${pkg.name} v${pkg.version}`, `${pkg.homepage}`, `(c) ${pkg.author.name}`, `${pkg.license} license`].join(" | ")} */`;

const base = [
  "/*!",
  ` * ${pkg.name} v${pkg.version}`,
  ` * ${pkg.homepage}`,
  " *",
  ` * Copyright 2016-present ${pkg.author.name} <${pkg.author.email}>`,
  ` * Released under the ${pkg.license} license`,
  " */",
  "",
  ""
].join("\n");

const flow = [
  "/*!",
  ` * ${pkg.name} v${pkg.version}`,
  ` * ${pkg.homepage}`,
  " *",
  ` * Copyright 2016-present ${pkg.author.name} <${pkg.author.email}>`,
  ` * Released under the ${pkg.license} license`,
  " *",
  " * @flow",
  " */",
  ""
].join("\n");

module.exports = { short, base, flow };
