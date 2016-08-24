import uglify from 'rollup-plugin-uglify';

import config from './rollup.base';


config.entry = 'src/index.js';
config.dest = 'dist/lighty.js';
config.format = 'umd';
config.moduleName = 'lighty';

if (process.env.NODE_ENV === 'production') {
  config.dest = 'dist/lighty.min.js';

  config.plugins.push(uglify());
}


export default config;
