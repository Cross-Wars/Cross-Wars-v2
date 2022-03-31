const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname);
const crosswords = {};

files.map((file) => {
  if (file.startsWith('0') || file.startsWith('1')) {
    crosswords[file.slice(0, -3)] = require(path.join(__dirname, file));
  }
});
module.exports = crosswords;
