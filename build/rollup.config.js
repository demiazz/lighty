import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';


const config = {
  entry: 'src/index.js',
  dest: 'dist/lighty.js',
  format: 'umd',
  moduleName: 'lighty',
  plugins: [babel()],
};

if (process.env.NODE_ENV === 'production') {
  config.dest = 'dist/lighty.min.js';

  config.plugins.push(uglify());
}

export default config;
