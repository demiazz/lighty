const babel = require("babel-core");

function getOptions(options) {
  const modules = options.modules ? options.modules : false;
  const flow = options.flow ? "syntax-flow" : "transform-flow-strip-types";

  const babelOptions = {
    presets: [["es2015", { modules }]],
    plugins: [flow]
  };

  return babelOptions;
}

function transform(source, options) {
  const babelOptions = getOptions(options);

  return babel.transform(source, babelOptions).code;
}

module.exports = { getOptions, transform };
