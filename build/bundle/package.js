const { resolve } = require("path");
const { readFileSync } = require("fs");

const packagePath = resolve(__dirname, "../../package.json");
const packageContent = readFileSync(packagePath);
const packageInfo = JSON.parse(packageContent);

module.exports = Object.freeze(packageInfo);
