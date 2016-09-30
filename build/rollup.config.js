import { readFileSync } from 'fs';
import { resolve } from 'path';

import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import saveLicense from 'uglify-save-license';


const pkgPath = resolve(__dirname, '../package.json');
const pkg = JSON.parse(readFileSync(pkgPath, { encoding: 'utf8'}));

const config = {
  entry: 'src/index.js',
  plugins: [buble()],
  sourceMap: true,
};

if (process.env.TARGET === 'commonjs') {
  config.dest = 'dist/lighty.js';
  config.format = 'cjs';
}

if (process.env.TARGET === 'es') {
  config.dest = 'dist/lighty.es.js';
  config.format = 'es';
}

if (process.env.TARGET === 'umd') {
  config.moduleName = 'lighty';
  config.dest = process.env.NODE_ENV === 'production'
    ? 'dist/lighty.umd.min.js'
    : 'dist/lighty.umd.js';
  config.format = 'umd';

  config.banner = [
    '/*!',
    ` * ${pkg.name} v${pkg.version}`,
    ` * ${pkg.homepage}`,
    ' *',
    ` * Copyright ${pkg.author.name}`,
    ` * Released under the ${pkg.license} license`,
    ' */',
  ].join('\n');

  if (process.env.NODE_ENV === 'production') {
    config.plugins.push(uglify({
      output: {
        comments: saveLicense,
      },
    }));

    config.banner = `/*! ${[
      `${pkg.name} v${pkg.version}`,
      `${pkg.homepage}`,
      `(c) ${pkg.author.name}`,
      `${pkg.license} license`,
    ].join(' | ')} */`;
  }
}


export default config;
