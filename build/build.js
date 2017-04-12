const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const { transform } = require('babel-core');
const { minify } = require('uglify-js');
const saveLicense = require('uglify-save-license');
const prettier = require('prettier');
const chalk = require('chalk');


function readPackage() {
  const packagePath = resolve(__dirname, '../package.json');

  return JSON.parse(readFileSync(packagePath, { encoding: 'utf8' }));
}

function transformSource(source, stripTypes) {
  const { code } = transform(source, {
    presets: [
      ['es2015', { modules: false }],
    ],
    plugins: [
      stripTypes ? 'transform-flow-strip-types' : 'syntax-flow',
    ],
  });

  return code;
}

function readSource() {
  const sourcePath = resolve(__dirname, '../src/index.js');

  console.log(chalk.green('Read source code...'));

  const rawSource = readFileSync(sourcePath, { encoding: 'utf8' }).toString();

  console.log(chalk.green('Transform source code...'));

  const source = transformSource(rawSource, true);
  const typedSource = transformSource(rawSource, false);

  return { source, typedSource };
}

function minifySource(source, file) {
  const { code, map } = minify(source, {
    fromString: true,
    outSourceMap: `${file}.map`,
    output: {
      comments: saveLicense,
    },
  });

  return { code, map };
}

function formatSource(source) {
  return prettier.format(source, {
    printWidth: 80,
    tabWidth: 2,
    singleQuote: true,
    trailingComma: 'none',
    bracketSpacing: true,
    parser: 'flow',
  });
}

function saveSource(file, source) {
  console.log(file);

  const outputPath = resolve(__dirname, `../lib/${file}`);

  writeFileSync(outputPath, source);
}

function useFullBanner(source) {
  const { author, homepage, license, name, version } = readPackage();

  const banner = [
    '/*!',
    ` * ${name} v${version}`,
    ` * ${homepage}`,
    ' *',
    ` * Copyright ${author.name}`,
    ` * Released under the ${license} license`,
    ' */',
  ].join('\n');

  if (source.startsWith('/* @flow */')) {

  }

  return source.startsWith('/* @flow */')
    ? source.replace(/\/\* @flow \*\//, `/* @flow */\n\n${banner}`)
    : `${banner}\n\n${source}`;
}

function useShortBanner(source) {
  const { author, homepage, license, name, version } = readPackage();

  const banner = `/*! ${[
    `${name} v${version}`,
    `${homepage}`,
    `(c) ${author.name}`,
    `${license} license`,
  ].join(' | ')} */`;

  return `${banner}\n${source}`;
}

function useCommonJS(source) {
  const code = source.replace(/export default/, 'module.exports =');

  if (code.search(/^\/\* @flow \*\//) !== -1) {
    return code.replace(/\/\* @flow \*\//, "/* @flow */\n\n'use strict'");
  }

  return `'use strict'\n\n${code}`;
}

function useUMD(source) {
  const { name } = readPackage();
  const umdStart = [
    '(function (global, factory) {',
    "  if (typeof exports === 'object' && typeof module !== 'undefined') {",
    '    module.exports = factory();',
    "  } else if (typeof define === 'function' && define.amd) {",
    `    define('${name}', factory);`,
    '  } else {',
    `    global.${name} = factory();`,
    '  }',
    '})(this, function () {',
    "  'use strict';",
  ].join('\n');
  const umdEnd = '});';
  const code = source.replace(/export\ default/, 'return');

  return `${umdStart}\n\n${code}\n${umdEnd}`;
}

function buildESModule(source, useFlow) {
  console.log(
    useFlow
      ? chalk.green('Generate ES Module with types...')
      : chalk.green('Generate ES Module without types...')
  );

  const file = useFlow ? 'lighty.es.js.flow' : 'lighty.es.js';

  saveSource(file, formatSource(useFullBanner(source)));
}

function buildCommonJSModule(source, useFlow) {
  console.log(
    useFlow
      ? chalk.green('Generate CommonJS with types...')
      : chalk.green('Generate CommonJS without types...')
  );

  const file = useFlow ? 'lighty.js.flow' : 'lighty.js';

  saveSource(file, formatSource(useFullBanner(useCommonJS(source))));
}

function buildUMDModule(source, isMinified) {
  console.log(
    isMinified
      ? chalk.green('Generate UMD...')
      : chalk.green('Generate minified UMD...')
  );

  const file = isMinified ? 'lighty.umd.min.js' : 'lighty.umd.js';

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
