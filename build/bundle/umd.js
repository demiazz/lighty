const rollup = require("rollup");
const babel = require("rollup-plugin-babel");
const commonJS = require("rollup-plugin-commonjs");
const uglify = require("rollup-plugin-uglify");
const saveLicense = require("uglify-save-license");
const { getOptions } = require("./babel");
const banner = require("./banner");
const pkg = require("./package");
const { prettifyFile } = require("./prettify");

function build(minified = false) {
  const rollupOptions = {
    entry: "src/index.js",
    exports: "named",
    plugins: [babel(getOptions()), commonJS()]
  };

  const writeOptions = {
    banner: minified ? banner.short : banner.base,
    dest: minified ? `dist/${pkg.name}.min.js` : `dist/${pkg.name}.js`,
    format: "umd",
    moduleId: pkg.name,
    moduleName: pkg.name,
    sourceMap: minified
  };

  if (minified) {
    rollupOptions.plugins.push(
      uglify({
        output: {
          comments: saveLicense
        }
      })
    );
  }

  rollup.rollup(rollupOptions).then(bundle => {
    const result = bundle.write(writeOptions);

    if (!minified) {
      result.then(() => {
        prettifyFile(writeOptions.dest);
      });
    }
  });
}

module.exports = () => {
  build();
  build(true);
};
