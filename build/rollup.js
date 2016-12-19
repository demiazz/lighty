const path = require('path');
const fs = require('fs');
const rollup = require('rollup');
const buble = require('rollup-plugin-buble');
const uglify = require('rollup-plugin-uglify');
const saveLicense = require('uglify-save-license');


function createBanner(short) {
  const pkgPath = path.resolve(__dirname, '../package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, { encoding: 'utf8' }));

  if (short) {
    return `/*! ${[
      `${pkg.name} v${pkg.version}`,
      `${pkg.homepage}`,
      `(c) ${pkg.author.name}`,
      `${pkg.license} license`,
    ].join(' | ')} */`;
  }

  return [
    '/*!',
    ` * ${pkg.name} v${pkg.version}`,
    ` * ${pkg.homepage}`,
    ' *',
    ` * Copyright ${pkg.author.name}`,
    ` * Released under the ${pkg.license} license`,
    ' */',
  ].join('\n');
}

function createConfig(target) {
  const rollupOptions = {
    entry: 'src/index.js',

    plugins: [buble()],
  };

  const writeOptions = {
    moduleId: 'lighty',
    moduleName: 'lighty',
    sourceMap: true,
    exports: 'named',
  };

  if (target === 'commonjs') {
    Object.assign(writeOptions, {
      dest: 'dist/lighty.js',
      format: 'cjs',
    });
  }

  if (target === 'ecmascript') {
    Object.assign(writeOptions, {
      dest: 'dist/lighty.es.js',
      format: 'es',
    });
  }

  if (target === 'umd' || target === 'minified-umd') {
    Object.assign(writeOptions, {
      dest: 'dist/lighty.umd.js',
      format: 'umd',
      banner: createBanner(),
    });
  }

  if (target === 'minified-umd') {
    rollupOptions.plugins.push(uglify({
      output: {
        comments: saveLicense,
      },
    }));

    Object.assign(writeOptions, {
      dest: 'dist/lighty.umd.min.js',
      banner: createBanner(true),
    });
  }

  return { rollupOptions, writeOptions };
}

function build(targets) {
  targets.forEach((target) => {
    const { rollupOptions, writeOptions } = createConfig(target);

    rollup.rollup(rollupOptions).then(bundle => bundle.write(writeOptions));
  });
}


build(['commonjs', 'ecmascript', 'umd', 'minified-umd']);
