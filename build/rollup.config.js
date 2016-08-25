import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';


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

  if (process.env.NODE_ENV === 'production') {
    config.plugins.push(uglify());
  }
}


export default config;
