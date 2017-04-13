const { readFileSync, writeFileSync } = require("fs");
const { resolve, dirname } = require("path");
const { sync: makeDirectory } = require("mkdirp");
const { transform } = require("babel-core");
const { minify } = require("uglify-js");
const saveLicense = require("uglify-save-license");
const prettier = require("prettier");
const chalk = require("chalk");

function log(message) {
  console.log(chalk.green(message)); // eslint-disable-line
}

function readPackage() {
  const packagePath = resolve(__dirname, "../package.json");

  return JSON.parse(readFileSync(packagePath, { encoding: "utf8" }));
}

function transformSource(source, stripTypes) {
  const { code } = transform(source, {
    presets: [["es2015", { modules: false }]],
    plugins: [stripTypes ? "transform-flow-strip-types" : "syntax-flow"]
  });

  return code;
}

function readSource() {
  const sourcePath = resolve(__dirname, "../src/index.js");

  log("Read source code...");

  const rawSource = readFileSync(sourcePath, { encoding: "utf8" }).toString();

  log("Transform source code...");

  const source = transformSource(rawSource, true);
  const typedSource = transformSource(rawSource, false);

  return { source, typedSource };
}

function minifySource(source, file) {
  const { code, map } = minify(source, {
    fromString: true,
    outSourceMap: `${file}.map`,
    output: {
      comments: saveLicense
    }
  });

  return { code, map };
}

function formatSource(source) {
  return prettier.format(source);
}

function saveSource(file, source) {
  const outputPath = resolve(__dirname, `../${file}`);

  makeDirectory(dirname(outputPath));

  writeFileSync(outputPath, source);
}

function useFullBanner(source) {
  const { author, homepage, license, name, version } = readPackage();

  const banner = [
    "/*!",
    ` * ${name} v${version}`,
    ` * ${homepage}`,
    " *",
    ` * Copyright ${author.name}`,
    ` * Released under the ${license} license`,
    " */"
  ].join("\n");

  return source.startsWith("/* @flow */")
    ? source.replace(/\/\* @flow \*\//, `/* @flow */\n\n${banner}`)
    : `${banner}\n\n${source}`;
}

function useShortBanner(source) {
  const { author, homepage, license, name, version } = readPackage();

  const banner = `/*! ${[`${name} v${version}`, `${homepage}`, `(c) ${author.name}`, `${license} license`].join(" | ")} */`;

  return `${banner}\n${source}`;
}

function useCommonJS(source) {
  const code = source.replace(/export default/, "module.exports =");

  if (code.search(/^\/\* @flow \*\//) !== -1) {
    return code.replace(/\/\* @flow \*\//, "/* @flow */\n\n'use strict'");
  }

  return `'use strict'\n\n${code}`;
}

function useUMD(source) {
  const { name } = readPackage();
  const umdStart = [
    "(function (global, factory) {",
    "  if (typeof exports === 'object' && typeof module !== 'undefined') {",
    "    module.exports = factory();",
    "  } else if (typeof define === 'function' && define.amd) {",
    `    define('${name}', factory);`,
    "  } else {",
    `    global.${name} = factory();`,
    "  }",
    "})(this, function () {",
    "  'use strict';"
  ].join("\n");
  const umdEnd = "});";
  const code = source.replace(/export default/, "return");

  return `${umdStart}\n\n${code}\n${umdEnd}`;
}

function buildESModule(source, useFlow) {
  log(
    useFlow
      ? "Generate ES Module with types..."
      : "Generate ES Module without types..."
  );

  const file = useFlow ? "index.es.js.flow" : "index.es.js";

  saveSource(file, formatSource(useFullBanner(source)));
}

function buildCommonJSModule(source, useFlow) {
  log(
    useFlow
      ? "Generate CommonJS with types..."
      : "Generate CommonJS without types..."
  );

  const file = useFlow ? "index.js.flow" : "index.js";

  saveSource(file, formatSource(useFullBanner(useCommonJS(source))));
}

function buildUMDModule(source, isMinified) {
  log(isMinified ? "Generate UMD..." : "Generate minified UMD...");

  const file = `dist/${isMinified ? "lighty.umd.min.js" : "lighty.umd.js"}`;

  if (isMinified) {
    const { code, map } = minifySource(useShortBanner(useUMD(source)), file);

    saveSource(file, code);
    saveSource(`${file}.map`, map);
  } else {
    saveSource(file, formatSource(useFullBanner(useUMD(source))));
  }
}

function build() {
  const { source, typedSource } = readSource();

  buildESModule(source, false);
  buildESModule(typedSource, true);
  buildCommonJSModule(source, false);
  buildCommonJSModule(typedSource, true);
  buildUMDModule(source, false);
  buildUMDModule(source, true);
}

build();
