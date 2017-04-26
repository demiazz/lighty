const buildUMD = require("./umd");
const buildES = require("./es");
const buildCommonJS = require("./commonjs");

buildUMD();
buildES();
buildCommonJS();
