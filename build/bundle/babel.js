const babel = require("babel-core");

function getOptions(modules = false) {
  const babelOptions = {
    presets: [["es2015", { modules }]],
    plugins: ["transform-flow-strip-types"]
  };

  return babelOptions;
}

function transform(source, modules = false) {
  const babelOptions = getOptions(modules);

  return babel.transform(source, babelOptions).code;
}

module.exports = { getOptions, transform };
