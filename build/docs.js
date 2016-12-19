const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const jsdoc2md = require('jsdoc-to-markdown');


const OPEN_TAG = '<!-- API: BEGIN -->';
const CLOSE_TAG = '<!-- API: END -->';


const readme = readFileSync(resolve(__dirname, '../README.md')).toString();
const docs = jsdoc2md.renderSync({
  files: resolve(__dirname, '../src/**/*.js'),
});
const intro = readme.slice(0, readme.indexOf(OPEN_TAG) + OPEN_TAG.length);
const outro = readme.slice(readme.indexOf(CLOSE_TAG));


writeFileSync(
  resolve(__dirname, '../README.md'), `${intro}\n${docs}\n${outro}`
);
